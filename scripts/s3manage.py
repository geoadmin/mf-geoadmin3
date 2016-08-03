#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re
import botocore
import boto3
import sys
import os
import json
import glob
import time
import subprocess
import tempfile
import urllib2

import StringIO
import gzip
from datetime import datetime

import mimetypes
mimetypes.init()


USE_S3_UPLOAD_FILE = False


BASEDIR = "/var/www/vhosts/mf-geoadmin3/private"

BUCKET_NAME = os.environ.get('BUCKET_NAME', None)
BUCKET_LOCATION = os.environ.get('BUCKET_LOCATION', 'eu-central-1')
UPLOAD_SRC_DIR = os.environ.get('UPLOAD_SRC_DIR', 'False').lower() in ("yes", "true", "t", "1")

user = os.environ.get('USER')
PROFILE_NAME = '{}_aws_admin'.format(user)


s3 = None
s3client = None
bucket = None

NO_COMPRESS = [
    'image/png',
    'image/jpeg',
    'image/ico',
    'application/x-font-ttf',
    'application/x-font-opentype',
    'application/vnd.ms-fontobject',
    'application/vnd.ms-fontobject']

headers = {}

mimetypes.add_type('application/x-font-ttf', '.ttf')
mimetypes.add_type('application/x-font-opentype', '.otf')
mimetypes.add_type('application/vnd.ms-fontobject', '.eot')


def local_git_last_commit(basedir):
    try:
        output = subprocess.check_output(('git rev-parse HEAD',), cwd=basedir, shell=True)
        return output.strip()
    except subprocess.CalledProcessError:
        print "Not a git directory: {}".format(basedir)
    try:
        with open(os.path.join(basedir, '.build-artefacts', 'last-commit-ref'), 'r') as f:
            data = f.read()
        return data
    except IOError:
        print "Error while reading 'last-commit-ref' from {}".format(basedir)
    return None


def local_git_branch(basedir):
    output = subprocess.check_output(('git rev-parse --abbrev-ref HEAD',), cwd=basedir, shell=True)
    return output.strip()


def local_last_version(basedir):
    try:
        with open(os.path.join(basedir, '.build-artefacts', 'last-version'), 'r') as f:
            data = f.read()
        return data
    except IOError as e:
        print("Cannot find version: {}".format(e))
    return None


def init_connection(target='infra'):
    global s3, s3client, bucket, BUCKET_NAME

    if target not in ['dev', 'int', 'prod', 'infra']:
        print("Unknown DEPLOY_TARGET={}".format(target))
        usage()
        sys.exit()

    BUCKET_NAME = os.environ.get("S3_MF_GEOADMIN3_{}".format(target.upper()))

    try:
        session = boto3.session.Session(profile_name=PROFILE_NAME, region_name=BUCKET_LOCATION)
    except botocore.exceptions.ProfileNotFound as e:
        print "You need to set PROFILE_NAME to a valid profile name in $HOME/.aws/credentials"
        print e
        sys.exit(1)
    except botocore.exceptions.BotoCoreError as e:
        print "Cannot establish connection. Check you credentials ({}) " + \
            "and location ({}).".format(PROFILE_NAME, BUCKET_LOCATION)
        print e
        sys.exit(2)

    s3client = session.client('s3', config=boto3.session.Config(signature_version='s3v4'))
    s3 = session.resource('s3', config=boto3.session.Config(signature_version='s3v4'))

    bucket = s3.Bucket(BUCKET_NAME)


def _gzip_data(data):
    out = None
    infile = StringIO.StringIO()
    try:
        gzip_file = gzip.GzipFile(fileobj=infile, mode='w', compresslevel=5)
        gzip_file.write(data)
        gzip_file.close()
        infile.seek(0)
        out = infile.getvalue()
    except:
        out = None
    finally:
        infile.close()
    return out


def _unzip_data(compressed):
    inbuffer = StringIO.StringIO(compressed)
    f = gzip.GzipFile(mode='rb', fileobj=inbuffer)
    try:
        data = f.read()
    finally:
        f.close()

    return data


