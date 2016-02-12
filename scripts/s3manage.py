#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re
import botocore
import boto3
import sys
import os
import json

import StringIO
import gzip
from datetime import datetime

import mimetypes
mimetypes.init()

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


def init_connection():
    global s3, s3client, bucket
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


def save_to_s3(src, dest, cached=True, mimetype=None):

    try:
        with open(src, 'r') as f:
            data = f.read()
    except EnvironmentError:
        print "Cannot upload {}".format(src)
        sys.exit(2)
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
    print "  upload [dir]"
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


def upload(version, base_dir):
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
                    dest = relpath.replace('prd', VERSION)
                    if dest == relpath:
                        dest = relpath.replace('src', VERSION + '/src')
                    save_to_s3(path, dest, cached=True)

    for n in ('index', 'embed', 'mobile'):
        save_to_s3(
            os.path.join(
                base_dir,
                'prd/{}.html'.format(n)),
            '{}.{}.html'.format(
                n,
                VERSION),
            cached=False)

    save_to_s3(
        os.path.join(
            base_dir,
            'prd/cache/services'),
        '{}/services'.format(VERSION),
        cached=True,
        mimetype='application/js')

    for lang in ('de', 'fr', 'it', 'rm', 'en'):
        save_to_s3(os.path.join(base_dir, 'prd/cache/layersConfig.{}.json'.format(lang)),
                   '{}/layersConfig.{}.json'.format(VERSION, lang), cached=True, mimetype='application/js')

    appcache_versioned_file = 'geoadmin.{}.appcache'.format(VERSION)
    save_to_s3(
        os.path.join(
            base_dir,
            'prd/' + appcache_versioned_file),
        VERSION + '/' + appcache_versioned_file,
        cached=False,
        mimetype='text/cache-manifest')

    save_to_s3(
        os.path.join(
            base_dir,
            'prd/robots.txt'),
        '{}/robots.txt'.format(VERSION),
        cached=False,
        mimetype='text/plain')

    save_to_s3(
        os.path.join(
            base_dir,
            'prd/checker'),
        '{}/checker'.format(VERSION),
        cached=False,
        mimetype='text/plain')

    save_to_s3(
        os.path.join(
            base_dir,
            'prd/cache/services'),
        '{}/src/services'.format(VERSION),
        cached=True,
        mimetype='application/js')

    for lang in ('de', 'fr', 'it', 'rm', 'en'):
        save_to_s3(os.path.join(base_dir, 'prd/cache/layersConfig.{}.json'.format(lang)),
                   '{}/src/layersConfig.{}.json'.format(VERSION, lang),
                   cached=True,
                   mimetype='application/js')

    check_url = get_url("index.{}.html".format(VERSION))

    print "Upload finished"
    print("\n\nPlease check it on {}\n".format(check_url))
    print("and {}\n".format(get_url("{}/src/index.html".format(VERSION))))


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

    return int(get_index_version(d))


def version_exists(version):
    files = bucket.objects.filter(Prefix=str(version)).all()

    return len(list(files)) > 0


def get_version_info(version):
    obj = s3.Object(bucket.name, '{}/info.json'.format(version))
    try:
        content = obj.get()["Body"].read()
        raw = _unzip_data(content)
        data = json.loads(raw)
    except botocore.exceptions.BotoCoreError:
        return None
    return data


def list_version():
    active_version = int(get_active_version())

    indexes = bucket.objects.filter(Prefix="index").all()

    p = re.compile(ur'index.(\d+).html')
    print "Version      Build date"
    print "-----------+------------------------"
    for index in indexes:
        match = re.search(p, index.key)
        if match:
            version = int(match.groups()[0])
            print version, index.last_modified, 'active' if version == active_version else ''


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
    for j in ('robots.txt', 'geoadmin.{}.appcache'.format(version), 'checker'):
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


def main():
    if BUCKET_NAME is None:
        print "Please define the BUCKET_NAME you want to deploy."
        sys.exit(2)
    if s3client is None:
        init_connection()

    if len(sys.argv) < 2:
        usage()
        sys.exit()

    if str(sys.argv[1]) == 'upload':

        if len(sys.argv) == 3:
            base_dir = os.path.abspath(sys.argv[2])
            if not os.path.isdir(base_dir):
                print "No code found in directory {}".format(base_dir)
                sys.exit(2)
        else:
            base_dir = os.getcwd()

        with open(os.path.join(base_dir, 'prd/index.html'), 'r') as f:
            ctx = f.read()

        VERSION = get_index_version(ctx)

        active_version = get_active_version()

        if VERSION == active_version:
            msg = "WARNING!!!\nVersion {} is the active one!!!\n" + \
                "Do you really want to upload it from '{}'?: [y/N]"
            response = raw_input(msg.format(VERSION, base_dir))
        else:
            if version_exists(VERSION) is False:
                msg = "Do you want to upload version '{}' from '{} " + \
                    "into bucket {}'?: [y/N]"
                response = raw_input(msg.format(VERSION, base_dir, BUCKET_NAME))
            else:
                msg = "Version '{}' already exists in bucket {}. Do you really want to overwrite " + \
                    "it with files from '{}'?: [y/N]"
                response = raw_input(msg.format(VERSION, BUCKET_NAME, base_dir))

        if response != 'y':
            print "Aborting"
            sys.exit()
        upload(VERSION, base_dir)

    elif str(sys.argv[1]) == 'list':
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
