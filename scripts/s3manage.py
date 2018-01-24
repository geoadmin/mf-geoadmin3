# -*- coding: utf-8 -*-

import re
import botocore
import boto3
import sys
import os
import json
import subprocess

import StringIO
import gzip
from datetime import datetime
from textwrap import dedent
import mimetypes


def usage():
    print(dedent('''\
        Manage map.geo.admin.ch versions in AWS S3 bucket. Please make sure all your env variables are set.
        (namely S3_MF_GEOADMIN3_INFRA)

        Usage:

            .build-artefacts/python-venv/bin/python scripts/s3manage.py
                                                    <upload|list|info|activate|delete> (cmd type)
                                                    <options>

        A verions deployed to S3 is always defined by:

        <s3version> = <branch_name>/<sha>/<version>

        Commands:

            upload:   Upload content of /prd (and /src) directory to a bucket.
                      You may specify a directory (it defaults to current).

                      Example: python scripts/s3manage.py upload <snapshotdir> <deploy_target>
                                                          <named_branch|optional>

            list:     List available <version> in a bucket.

                      Example: python scripts/s3manage.py list <deploy_target>

            info:     Print the info.json file.

                      Example: python scripts/s3manage.py info <s3version> <deploy_target>

            activate: Activate a version at the root of a bucket.

                      Example: python scripts/s3manage.py activate <s3version> <deploy_target>

            delete:   Delete an existing project.

                      Example: python scripts/s3manage.py delete <s3version> <deploy_target>
    '''))


mimetypes.init()
mimetypes.add_type('application/x-font-ttf', '.ttf')
mimetypes.add_type('application/x-font-opentype', '.otf')
mimetypes.add_type('application/vnd.ms-fontobject', '.eot')
mimetypes.add_type('application/json', '.json')
mimetypes.add_type('text/cache-manifest', '.appcache')
mimetypes.add_type('text/plain', '.txt')

NO_COMPRESS = [
    'image/png',
    'image/jpeg',
    'image/x-icon',
    'image/vnd.microsoft.icon',
    'application/x-font-ttf',
    'application/x-font-opentype',
    'application/vnd.ms-fontobject']


def local_git_last_commit(basedir):
    try:
        output = subprocess.check_output(('git rev-parse HEAD',), cwd=basedir, shell=True)
        return output.strip()
    except subprocess.CalledProcessError:
        print('Not a git directory: %s' % basedir)
    try:
        with open(os.path.join(basedir, '.build-artefacts', 'last-commit-ref'), 'r') as f:
            data = f.read()
        return data
    except IOError:
        print('Error while reading \'last-commit-ref\' from %s' % basedir)
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
        print('Cannot find version: %s' % e)
    return None


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


def save_to_s3(src, dest, bucket_name, cached=True, mimetype=None, break_on_error=False):
    try:
        with open(src, 'r') as f:
            data = f.read()
    except EnvironmentError as e:
        print('Failed to upload %s' % src)
        print(str(e))
        if break_on_error:
            print("Exiting...")
            sys.exit(1)
        else:
            return False
    _save_to_s3(data, dest, mimetype, bucket_name, cached=cached)


def _save_to_s3(in_data, dest, mimetype, bucket_name, compress=True, cached=True):
    data = in_data
    compressed = False
    content_encoding = None
    cache_control = 'max-age=31536000, public'
    extra_args = {}

    if compress and mimetype not in NO_COMPRESS:
        data = _gzip_data(in_data)
        content_encoding = 'gzip'
        compressed = True

    if cached is False:
        cache_control = 'max-age=0, must-revalidate, s-maxage=300'

    extra_args['ACL'] = 'public-read'
    extra_args['ContentType'] = mimetype
    extra_args['CacheControl'] = cache_control

    try:
        print('Uploading to %s - %s, gzip: %s, cache headers: %s' % (dest, mimetype, compressed, cached))
        if compressed:
            extra_args['ContentEncoding'] = content_encoding

        if cached is False:
            extra_args['Expires'] = datetime(1990, 1, 1)
            extra_args['Metadata'] = {'Pragma': 'no-cache', 'Vary': '*'}

        s3.Object(bucket_name, dest).put(Body=data, **extra_args)
    except Exception as e:
        print('Error while uploading %s: %s' % (dest, e))


def get_index_version(c):
    version = None
    p = re.compile(ur'version: \'(\d+)\'')
    match = re.findall(p, c)
    if len(match) > 0:
        version = int(match[0])
    return version


