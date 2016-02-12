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

### Update to the last OpenLayers Version

Use `make ol` to update the `ol.js` and `ol-debug.js` files.

Add the correct version tag

https://github.com/geoadmin/mf-geoadmin3/blob/master/Makefile#20

You can also use an argument to test a new version of ol3, for instance you can do:

    make OL3_VERSION="632205d902f8dcc1f03eb1dd1736d26a1b3ac2a3" ol

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


## Building the project to int and prod (S3)

Deploying a project to int or prod consists of three steps:

- Building
- Uploading to S3
- Activating a version, as only one version may be active at time (`index.html`)

You may deploy a build from your local environnement or a previously build snapshot.

    export BUCKET_NAME=<int/prod aws s3 bucket>

If you want to upload a locally build project:

    make s3upload

or for a previously build snapshot:

    make s3upload SNAPSHOT=20140703141

Nota:

- You may build and deploy any branch, commit, using any services independantly.
- By default, the directory `/src` is not uploaded. If you want to upload it, set
  a variable `UPLOAD_SRC_DIR` to True

    make s3upload UPLOAD_SRC_DIR=True

- If you build locally, you probably still want use production services, as:

    make clean prod dev APACHE_BASE_PATH="" API_URL=//api3.geo.admin.ch MAPPROXY_URL=//wmts{s}.geo.admin.ch

Listing all uploaded versions:

    make s3list

    Version      Build date
    -----------+------------------------
    1456906717 2016-03-02 14:18:38+00:00 active
    1456928924 2016-03-02 14:36:37+00:00


Activating an uploaded version:

    make s3activate VERSION=1456928924

Display build info on a version:

    make s3info VERSION=1456928924

    build_date: 2016-03-02 08:36:14 +0000
    api_url: //mf-chsdi3.dev.bgdi.ch
    last_commit_date: 2016-03-01 23:11:47 +0100
    version: 1456907774
    user: ltmom
    branch: mom_layersconfig_lang
    last_commit_hash: f24310914b842414e58ce6ec920d7e779fceff26



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
