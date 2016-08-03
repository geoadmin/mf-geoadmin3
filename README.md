mf-geoadmin3
============

next generation map.geo.admin.ch

Jenkins build status: [![Jenkins Build Status](https://jenkins.ci.bgdi.ch/buildStatus/icon?job=geoadmin3)](https://jenkins.prod.bgdi.ch/job/geoadmin3/)

# Getting started

Checkout the source code:

    $ git clone https://github.com/geoadmin/mf-geoadmin3.git

or when you're using ssh key (see https://help.github.com/articles/generating-ssh-keys):

    $ git clone git@github.com:geoadmin/mf-geoadmin3.git

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

    $ cat /var/www/vhosts/mf-geoadmin3/conf/00-elemoine.conf
    Include /home/elemoine/mf-geoadmin3/apache/*.conf 

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
    sudo apt-get install make gcc+ git unzip openjdk-6-jre openjdk-6-jdk g++ npm python-virtualenv

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

## Deploying the project to dev, int and prod

Do the following **inside your working directory**:

`make deploydev SNAPSHOT=true`

This updates the source in /var/www...to the latest master branch from github,
builds it from scratch, runs the tests and creates a snapshot. The snapshot directory
will be shown when the script is done. *Note*: you can omit the `SNAPSHOT=true` parameter if
you don't want to create a snapshot e.g. for intermediate releases on dev main.

A snapshot (e.g. 201407031411) can be deployed to integration with:

`make deployint SNAPSHOT=201407031411`

This will do the corresponding thing for prod:

`make deployprod SNAPSHOT=201407031411`

Per default the deploy command uses the deploy configuration of the snapshot directory.
If you want to use the deploy configuration of directory from which you are executing this command, you can use:

`make deployint SNAPSHOT=201512011411 DEPLOYCONFIG=from_current_directory`

Note: we should NOT manually adapt code in /var/www/vhosts/mf-geoadmin3 directory


## Building and deploying to AWS S3

The three technical hostnames:

* mf-geoadmin.dev.bgdi.ch
* mf-geoadmin.int.bgdi.ch
* mf-geoadmin.prod.bgdi.ch

are pointing on the same bucket, defined by S3_MF_GEOADMIN3_PROD, their values defines what backends
the application will use (See [PR 3402]](https://github.com/geoadmin/mf-geoadmin3/pull/3402)).


To build a branch/hash of mf-geoadmin3 and upload the result to AWS S3, 

    DEPLOY_GIT_BRANCH=my_branch DEPLOY_GIT_HASH=656e343 make s3builddeploy
    
By default, DEPLOY_GIT_HASH refers to HEAD version, and DEPLOY_GIT_BRANCH to 'master'.

If the project builds and the tests are passing, then, files will be uploaded to a directory:

    <DEPLOY_GIT_BRANCH>/<DEPLOY_GIT_HASH>/<EPOCH_BUILD>/

For instance:

    mom_layersconfig_lang/75098c2/1468688399/index.html
    
and for source:
    
    mom_layersconfig_lang/75098c2/1468688399/src/index.html
    
    
Metadata to a build are available next to the index.html, as info.json

## Deploying a branch

Use `make deploybranch` *in your working directory* to deploy your current 
branch to test (Use `make deploybranchint` to also deploy it to integration).
The code for deployment, however, does not come from your working directory,
but does get cloned (first time) or pulled (if done once) *directly from github*.
So you'll likely use this command *after* you push your branch to github.

The first time you use the command will take some time to execute.

The code of the deployed branch is in a specific directory 
`/var/www/vhosts/mf-geoadmin3/private/branch` on both test and integration.
The command adds a branch specific configuration to
`/var/www/vhosts/mf-geoadmin3/conf`. This way, the deployed branch
behaves exactly the same as any user specific deploy.

Sample path:
https://mf-geoadmin3.int.bgdi.ch/dev_bottombar/prod

Please only use integration url for external communication (including here on 
github), even though the exact same structure is also available on our test 
instances.

## Deleting a branch

To list all the deployed branch:
`make deletebranch`

To delete a given branch:
make deletebranch BRANCH_TO_DELETE=my_deployed_branch`

### Get correct link the API
Per default, the API used in the **main** instance of mf-chsdi3. If you want
to target a specific branch of mf-chsdi3, please adapt the `API_URL` variable
in the `rc_branch.mako` file on **your branch**

# Flushing varnish

You can flush varnish instances manually.

    ./scripts/flushvarnish.sh varnihs_host_ip api_host

Where `varnish_host_ip` is the ip of the varnish server and api_host is the hostname of the url you want to flush. e.g. mf-chsdi3.dev.bgdi.ch for dev and api3.geo.admin.ch for prod.

# Use a custom backend and WMS server via permalink parameters

Add `api_url=theNameOfABranch` to use a custom backend.

Add `wms_url=//theNameOfAWMSServer` to use a cutsom wms service.

Add `print_url=//theNameOfAPrintServer` to use a custom print server.