def create_s3_dir_path(base_dir, named_branch, git_branch):
    print(base_dir)
    if git_branch is None:
        git_branch = local_git_branch(base_dir)
    version = local_last_version(base_dir).strip()
    if named_branch:
        return (git_branch, version)
    git_short_sha = local_git_last_commit(base_dir)[:7]
    return (os.path.join(git_branch, git_short_sha, version), version)


def is_cached(file_name, named_branch):
    if named_branch:
        return False
    # 1 exception
    if file_name == 'services':
        return True
    _, extension = os.path.splitext(file_name)
    return bool(extension not in ['.html', '.txt', '.appcache', ''])


def get_file_mimetype(local_file):
    if local_file.endswith('services'):
        return 'application/json'
    else:
        mimetype, _ = mimetypes.guess_type(local_file)
        if mimetype:
            return mimetype
        return 'text/plain'


def upload(bucket_name, base_dir, deploy_target, named_branch, git_branch):
    s3_dir_path, version = create_s3_dir_path(base_dir, named_branch, git_branch)
    print('Destination folder is:')
    print('%s' % s3_dir_path)
    upload_directories = ['prd', 'src']
    exclude_filename_patterns = ['.less', '.gitignore', '.mako.']
    root_files = ('index.html', 'mobile.html', 'embed.html', '404.html',
                  'robots.txt', 'robots_prod.txt', 'favicon.ico',
                  'checker', 'geoadmin.%s.appcache' % version)

    for directory in upload_directories:
        for file_path_list in os.walk(os.path.join(base_dir, directory)):
            file_names = file_path_list[2]
            if len(file_names) > 0:
                file_base_path = file_path_list[0]
                for file_name in file_names:
                    if len([p for p in exclude_filename_patterns if p in file_name]) == 0:
                        is_chsdi_cache = bool(file_base_path.endswith('cache'))
                        local_file = os.path.join(file_base_path, file_name)
                        relative_file_path = file_base_path.replace('cache', '')
                        if directory == 'prd':
                            # Take only files directly in prd/
                            if file_name in root_files and relative_file_path.endswith('prd'):
                                relative_file_path = relative_file_path.replace('prd', '')
                            else:
                                relative_file_path = relative_file_path.replace('prd', version)
                        relative_file_path = relative_file_path.replace(base_dir + '/', '')
                        remote_file = os.path.join(s3_dir_path, relative_file_path, file_name)
                        # Don't cache some files
                        cached = is_cached(file_name, named_branch)
                        mimetype = get_file_mimetype(local_file)
                        save_to_s3(local_file, remote_file, bucket_name, cached=cached, mimetype=mimetype)
                        # Also upload chsdi metadata file to src folder if available
                        if is_chsdi_cache:
                            relative_file_path = relative_file_path.replace(version + '/', '')
                            remote_file = os.path.join(s3_dir_path, 'src/', relative_file_path, file_name)
                            save_to_s3(local_file, remote_file, bucket_name, cached=cached, mimetype=mimetype)

    url_to_check = 'https://mf-geoadmin3.%s.bgdi.ch/' % deploy_target
    print('S3 version path: ')
    # This line is used by jenkins to get the S3_VERSION_PATH
    print(s3_dir_path)
    print('Test url: ')
    # This line is used by jenkins to get the E2E_TARGETURL
    print('%s%s/index.html' % (url_to_check, s3_dir_path))


def list_version():
    branches = bucket.meta.client.list_objects(Bucket=bucket.name,
                                               Delimiter='/')
    for b in branches.get('CommonPrefixes'):
        branch = b.get('Prefix')
        if re.search(r'^\D', branch):
            shas = bucket.meta.client.list_objects(Bucket=bucket.name,
                                                   Prefix=branch,
                                                   Delimiter='/')
            shas = shas.get('CommonPrefixes')
            if shas:
                for s in shas:
                    sha = s.get('Prefix')
                    nice_sha = sha.replace(branch, '').replace('/', '')
                    # Full version path to display
                    if re.match('[0-9a-f]{7}$', nice_sha) is not None:
                        builds = bucket.meta.client.list_objects(Bucket=bucket.name,
                                                                 Prefix=sha,
                                                                 Delimiter='/')
                        for v in builds.get('CommonPrefixes'):
                            build = v.get('Prefix')
                            print('Full version: %s%s/%s' % (branch,
                                                             nice_sha,
                                                             build.replace(sha, '').replace('/', '')))
                    else:
                        # Matching a version of the deployed branch
                        if re.match('[0-9]{10}', nice_sha):
                            print('Named branch: %s (version: %s)' % (branch.replace('/', ''), nice_sha))
            else:
                print('Not a official path for branch %s' % branch)