def save_to_s3(src, dest, cached=True, mimetype=None, break_on_error=False):

    try:
        with open(src, 'r') as f:
            data = f.read()
    except EnvironmentError:
        print "Cannot upload {}".format(src)
        if break_on_error:
            print("Exiting...")
            sys.exit(2)
        else:
            return False
    if mimetype is None:
        mimetype, _ = mimetypes.guess_type(src)

    _save_to_s3(data, dest, mimetype, cached=cached)


def _save_to_s3(in_data, dest, mimetype, compress=True, cached=True):

    data = in_data
    compressed = False
    content_encoding = None
    cache_control = 'max-age=31536000, public'

    extra_args = {}

    if compress and mimetype not in NO_COMPRESS:
        data = _gzip_data(in_data)
        content_encoding = 'gzip'
        compressed = True

    print "Uploading to {} - {}, gzip: {}, cache headers: {}".format(dest, mimetype, compressed, cached)
    if cached is False:
        cache_control = 'no-cache, no-store, max-age=0, must-revalidate'

    extra_args['ACL'] = 'public-read'
    extra_args['ContentType'] = mimetype
    extra_args['CacheControl'] = cache_control

    try:
        if compressed:
            extra_args['ContentEncoding'] = content_encoding

        if cached is False:
            extra_args['Expires'] = datetime(1990, 1, 1)
            extra_args['Metadata'] = {'Pragma': 'no-cache', 'Vary': '*'}

        if USE_S3_UPLOAD_FILE:
            temp = tempfile.NamedTemporaryFile()
            try:
                temp.write(data)
                temp.seek(0)
                s3.Object(BUCKET_NAME, dest).upload_file(temp.name, ExtraArgs=extra_args)
            finally:
                temp.close()
        else:
            s3.Object(BUCKET_NAME, dest).put(Body=data, **extra_args)

    except Exception as e:
        print "Error while uploading {}: {}".format(dest, e)


def get_index_version(c):
    version = None
    p = re.compile(ur'version: \'(\d+)\'')
    match = re.findall(p, c)
    if len(match) > 0:
        version = int(match[0])

    return version


def usage():
    print "\nManage map.geo.admin.ch versions in AWS S3 bucket\n"
    print 'Usage: ' + os.path.basename(sys.argv[0]) + ' <command> [option]'
    print
    print "Commands:"
    print
    print "  list"
    print "     list available <version> in bucket"
    print
    print "  upload [target] [dir]"
    print "      upload content of /prd directory to bucket. You may specify"
    print "      a directory (default to current)."
    print "      Active project is NOT changed. Project has to be statified, "
    print "      i.e. after PR https://github.com/geoadmin/mf-geoadmin3/pull/3078"
    print
    print "  activate <version>"
    print "      activate the given 'version', i.e."
    print "      copy from <version>/index.<version>.html to index.html"
    print
    print "  info <version>"
    print "      print build info on 'version' (branch, build date, git hash...)"
    print
    print "  delete <version>"
    print "      delete the given 'version' (both directory and indexes files"
    print
    print "  help"
    print "      print this message"


