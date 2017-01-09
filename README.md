mf-geoadmin3
============

next generation map.geo.admin.ch

Jenkins build status: [![Jenkins Build Status](https://jenkins.ci.bgdi.ch/buildStatus/icon?job=MAIN_geoadmin3)](https://jenkins.ci.bgdi.ch/job/MAIN_geoadmin3/)

# Getting started

Checkout the source code:

    $ git clone https://github.com/geoadmin/mf-geoadmin3.git

or when you're using ssh key (see https://help.github.com/articles/generating-ssh-keys):

    $ git clone git@github.com:geoadmin/mf-geoadmin3.git

Checkout submodules:

     $ git submodules update --init

There's no need to create a user specific source file. Simply use the following
build command:

    $ make user

Variables have sensible default values for development. Anyhow, they can be set as make macros or envvars in a customized source file. E.G. you can copy the rc_user file and adapt it to your needs. They you can lauch:

    $ source rc_customized && make all

Use `make help` to know about the possible `make` targets and the currently set variables:

    $ make help

Use `make translate` to import directly translations from the Google spreadsheet. Don't forget to set up first these 2 following environment parameter:

    export DRIVE_USER=your_login
    export DRIVE_PWD=your_password

For builds on test (rc_dev), integration (rc_int) and production (rc_prod), you
should source the corresponding `rc` file.

On mf0t, create an Apache configuration file for your environment. Ex:

    $ cat /var/www/vhosts/mf-geoadmin3/conf/ltxxx.conf
    Include /home/ltxxx/mf-geoadmin3/apache/*.conf

## Dependencies

The GeoAdmin team development servers all contain the necessary dependencies
to develop mf-geoadmin3. Even if development of the project outside of the
GeoAdmin infrastructure is not fully supported (e.g. you would need to
setup your own web server with correct configurations), you should still
be able to build the project on a different, Linux based infrastructure. For
this to work, you need to make sure to install the following dependencies:

    sudo apt-get install python-software-properties
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install make gcc+ git unzip openjdk-7-jre openjdk-7-jdk g++ npm python-virtualenv

### Caveats

You might get an error similar to:
    /usr/bin/env: node: No such file or directory
This can be fixed by running:
    sudo ln -s /usr/bin/nodejs /usr/bin/node
    #see https://github.com/joyent/node/issues/3911

### Update to the last OpenLayers/Cesium/OL3-Cesium Version

Use `make ol3cesium` to update the `ol3cesium.js` and `ol3cesium-debug.js` files.

Add the correct version tag

https://github.com/geoadmin/mf-geoadmin3/blob/master/Makefile#20

You can also use an argument to test a new version of ol3, for instance you can do:

    make OL3_VERSION=627abaf1a71d48627163eb00ea6a0b6fb8dede14 \
    OL3_CESIUM_VERSION=10c5fcf1565ffdb484c4ef4e42835142f8f45e67 \
    CESIUM_VERSION=3e3cf938786ee48b4b376ed932904541d798671d ol3cesium


Remember to update the API and API doc at the same time to keep coherency.

# Automated tests

## Unit tests

We use Karma to configure our unit tests and PhantomJS to run them in.  They
are defined in `test/specs`. They are run as part of the standard build.

Ideally, each component is fully tested with unit tests.

## Saucelab cross-browser tests with saucelabs.com

In your `.bashrc` please make sure you have the variables `SAUCELABS_USER` and
`SAUCELABS_KEY` set.

In order to lauch only some of the tests, you can use the following command:

    make saucelabs SAUCELABS_TESTS=kml,search

Per default all tests are launched.

If you only want to launch sauclab tests on a single platform/browser, you can use
the following command

    make saucelabssingle

## Cross-browser end-to-end tests with browserstack.com

To run the e2e browserstack tests, a few things need to be set up in your
environment. You need to have the BROWSERSTACK_USER and BROWSERSTACK_KEY
variables set. As they are sensitive, they should not be accessible in public
(don't add them to github). Recommended way is via a protected file on your
system (readable only by you):

    echo "export BROWSERSTACK_USER=***" >> ~/.browserstack
    echo "export BROWSERSTACK_KEY=***" >> ~/.browserstack
    chmod 600 ~/.browserstack

Then add `source ~/.browserstack` to your `.bashrc` file. The infos can be found
here: https://www.browserstack.com/accounts/automate . Please use the credentials
in our keypass file to log in.

Run it using make:

    make teste2e

This uses the BROWSERSTACK_TARGET environment variable (part of rc_* files) to
determine which URL to test.

Run it manually:

    node test/selenium/tests.js -t https://map.geo.admin.ch

This runs it with the given target URL.

These tests are not part of the normal build. They need to be launched manually.

# Deploying project and branches

## Building and deploying to AWS S3

To build the current branch and upload it to AWS S3 int, use:

    make s3deploybranch

Branches are stored in the user environments under:

   ~/tmp/branches/{branch_name}

To upload a different branch, use:

    make s3deploybranch DEPLOY_GIT_BRANCH=<BRANCH_NAME>

After the first clone, dev dependencies are not removed when uploading a branch
to S3. If you want to also remove the dev depedencies, use:

    make s3deploybranch DEEP_CLEAN=true

Per default, branches are overwritten on S3 when deployed on integration.
If you want to change this behaviour and create a new version of the deployed branch,
use the following command:

    make s3deploybranch NAMED_BRANCH=false

If the project builds and the tests are passing, then, files will be uploaded to a directory:

    <DEPLOY_GIT_BRANCH>/<DEPLOY_GIT_HASH>/<EPOCH_BUILD>

For instance:

    mom_layersconfig_lang/75098c2/1468688399/index.html

and for source:

    mom_layersconfig_lang/75098c2/1468688399/src/index.html

Metadata to a build are available next to the index.html, as info.json

## Deploying the project to dev, int and prod

#### Deploying to dev

    make deploydev SNAPSHOT=true

will create a snapshot and output a snapshot version. (uses Apache)

#### Deploying to int

    make s3deployint SNAPSHOT=123456 (a snapshot version)


Use the KEEP_VERSION option to generate a new version

     make s3deployint SNAPSHOT=123456 KEEP_VERSION=false

will deploy the snapshot to AWS S3 in the int bucket. It will output a S3 URL.
Take the version and use the following command to activate the version.

    make s3activateint S3_VERSION_PATH=<DEPLOY_GIT_BRANCH>/<DEPLOY_GIT_HASH>/<EPOCH_BUILD>

#### Deploying to prod

    make s3deployprod SNAPSHOT=123456 (a snapshot version)

will deploy the snapshot to AWS S3 in the int bucket. It will output a S3 URL.
Take the version and use the following command to activate the version.

    make s3activateprod S3_VERSION_PATH=<DEPLOY_GIT_BRANCH>/<DEPLOY_GIT_HASH>/<EPOCH_BUILD>

## Deleting a build on AWS S3

To list all the builds:
`make s3listint` or `make s3listprod`

To get more information about a build:
`make s3infoint S3_VERSION_PATH=<DEPLOY_GIT_BRANCH>/<DEPLOY_GIT_HASH>/<EPOCH_BUILD>`

To delete a given build:
`make s3deleteint S3_VERSION_PATH=<DEPLOY_GIT_BRANCH>/<DEPLOY_GIT_HASH>/<EPOCH_BUILD>`

To delete a named branch:

`make s3deleteint S3_VERSION_PATH=<DEPLOY_GIT_BRANCH>`

### Get correct link the API

Per default, the API used in the **main** instance of mf-chsdi3. If you want
to target a specific branch of mf-chsdi3, please adapt the `API_URL` variable
in the `rc_branch.mako` file on **your branch**

# Flushing varnish

You can flush varnish instances manually.

    ./scripts/flushvarnish.sh varnihs_host_ip api_host

Where `varnish_host_ip` is the ip of the varnish server and api_host is the hostname of the url you want to flush. e.g. mf-chsdi3.dev.bgdi.ch for dev and api3.geo.admin.ch for prod.

# Point to a target env for all services

Add `env=(dev|int|prod)`

# Use a custom backend and WMS server via permalink parameters

Add `api_url=//theNameOfAnAPIServer`

Add `wms_url=//theNameOfAWMSServer`

Add `print_url=//theNameOfAPrintServer`

Add `shop_url=//theNameOfAShopServer`

Add `mapproxy_url=//theNameOfAMapProxyServer`

Add `public_url=//theNameOfAPublicServer`