def get_version_info(s3_path):
    print('App version is: %s' % s3_path)
    version_target = s3_path.split('/')[2]
    obj = s3.Object(bucket.name, '%s/%s/info.json' % (s3_path, version_target))
    try:
        content = obj.get()["Body"].read()
        raw = _unzip_data(content)
        data = json.loads(raw)
    except botocore.exceptions.ClientError:
        return None
    except botocore.exceptions.BotoCoreError:
        return None
    return data


def version_info(s3_path):
    info = get_version_info(s3_path)
    if info is None:
        print('No info for version %s' % s3_path)
        sys.exit(1)
    for k in info.keys():
        print('%s: %s' % (k, info[k]))


def version_exists(s3_path):
    files = bucket.objects.filter(Prefix=str(s3_path)).all()
    return len(list(files)) > 0


def delete_version(s3_path, bucket_name):
    if version_exists(s3_path) is False:
        print('Version <%s> does not exists in AWS S3. Aborting' % s3_path)
        sys.exit(1)

    msg = raw_input('Are you sure you want to delete all files in <%s>?\n' % s3_path)
    if msg.lower() in ('y', 'yes'):
        files = bucket.objects.filter(Prefix=str(s3_path)).all()
        n = 200
        indexes = [{'Key': k.key} for k in files]
        for i in xrange(0, len(indexes), n):
            resp = s3client.delete_objects(Bucket=bucket_name, Delete={'Objects': indexes[i: i + n]})
            for v in resp['Deleted']:
                print(v)
    else:
        print('Aborting deletion of <%s>.' % s3_path)


def get_url(deploy_target, key_name='index.html'):
    bucket_host = 'mf-geoadmin3.%s.bgdi.ch' % deploy_target
    object_url = 'https://%s/%s' % (bucket_host, key_name)
    return object_url


def activate_version(s3_path, bucket_name, deploy_target):
    if version_exists(s3_path) is False:
        print('Version <%s> does not exists in AWS S3. Aborting' % s3_path)
        sys.exit(1)

    msg = raw_input('Are you sure you want to activate version <%s>?\n' % s3_path)
    if msg.lower() in ('y', 'yes'):
        # Prod files
        for n in ('index', 'embed', 'mobile', '404'):
            src_key_name = '{}/{}.html'.format(s3_path, n)
            print('{} --> {}.html'.format(src_key_name, n))
            s3client.copy_object(
                Bucket=bucket_name,
                CopySource=bucket_name + '/' + src_key_name,
                Key=n + '.html',
                ACL='public-read')
        # Delete older appcache files
        appcache_versioned_files = list(bucket.objects.filter(Prefix='geoadmin.').all())
        indexes = [{'Key': k.key} for k in appcache_versioned_files if k.key.endswith('.appcache')]
        if len(indexes) > 0:
            s3client.delete_objects(Bucket=bucket_name, Delete={'Objects': indexes})

        appcache = None
        files = list(bucket.objects.filter(Prefix='{}/geoadmin.'.format(s3_path)).all())
        if len(files) > 0:
            appcache = os.path.basename(sorted(files)[-1].key)
        for j in ('robots.txt', 'checker', 'favicon.ico', appcache):
            # In prod move robots prod
            src_file_name = 'robots_prod.txt' if j == 'robots.txt' and deploy_target == 'prod' else j
            src_key_name = '{}/{}'.format(s3_path, src_file_name)
            print('%s ---> %s' % (src_key_name, j))
            try:
                s3client.copy_object(
                    Bucket=bucket_name,
                    CopySource=bucket_name + '/' + src_key_name,
                    Key=j,
                    CopySourceIfModifiedSince=datetime(2015, 1, 1),
                    ACL='public-read')
            except botocore.exceptions.ClientError as e:
                print('Cannot copy {}: {}'.format(j, e))
        print('\nPlease check it on:\n{}'.format(get_url(deploy_target)))
        print('And:\n{}'.format(get_url(deploy_target, key_name=s3_path + '/src/index.html')))
    else:
        print('Aborting activation of version {}'.format(s3_path))
        sys.exit(1)


