#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re
import botocore
import boto3
import sys
import os
import json
import subprocess
import click

import StringIO
import gzip
from datetime import datetime
from textwrap import dedent
import mimetypes

TARGETS = ['infra', 'dev', 'int', 'prod']

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

project = os.environ.get('PROJECT', 'mf-geoadmin3')


def _get_bucket_name(deploy_target):
    if project == 'mf-geoadmin3':
        return 'mf-geoadmin3-%s-dublin' % deploy_target.lower()
    else:
        return 'mf-geoadmin4-%s-dublin' % deploy_target.lower()


def get_bucket_name(target):
    if target in TARGETS:
        return _get_bucket_name(target)
    else:
        return target


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


def local_git_commit_short(basedir):
    output = subprocess.check_output(('git rev-parse --short HEAD'), cwd=basedir, shell=True)
    return output.strip()


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
    mimetype = get_file_mimetype(src)
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
        print('Uploading to %s - %s, gzip: %s, cache headers: %s' %
              (dest, mimetype, compressed, cached))
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

# DEPR: this is the legacy upload method and can be removed in a future
# release if dist stuff works properly


def upload(bucket_name, base_dir, deploy_target, named_branch, git_branch, bucket_url):
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
                        save_to_s3(
                            local_file,
                            remote_file,
                            bucket_name,
                            cached=cached,
                            mimetype=mimetype)
                        # Also upload chsdi metadata file to src folder if available
                        if is_chsdi_cache:
                            relative_file_path = relative_file_path.replace(version + '/', '')
                            remote_file = os.path.join(
                                s3_dir_path, 'src/', relative_file_path, file_name)
                            save_to_s3(
                                local_file,
                                remote_file,
                                bucket_name,
                                cached=cached,
                                mimetype=mimetype)

    url_to_check = bucket_url if bucket_url.endswith('/') else bucket_url + '/'
    print('S3 version path: ')
    # This line is used by jenkins to get the S3_VERSION_PATH
    print(s3_dir_path)
    print('Test url: ')
    # This line is used by jenkins to get the E2E_TARGETURL
    print('%s%s/index.html' % (url_to_check, s3_dir_path))


def upload_dist(bucket_name, base_dir, deploy_target, named_branch, git_branch, bucket_url):
    print("base_dir", base_dir)
    version = local_last_version(base_dir).strip()
    dist_dir = 'dist'

    file_nr = 0
    for root, dirs, files in os.walk(os.path.join(base_dir, dist_dir)):
        # empty directory
        if len(files) == 0:
            continue
        for fil in files:
            local_file_path = os.path.join(root, fil)

            # get the relative part of file_path after base_dir/dist_dir/
            s3_rel_path = os.path.relpath(local_file_path, os.path.join(base_dir, dist_dir))

            # add the branch and version (i.e. timestamp) info
            s3_file_path = os.path.join(git_branch, version, s3_rel_path)

            file_nr += 1

            print("{} => s3://{}/{}".format(local_file_path, bucket_name, s3_file_path))
            save_to_s3(
                local_file_path,
                s3_file_path,
                bucket_name,
                cached=False,
                mimetype=None)

    print('Number of files uploaded: {}'.format(file_nr))
    url_to_check = bucket_url if bucket_url.endswith('/') else bucket_url + '/'
    s3_dir_path = os.path.join(git_branch, version)
    # This line is used by jenkins to get the VERSION
    print('Version that was uploaded:')
    print(version)
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
                            print(
                                'Full version: %s%s/%s' %
                                (branch, nice_sha, build.replace(
                                    sha, '').replace(
                                    '/', '')))
                    else:
                        # Matching a version of the deployed branch
                        if re.match('[0-9]{10}', nice_sha):
                            print('Named branch: %s (version: %s)' %
                                  (branch.replace('/', ''), nice_sha))
            else:
                print('Not a official path for branch %s' % branch)


def list_dist_version():
    # Note: branch-names containing '/' are currently not supported!
    branches = bucket.meta.client.list_objects(
        Bucket=bucket.name,
        Delimiter='/')

    # get list of 'unique' branch names
    for b in branches.get('CommonPrefixes'):
        branch = b.get('Prefix')
        # "new" style pattern is
        # /<branch_name>/<timestamp>/files
        # where <branch_name> can be any "named" branch or master
        # and <timestamp> is of the form 1902190815
        # we consider only "new" style versions
        _subfolders = bucket.meta.client.list_objects(
            Bucket=bucket.name,
            Prefix=branch,
            Delimiter='/'
        )
        subfolders = _subfolders.get('CommonPrefixes')
        for _subfolder in subfolders:
            # subfolder contains the branch name also, -> remove to
            # get bare version info
            subfolder = _subfolder.get('Prefix')
            version = subfolder.replace(branch, '').replace('/', '')
            # we match only subfolders that correspond to
            # a valid timestamp and hence represent a version
            if re.match('[0-9]{10}', version):
                print('{}: (version: {})'.format(branch, version))


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
        print("Version <{}> does not exists in AWS S3 bucket '{}'. Aborting".format(s3_path, bucket_name))
        sys.exit(1)

    msg = raw_input('Are you sure you want to delete all files in <%s>?\n' % s3_path)
    if msg.lower() in ('y', 'yes'):
        files = bucket.objects.filter(Prefix=str(s3_path)).all()
        n = 200
        indexes = [{'Key': k.key} for k in files]
        for i in xrange(0, len(indexes), n):
            resp = s3client.delete_objects(
                Bucket=bucket_name, Delete={
                    'Objects': indexes[
                        i: i + n]})
            for v in resp['Deleted']:
                print(v)
    else:
        print('Aborting deletion of <%s>.' % s3_path)