def upload(base_dir):

    epoch_time = int(time.time())

    GIT_SHORT_SHA = local_git_last_commit(base_dir)[:7]

    GIT_BRANCH = local_git_branch(base_dir)
    version = LAST_VERSION = local_last_version(base_dir).strip()

    print "version={}, branch={}, version={}".format(GIT_SHORT_SHA, GIT_BRANCH, LAST_VERSION)

    BRANCH_DIR = GIT_BRANCH  # if GIT_BRANCH != 'master' else ''
    DESTINATION_BASEDIR = os.path.join(BRANCH_DIR, GIT_SHORT_SHA, LAST_VERSION)

    DESTINATION_VERSIONED_DIR = os.path.join(DESTINATION_BASEDIR, LAST_VERSION)

    print DESTINATION_BASEDIR, DESTINATION_VERSIONED_DIR

    FILES = ['prd/lib/build.js',
             'prd/style/app.css',
             'prd/index.html',
             'prd/lib/build.js',
             'prd/img',
             'prd/style',
             'prd/lib',
             'prd/locales',
             'prd/info.json'
             ]
    if UPLOAD_SRC_DIR:
        FILES.insert(0, 'src')

    EXCLUDES = ['.less', '.gitignore', 'services', 'checker']
    VERSION = str(version)

    for fname in FILES:
        fullpath = os.path.join(base_dir, fname)
        if os.path.isfile(fullpath):
            dest = fname.replace('prd', VERSION)
            save_to_s3(fullpath, dest, cached=True)
        if os.path.isdir(fullpath):
            for (root, dirs, files) in os.walk(fullpath):
                for fn in files:
                    path = os.path.join(root, fn)
                    _, extension = os.path.splitext(fn)
                    if extension in EXCLUDES or _ in EXCLUDES:
                        continue
                    relpath = os.path.relpath(path, os.path.commonprefix([base_dir, path]))
                    dest = relpath.replace('prd', DESTINATION_VERSIONED_DIR)
                    if dest == relpath:
                        dest = relpath.replace('src', DESTINATION_BASEDIR + '/src')
                    save_to_s3(path, dest, cached=True)

    for fname in ('index.html', 'embed.html', 'mobile.html', 'info.json'):
        save_to_s3(
            os.path.join(
                base_dir,
                'prd/{}'.format(fname)),
            DESTINATION_BASEDIR + '/{}'.format(
                fname),
            cached=False)

    save_to_s3(
        os.path.join(
            base_dir,
            'prd/cache/services'),
        '{}/services'.format(DESTINATION_VERSIONED_DIR),
        cached=True,
        mimetype='application/js')

    for lang in ('de', 'fr', 'it', 'rm', 'en'):
        # FIXME This is needed until https://github.com/geoadmin/mf-chsdi3/pull/1905 is merged
        oldname = os.path.join(base_dir, 'prd/cache/layersConfig.{}'.format(lang))
        newname = os.path.join(base_dir, 'prd/cache/layersConfig.{}.json'.format(lang))
        if os.path.isfile(newname):
            filename = newname
        else:
            filename = oldname
        save_to_s3(filename,
                   '{}/layersConfig.{}.json'.format(DESTINATION_VERSIONED_DIR, lang),
                   cached=True,
                   mimetype='application/js')
        save_to_s3(filename,
                   '{}/src/layersConfig.{}.json'.format(DESTINATION_BASEDIR, lang),
                   cached=True,
                   mimetype='application/js')
        # Ugly, for old projects
        save_to_s3(filename,
                   '{}/layersConfig'.format(DESTINATION_VERSIONED_DIR),
                   cached=True,
                   mimetype='application/js')

    # appcache need to be changed by every upload!
    appcache_versioned_file = get_appcache_file(os.path.join(base_dir, 'prd'))
    print appcache_versioned_file
    save_to_s3(
        os.path.join(
            appcache_versioned_file),
        DESTINATION_BASEDIR + '/' + 'geoadmin.{}.appcache'.format(epoch_time),
        cached=False,
        mimetype='text/cache-manifest')

    save_to_s3(
        os.path.join(
            base_dir,
            'prd/robots.txt'),
        '{}/robots.txt'.format(DESTINATION_BASEDIR),
        cached=False,
        mimetype='text/plain')

    save_to_s3(
        os.path.join(
            base_dir,
            'prd/checker'),
        '{}/checker'.format(DESTINATION_BASEDIR),
        cached=False,
        mimetype='text/plain')

    save_to_s3(
        os.path.join(
            base_dir,
            'prd/cache/services'),
        '{}/src/services'.format(DESTINATION_BASEDIR),
        cached=True,
        mimetype='application/js')

    url_to_check = "https://mf-geoadmin3.infra.bgdi.ch/{}/".format(DESTINATION_BASEDIR)

    print "Upload finished"
    print("\n\nPlease check it on: {}index.html\n".format(url_to_check))
    print("and {}src/index.html\n".format(url_to_check))


def get_appcache_file(directory, first=True):
    filenames = glob.glob(os.path.join(directory, '*.appcache'))
    if first:
        return filenames[0] if len(filenames) > 0 else filenames
    else:
        return filenames