def init_connection(bucket_name, profile_name):
    try:
        session = boto3.session.Session(profile_name=profile_name)
    except botocore.exceptions.ProfileNotFound as e:
        print('You need to set PROFILE_NAME to a valid profile name in $HOME/.aws/credentials')
        print(e)
        sys.exit(1)
    except botocore.exceptions.BotoCoreError as e:
        print('Cannot establish connection. Check you credentials %s.' % profile_name)
        print(e)
        sys.exit(1)

    s3client = session.client('s3', config=boto3.session.Config(signature_version='s3v4'))
    s3 = session.resource('s3', config=boto3.session.Config(signature_version='s3v4'))

    bucket = s3.Bucket(bucket_name)
    return (s3, s3client, bucket)


def exit_usage(cmd_type):
    usage()
    print('Missing one arg for %s command' % cmd_type)
    sys.exit(1)


def parse_arguments(argv):
    if len(argv) < 2:
        exit_usage('UNKNOWN')

    cmd_type = str(argv[1])

    supported_cmds = ('upload', 'list', 'info', 'activate', 'delete')
    if cmd_type not in supported_cmds:
        usage()
        print('Command %s not supported' % cmd_type)
        sys.exit(1)

    if cmd_type == 'upload' and len(argv) < 5:
        exit_usage(cmd_type)
    elif cmd_type == 'list' and len(argv) != 3:
        exit_usage(cmd_type)
    elif cmd_type == 'info' and len(argv) != 4:
        exit_usage(cmd_type)
    elif cmd_type == 'activate' and len(argv) != 4:
        exit_usage(cmd_type)
    elif cmd_type == 'delete' and len(argv) != 4:
        exit_usage(cmd_type)

    named_branch = None
    git_branch = None
    base_dir = os.getcwd()
    if cmd_type == 'upload':
        base_dir = os.path.abspath(argv[2])
        if not os.path.isdir(base_dir):
            print('No code found in directory %s' % base_dir)
            sys.exit(1)
        if len(argv) >= 5:
            named_branch = True if argv[4] == 'true' else False
        if len(argv) == 6:
            git_branch = argv[5]

    if cmd_type in ('activate', 'upload', 'info', 'delete'):
        deploy_target = argv[3].lower()
    elif cmd_type in ('list'):
        deploy_target = argv[2].lower()

    if deploy_target not in ('infra', 'int', 'prod'):
        print('%s is not a valid deploy target' % deploy_target)
        sys.exit(1)

    s3_path = None
    if cmd_type in ('info', 'activate', 'delete'):
        s3_path = argv[2]
        if s3_path.endswith('/'):
            s3_path = s3_path[:len(s3_path) - 1]
        # Delete named branch as well
        if s3_path.count('/') not in (0, 2):
            usage()
            print('Bad version definition')
            sys.exit(1)
        if s3_path.count('/') == 0 and cmd_type in ('activate', 'info'):
            usage()
            print('Cmd activate/info not supported for named branches.')
            print('Please provide a full version path.')
            sys.exit(1)

    bucket_name = 'mf-geoadmin3-%s-dublin' % deploy_target.lower()
    user = os.environ.get('USER')
    profile_name = None
    if user is not None:
        profile_name = '{}_aws_admin'.format(user)

    return (cmd_type, deploy_target, base_dir, named_branch, git_branch,
            bucket_name, s3_path, profile_name)


def main():
    global s3, s3client, bucket
    print(parse_arguments(sys.argv))
    cmd_type, deploy_target, base_dir, named_branch, git_branch, bucket_name, s3_path, profile_name = \
        parse_arguments(sys.argv)
    s3, s3client, bucket = init_connection(bucket_name, profile_name)

    if cmd_type == 'upload':
        print('Uploading %s to s3' % base_dir)
        upload(bucket_name, base_dir, deploy_target, named_branch, git_branch)
    elif cmd_type == 'list':
        if len(sys.argv) < 2:
            usage()
            sys.exit(1)
        list_version()
    elif cmd_type == 'info':
        version_info(s3_path)
    elif cmd_type == 'activate':
        print('Activating version \'{}\''.format(s3_path))
        activate_version(s3_path, bucket_name, deploy_target)
    elif cmd_type == 'delete':
        print('Trying to delete version \'{}\''.format(s3_path))
        delete_version(s3_path, bucket_name)
    else:
        usage()

if __name__ == '__main__':
    main()