def activate_version(s3_path, bucket_name, deploy_target, bucket_url):
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
    print('\nSuccessfuly deployed into bucket {}'.format(bucket_name))
    print('Check:\n{}/{}'.format(bucket_url, s3_path + '/index.html'))


def activate_dist_version(branch_name, version, bucket_name, deploy_target, bucket_url):
    # Prod files
    print('branch_name', branch_name)
    print('version', version)
    print('bucket_name', bucket_name)

    # The root for copying the files is different for master and all
    # other branches
    # root: s3://mf-geoadmin3-(int|prod)-dublin/
    # <branch>: s3://mf-geoadmin3-(int|prod)-dublin/<branch>/
    if "branch_name" == "master":
        branch_root = ''
    else:
        branch_root = "{}/".format(branch_name)

    # Delete older appcache files
    appcache_versioned_files = list(bucket.objects.filter(Prefix='{}geoadmin.'.format(branch_root)).all())
    indexes = [{'Key': k.key} for k in appcache_versioned_files if k.key.endswith('.appcache')]
    if len(indexes) > 0:
        print("deleting old *.appcache objects {}".format(indexes))
        s3client.delete_objects(Bucket=bucket_name, Delete={'Objects': indexes})

    for n in bucket.objects.filter(Prefix='{}/{}/'.format(branch_name, version)):
        src_key = n.key
        dst_key = "{}{}".format(
            branch_root,
            src_key.replace(
                "{}/{}/".format(branch_name, version),
                ""
            )
        )
        if deploy_target == 'prod':
            if 'robots.txt' in src_key:
                continue
            elif 'robots_prod.txt' in src_key:
                dst_key = "{}robots.txt".format(branch_root)
        else:
            # don't copy 'robots_prod.txt' on non-prod envs
            if 'robots_prod.txt' in src_key:
                continue

        print('{} => {}'.format(src_key, dst_key))
        try:
            s3client.copy_object(
                Bucket=bucket_name,
                CopySource=bucket_name + '/' + src_key,
                Key=dst_key,
                CopySourceIfModifiedSince=datetime(2015, 1, 1),
                ACL='public-read'
            )
        except botocore.exceptions.ClientError as e:
            print('Cannot copy {}: {}'.format(j, e))

    print('\nSuccessfuly activated version <{}> of branch <{}> in bucket {}'.format(
        version,
        branch_name,
        bucket_name
    ))
    print('Check:\n{}/{}'.format(bucket_url, branch_root + 'index.html'))


def init_connection(bucket_name):
    try:
        session = boto3.session.Session()
    except botocore.exceptions.BotoCoreError as e:
        print('Cannot establish connection to bucket "%s". Check you credentials.' % bucket_name)
        print(e)
        sys.exit(1)

    s3client = session.client('s3', config=boto3.session.Config(signature_version='s3v4'))
    s3 = session.resource('s3', config=boto3.session.Config(signature_version='s3v4'))

    bucket = s3.Bucket(bucket_name)
    return (s3, s3client, bucket)


def exit_usage(cmd_type):
    with click.Context(cmd_type) as ctx:
        click.echo(cmd_type.get_help(ctx))


def parse_s3_path(s3_path, cmd_type):
    if s3_path.endswith('/'):
        s3_path = s3_path[:len(s3_path) - 1]
    # Delete named branch as well
    if s3_path.count('/') not in (0, 2):
        exit_usage(cmd_type)
        print('Bad version definition')
        sys.exit(1)
    if s3_path.count('/') == 0 and cmd_type in ('activate', 'info'):
        exit_usage(eval(cmd_type + '_cmd'))
        print('Cmd activate/info not supported for named branches.')
        print('Please provide a full version path.')
        sys.exit(1)
    return s3_path


@click.group()
def cli():
    """Manage map.geo.admin.ch versions in AWS S3 bucket. Please do not use any credentials or profile, as this script
        relies on aws instance's role.

    A version deployed to S3 is always defined by:\n
                <s3version> = <branch_name>/<sha>/<version>
    """

    for var in ('AWS_PROFILE', 'AWS_ACCESS_KEY_ID'):
        val = os.environ.get(var)
        if val is not None:
            print('Please unset: {}. We use instance roles'.format(var))
            sys.exit(2)


