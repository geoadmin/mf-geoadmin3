#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re
import botocore
import boto3
import sys
import os
import json
import click

import StringIO
import gzip
from datetime import datetime
import mimetypes

# These branches are master and may activated to the root
# directory of the bucket
MASTER_BRANCHES = ['master', 'mvt_clean']

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



# # # # # # # # # # # # # # # # # # #
#         private functions         #
# # # # # # # # # # # # # # # # # # #

def __local_last_version__(basedir):
    try:
        with open(os.path.join(basedir, '.build-artefacts', 'last-version'), 'r') as f:
            data = f.read()
        return data
    except IOError as e:
        print('Cannot find version: %s' % e)
    return None


def __gzip_data__(data):
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


def __unzip_data__(compressed):
    inbuffer = StringIO.StringIO(compressed)
    f = gzip.GzipFile(mode='rb', fileobj=inbuffer)
    try:
        data = f.read()
    finally:
        f.close()

    return data


def __save_to_s3__(src, dest, bucket_name, cached=True, mimetype=None, break_on_error=False):
    mimetype = __get_file_mimetype__(src)
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

    compressed = False
    content_encoding = None
    cache_control = 'max-age=31536000, public'
    extra_args = {}

    if compress and mimetype not in NO_COMPRESS:
        data = __gzip_data__(in_data)
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


def __is_cached__(file_name):
    """ Determine which files should receive a cache-control header

    Files that are not cached are:
        - *.html (e.g. index.html, mobile.html)
        - *.txt files
        - the *.appcache file itself (although it's versioned with the
            git_commit_short)
        - info.json

    The behaviour is exactly the same for master and other branches
    example:
    <bucket_name>/master/1902211564/index.html           <= no cache header
    <bucket_name>/master/1902211564/as5a56a/lib/build.js <= cache header

    activated master or branch `fix_1234`
    <bucket_name>/fix_1234/index.html                    <= no cache header
    <bucket_name>/fix_1234/as5a56a/lib/build.js          <= cache header
    """
    _, extension = os.path.splitext(file_name)
    return os.path.basename(file_name) not in ['info.json'] and extension not in ['.html', '.txt', '.appcache', '']


def __get_file_mimetype__(local_file):
    if local_file.endswith('services'):
        return 'application/json'
    else:
        mimetype, _ = mimetypes.guess_type(local_file)
        if mimetype:
            return mimetype
        return 'text/plain'