def get_active_version():
    k = s3.Object(bucket.name, 'index.html')
    try:
        c = k.get()["Body"].read()
        d = _unzip_data(c)
    except botocore.exceptions.ClientError as e:
        if 'NoSuchKey' in str(e):
            print "No active version in bucket {}".format(BUCKET_NAME)
            return 0
        else:
            print "Error: ", e
            sys.exit(3)
    except IOError as e:
        return 0

    return int(get_index_version(d))


def version_exists(version):
    files = bucket.objects.filter(Prefix=str(version)).all()

    return len(list(files)) > 0


def get_version_info(version):
    print version
    obj = s3.Object(bucket.name, '{}/info.json'.format(version))
    try:
        content = obj.get()["Body"].read()
        raw = _unzip_data(content)
        data = json.loads(raw)
    except botocore.exceptions.ClientError:
        return None
    except botocore.exceptions.BotoCoreError:
        return None
    return data


def get_head_sha(branch):

    resp = urllib2.urlopen(
        "https://api.github.com/repos/geoadmin/mf-geoadmin3/commits?sha={}".format(branch.replace('/', '')))
    data = json.load(resp)

    return data[0]['sha']


def list_version():

    branches = bucket.meta.client.list_objects(Bucket=bucket.name,
                                               Delimiter='/')
    for o in branches.get('CommonPrefixes'):
        branch = o.get('Prefix')
        head_sha = None
        if re.search(r"^\D", branch):
            print(branch)
            shas = bucket.meta.client.list_objects(Bucket=bucket.name,
                                                   Prefix=branch, Delimiter="/")

            for s in shas.get('CommonPrefixes'):
                sha = s.get('Prefix')
                nice_sha = sha.replace(branch, "").replace('/', '')

                if head_sha is None:
                    head_sha = get_head_sha(branch)
                    is_head = 'HEAD' if nice_sha in head_sha else '--'
                print('  {} - {} ({})'.format(nice_sha, is_head, head_sha))

                builds = bucket.meta.client.list_objects(Bucket=bucket.name,
                                                         Prefix=sha, Delimiter="/")
                for b in builds.get('CommonPrefixes'):
                    build = b.get('Prefix')
                    print('    ' + build.replace(sha, ""))


def version_info(version):
    info = get_version_info(version)
    if info is None:
        print "No info for version {}".format(version)
        sys.exit(1)
    for k in info.keys():
        print "{}: {}".format(k, info[k])


def delete_version(version):
    if version_exists(version) is False:
        print("Version '{}' does not exists in AWS S3. Aborting".format(version))
        sys.exit(2)

    if version == get_active_version():
        print("Version '{}' is the active version. You cannot delete it".format(version))
        sys.exit()

    files = bucket.objects.filter(Prefix=str(version)).all()

    indexes = [{'Key': k.key} for k in files]
    for n in ('index', 'embed', 'mobile'):
        src_key_name = '{}.{}.html'.format(n, version)
        indexes.append({'Key': src_key_name})

    resp = s3client.delete_objects(Bucket=BUCKET_NAME, Delete={'Objects': indexes})

    for v in resp['Deleted']:
        print v