@cli.command('list')
@click.argument('target', required=True)
@click.option('--legacy', is_flag=True)
def list_cmd(target, legacy=False):
    """List available <version> in a bucket."""
    global s3, s3client, bucket
    bucket_name = get_bucket_name(target)
    s3, s3client, bucket = init_connection(bucket_name)
    if legacy:
        list_version()
    else:
        list_dist_version()


@cli.command('upload')
@click.option('--force', help='Do not prompt for confirmation', is_flag=True)
@click.option('--url', 'bucket_url', help='Bucket url to check', required=True)
@click.argument('snapshotdir', required=True, default=os.getcwd())
@click.argument('target', required=True)
@click.argument('named_branch', required=False, default=False)
@click.argument('git_branch', required=False)
def upload_cmd(force, snapshotdir, named_branch, target, git_branch, bucket_url):
    """Upload content of /dist directory to a bucket. You may specify a directory (it defaults to current)."""
    global s3, s3client, bucket
    bucket_name = get_bucket_name(target)
    s3, s3client, bucket = init_connection(bucket_name)
    named_branch = True if named_branch == 'true' else False
    base_dir = os.path.abspath(snapshotdir)
    if not os.path.isdir(base_dir):
        print('No code found in directory %s' % base_dir)
        sys.exit(1)
    if not force and not click.confirm(
            'You are about to upload {} to {}. Continue?'.format(
            base_dir, bucket_name)):
        click.echo('Aborting.')
        sys.exit()
    else:
        #upload(bucket_name, base_dir, target, named_branch, git_branch, bucket_url)
        upload_dist(bucket_name, base_dir, target, named_branch, git_branch, bucket_url)


@cli.command('info')
@click.argument('s3_path', required=True)
@click.argument('target', required=True)
def info_cmd(s3_path, target):
    """Print the info.json file"""
    global s3, s3client, bucket
    bucket_name = get_bucket_name(target)
    s3, s3client, bucket = init_connection(bucket_name)
    s3_path = parse_s3_path(s3_path, 'info')
    version_info(s3_path)


@cli.command('activate')
@click.option('--force', help='Do not prompt for confirmation', is_flag=True)
@click.option('--url', 'bucket_url', help='Bucket url to check',
              required=False, default='https://<bucket public url>')
@click.option('--branch', 'branch_name', required=False, default='master')
@click.option('--version', 'version', required=False, default=None)
@click.argument('target', required=True)
def activate_cmd(branch_name, version, target, force, bucket_url):
    """Activate a version at the root of a bucket (by copying index.html and co to the root)"""
    global s3, s3client, bucket
    bucket_name = get_bucket_name(target)
    s3, s3client, bucket = init_connection(bucket_name)
    s3_path = os.path.join(branch_name, version)
    if version_exists(s3_path) is False:
        print("Version <{}> does not exists in AWS S3 bucket '{}'. Aborting".format(s3_path, bucket_name))
        sys.exit(1)
    if not force and not click.confirm(
        'Are you sure you want to activate version <{}> for branch <{}> in bucket <{}>?'.format(
            version,
            branch_name,
            bucket_name)):
        click.echo('Aborting activation.')
        sys.exit()
    else:
        activate_dist_version(branch_name, version, bucket_name, target, bucket_url)

# DEPR:
# This is the legacy activate command to activate legacy (i.e. before dist)
# master branches


@cli.command('activate_legacy')
@click.option('--force', help='Do not prompt for confirmation', is_flag=True)
@click.option('--url', 'bucket_url', help='Bucket url to check',
              required=False, default='https://<bucket public url>')
@click.argument('s3_path', required=True)
@click.argument('target', required=True)
def activate_cmd(s3_path, target, force, bucket_url):
    """Activate a version at the root of a bucket (by copying index.html and co to the root)"""
    global s3, s3client, bucket
    bucket_name = get_bucket_name(target)
    s3, s3client, bucket = init_connection(bucket_name)
    s3_path = parse_s3_path(s3_path, 'activate')
    if version_exists(s3_path) is False:
        print('Version <%s> does not exists in AWS S3. Aborting' % s3_path)
        sys.exit(1)
    if not force and not click.confirm(
        'Are you sure you want to activate version <{}> in bucket <{}>?'.format(
            s3_path,
            bucket_name)):
        click.echo('Aborting activation.')
        sys.exit()
    else:
        activate_version(s3_path, bucket_name, target, bucket_url)


@cli.command('delete')
@click.argument('s3_path', required=True)
@click.argument('target', required=False)
def delete_cmd(s3_path, target):
    """Delete a s3_path on a give bucket"""
    global s3, s3client, bucket
    bucket_name = get_bucket_name(target)
    s3, s3client, bucket = init_connection(bucket_name)
    s3_path = parse_s3_path(s3_path, 'delete')
    print('Trying to delete version \'{}\''.format(s3_path))
    delete_version(s3_path, bucket_name)

if __name__ == '__main__':
    cli()