def __upload__(bucket_name, base_dir, git_branch, bucket_url):
    print("base_dir", base_dir)
    version = __local_last_version__(base_dir).strip()
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

            # determine wheather file should receive the cache-control header
            cached = __is_cached__(local_file_path)

            print("{} => s3://{}/{}".format(local_file_path, bucket_name, s3_file_path))
            __save_to_s3__(
                local_file_path,
                s3_file_path,
                bucket_name,
                cached=cached,
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


def __list_legacy_version__():
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


def __list_version__(branch=None):
    # Note: branch-names containing '/' are currently not supported!
    branch_prefix = branch if branch else ''
    try:
      branches = bucket.meta.client.list_objects(
          Bucket=bucket.name,
          Prefix=branch_prefix,
          Delimiter='/')
    except (botocore.exceptions.ClientError, botocore.exceptions.BotoCoreError) as e:
        print("Error while listing version(s) in bucket <{}>: {}".format(bucket.name, e))
        return None

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


def __print_version_info__(s3_path):
    print('App version is: %s' % s3_path)
    version_target = s3_path.split('/')[2]
    obj = s3.Object(bucket.name, '%s/%s/info.json' % (s3_path, version_target))
    try:
        content = obj.get()["Body"].read()
        raw = __unzip_data__(content)
        info = json.loads(raw)
        if info is None:
            print('No info for version %s' % s3_path)
            sys.exit(1)
        for k in info.keys():
            print('%s: %s' % (k, info[k]))
    except (botocore.exceptions.ClientError, botocore.exceptions.BotoCoreError), e:
        sys.exit(1)


def __version_exists__(s3_path):
    try:
        files = bucket.objects.filter(Prefix=str(s3_path)).all()
        return len(list(files)) > 0
    except botocore.exceptions.ClientError as e:
        print("Error while listing objects with prefix={} in bucket={}: {}".format(s3_path, bucket.name, e))
    return False


def __delete_version__(s3_path, bucket_name):
    if __version_exists__(s3_path) is False:
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


def __activate_version__(branch_name, version, bucket_name, bucket_url):
    # Prod files
    print('branch_name', branch_name)
    print('version', version)
    print('bucket_name', bucket_name)

    # The root for copying the files is different for master and all other branches
    # root: s3://mf-geoadmin3-(int|prod)-dublin/
    # <branch>: s3://mf-geoadmin3-(int|prod)-dublin/<branch>/
    # special case when branch = mvt_clean : s3://mf-geoadmin4-(int-prod)-dublin/
    if branch_name in MASTER_BRANCHES:
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
        if 'prod' in bucket_name:
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
            print('Cannot copy {}: {}'.format(n, e))

    print('\nSuccessfuly activated version <{}> of branch <{}> in bucket {}'.format(
        version,
        branch_name,
        bucket_name
    ))
    print('Check:\n{}/{}'.format(bucket_url, branch_root + 'index.html'))


def __init_connection__(bucket_name):
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


def __exit_usage__(cmd_type):
    with click.Context(cmd_type) as ctx:
        click.echo(cmd_type.get_help(ctx))


def __parse_s3_path__(s3_path, cmd_type):
    if s3_path.endswith('/'):
        s3_path = s3_path[:len(s3_path) - 1]
    # Delete named branch as well
    if s3_path.count('/') not in (0, 2):
        __exit_usage__(cmd_type)
        print('Bad version definition')
        sys.exit(1)
    if s3_path.count('/') == 0 and cmd_type in ('activate', 'info'):
        __exit_usage__(eval(cmd_type + '_cmd'))
        print('Cmd activate/info not supported for named branches.')
        print('Please provide a full version path.')
        sys.exit(1)
    return s3_path


# # # # # # # # # # # # # # # # # # #
#          public functions         #
# # # # # # # # # # # # # # # # # # #

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
@click.argument('bucket_name', required=True)
@click.option('--legacy', is_flag=True)
@click.option('--branch', required=False, default=None)
def list_cmd(bucket_name, branch, legacy=False):
    """List available <version> in a bucket."""
    global s3, s3client, bucket
    s3, s3client, bucket = __init_connection__(bucket_name)
    if legacy:
        __list_legacy_version__()
    else:
        __list_version__(branch)


@cli.command('upload')
@click.option('--force', help='Do not prompt for confirmation', is_flag=True)
@click.option('--url', 'bucket_url', help='Bucket url to check', required=True)
@click.argument('snapshotdir', required=True, default=os.getcwd())
@click.argument('bucket_name', required=True)
@click.argument('named_branch', required=False, default=False)
@click.argument('git_branch', required=False)
def upload_cmd(force, snapshotdir, named_branch, bucket_name, git_branch, bucket_url):
    """Upload content of /dist directory to a bucket. You may specify a directory (it defaults to current)."""
    global s3, s3client, bucket
    s3, s3client, bucket = __init_connection__(bucket_name)
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
        __upload__(bucket_name, base_dir, bucket_name, named_branch, git_branch, bucket_url)


@cli.command('info')
@click.argument('s3_path', required=True)
@click.argument('bucket_name', required=True)
def info_cmd(s3_path, bucket_name):
    """Print the info.json file"""
    global s3, s3client, bucket
    s3, s3client, bucket = __init_connection__(bucket_name)
    s3_path = __parse_s3_path__(s3_path, 'info')
    __print_version_info__(s3_path)


@cli.command('activate')
@click.option('--force', help='Do not prompt for confirmation', is_flag=True)
@click.option('--url', 'bucket_url', help='Bucket url to check',
              required=False, default='https://<bucket public url>')
@click.option('--branch', 'branch_name', required=False, default='master')
@click.option('--version', 'version', required=False, default=None)
@click.argument('bucket_name', required=True)
def activate_cmd(branch_name, version, bucket_name, force, bucket_url):
    """Activate a version at the root of a bucket (by copying index.html and co to the root)"""
    global s3, s3client, bucket
    s3, s3client, bucket = __init_connection__(bucket_name)
    s3_path = os.path.join(branch_name, version)
    if __version_exists__(s3_path) is False:
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
        __activate_version__(branch_name, version, bucket_name, bucket_url)


@cli.command('delete')
@click.argument('s3_path', required=True)
@click.argument('bucket_name', required=True)
def delete_cmd(s3_path, bucket_name):
    """Delete a s3_path on a give bucket"""
    global s3, s3client, bucket
    s3, s3client, bucket = __init_connection__(bucket_name)
    s3_path = __parse_s3_path__(s3_path, 'delete')
    print('Trying to delete version \'{}\''.format(s3_path))
    __delete_version__(s3_path, bucket_name)

if __name__ == '__main__':
    cli()