def activate(version):
    if version_exists(version) is False:
        print("Version '{}' does not exists in AWS S3. Aborting".format(version))
        sys.exit(2)

    if version == get_active_version():
        print("Version '{}' is already the active version. Doing nothing".format(version))
        sys.exit()

    # Source files

    files = bucket.objects.filter(Prefix='{}/src'.format(version)).all()

    for k in files:
        src_key_name = k.key
        dst_key_name = src_key_name.replace('{}/'.format(version), '')
        print("{} --> {}".format(src_key_name, dst_key_name))

        s3client.copy_object(
            Bucket=BUCKET_NAME,
            CopySource=BUCKET_NAME +
            '/' +
            src_key_name,
            Key=dst_key_name,
            ACL='public-read')

    # Prod files
    for n in ('index', 'embed', 'mobile'):
        src_key_name = '{}.{}.html'.format(n, version)
        print("{} --> {}.html".format(src_key_name, n))

        s3client.copy_object(
            Bucket=BUCKET_NAME,
            CopySource=BUCKET_NAME +
            '/' +
            src_key_name,
            Key=n +
            '.html',
            ACL='public-read')
    print "Special files"

    # Delete older appcache files
    appcache_versioned_files = list(bucket.objects.filter(Prefix='geoadmin.').all())
    indexes = [{'Key': k.key} for k in appcache_versioned_files if k.key.endswith('.appcache')]
    if len(indexes) > 0:
        s3client.delete_objects(Bucket=BUCKET_NAME, Delete={'Objects': indexes})

    appcache = None
    files = list(bucket.objects.filter(Prefix='{}/geoadmin.'.format(version)).all())
    if len(files) > 0:
        appcache = os.path.basename(sorted(files)[-1].key)
    for j in ('robots.txt', 'checker', appcache):
        src_key_name = '{}/{}'.format(version, j)
        print src_key_name, os.path.basename(src_key_name)
        try:
            s3client.copy_object(
                Bucket=BUCKET_NAME,
                CopySource=BUCKET_NAME + '/' + src_key_name,
                Key=os.path.basename(src_key_name),
                CopySourceIfModifiedSince=datetime(2015, 1, 1),
                ACL='public-read')
        except botocore.exceptions.ClientError as e:
            print "Cannot copy {}: {}".format(j, e)

    print("\n\nPlease check it on {}".format(get_url()))
    print("  and {}".format(get_url('src/index.html')))


def get_url(key_name='index.html'):
    bucket_location = BUCKET_LOCATION
    object_url = "https://s3-{0}.amazonaws.com/{1}/{2}".format(
        bucket_location,
        BUCKET_NAME,
        key_name)
    return object_url


def build(git_branch, git_sha):
    dirpath = tempfile.mkdtemp()
    epoch_time = int(time.time())

    git_clone_cmd = "git clone --depth 1 -b {}  https://github.com/geoadmin/mf-geoadmin3.git  {}".format(
        git_branch, epoch_time)

    print dirpath

    try:
        output = subprocess.check_output((git_clone_cmd,), cwd=dirpath, shell=True)
        print output
    except subprocess.CalledProcessError:
        print "Error"
    try:
        output = subprocess.check_output(
            ('make cleanall all',), cwd=os.path.join(
                dirpath, str(epoch_time)), shell=True)
        print output
    except subprocess.CalledProcessError:
        print "Error"

    # shutil.rmtree(dirpath)


def main():
    global BUCKET_NAME

    # We use Bucket infra for now

    target = os.environ.get("DEPLOY_TARGET", None)
    init_connection(target=target)

    if len(sys.argv) < 2:
        usage()
        sys.exit()

    if str(sys.argv[1]) == 'build':
        git_branch = 'master'
        git_sha = None
        if len(sys.argv) > 2:
            git_branch = sys.argv[2]
        if len(sys.argv) > 3:
            git_sha = sys.argv[3]
        build(git_branch, git_sha)

    if str(sys.argv[1]) == 'upload':

        if len(sys.argv) < 3:
            usage()
            sys.exit()
        target = sys.argv[2]
        init_connection(target)

        if BUCKET_NAME is None:
            print "Please define the BUCKET_NAME you want to deploy."
            sys.exit(2)

        if len(sys.argv) == 4:
            base_dir = os.path.abspath(sys.argv[3])
            if not os.path.isdir(base_dir):
                print "No code found in directory {}".format(base_dir)
                sys.exit(2)
        else:
            base_dir = os.getcwd()

        upload(base_dir)

    elif str(sys.argv[1]) == 'list':
        if len(sys.argv) < 3:
            usage()
            sys.exit()
        target = sys.argv[2]

        init_connection(target=target)
        list_version()

    elif str(sys.argv[1]) == 'info' and len(sys.argv) == 3:
        version = int(sys.argv[2])
        version_info(version)

    elif str(sys.argv[1]) == 'activate' and len(sys.argv) == 3:
        version = int(sys.argv[2])
        print("Trying to activate version '{}'".format(version))
        activate(version)

    elif str(sys.argv[1]) == 'delete' and len(sys.argv) == 3:
        version = int(sys.argv[2])
        print("Trying to delete version '{}'".format(version))
        delete_version(version)
    else:
        usage()

if __name__ == '__main__':
    main()
