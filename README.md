mf-geoadmin3
============

next generation map.geo.admin.ch

[![Build Status](https://travis-ci.org/geoadmin/mf-geoadmin3.png?branch=master)](https://travis-ci.org/geoadmin/mf-geoadmin3)

# Getting started

Checkout the source code:

    $ git clone https://github.com/geoadmin/mf-geoadmin3.git

or when you're using ssh key (see https://help.github.com/articles/generating-ssh-keys):

    $ git clone git@github.com:geoadmin/mf-geoadmin3.git

Build:

    $ make all

Use `make help` to know about the possible `make` targets and the currently set variables:

    $ make help

Variables have sensible default values for development. Anyhow, they can be set as make macros or envvars. For example:

    $ make BASE_URL_PATH=/elemoine apache 
    $ BASE_URL_PATH=/elemoine make 

You can customize the build by creating an `rc` file that you source once. Ex:  

    $ cat rc_elemoine 
    export BASE_URL_PATH=/mypath
    export SERVICE_URL=/http://mf-chsdi.dev.bgdi.ch
    $ source rc_elemoine 
    $ make  

For builds on test (rc_dev), integration (rc_ab) and production (rc_prod), you
should source the corresponding `rc` file.

On mf1t, create an Apache configuration file for your environment. Ex:

    $ cat /var/www/vhosts/mf-geoadmin3/conf/00-elemoine.conf
    Include /home/elemoine/mf-geoadmin3/apache/*.conf 

# Deploying project and branches

## Deploying the project (branch *master*)

Update and build the project in the main directory of the vhost as
describe above

    $ cd /var/www/vhosts/mf-geoadmin3/private/geoadmin
    $ make all  && sudo apache2ctl graceful

And test it.

Deploy to the integration server (ab = Abnahme = integration):
    
    $ sudo -u deploy deploy -r deploy/deploy.cfg ab

And test on http://mf-geoadmin30i.bgdi.admin.ch/

## Deploying a branch

Use `make deploybranch` *in your working directory* to deploy your current 
branch to test and integration. The code for deployment, however, does not 
come from your working directory, but does get cloned (first time) or pulled
(if done once) *directly from github*. So you'll likely use this command 
*after* you push your branch to github.

Use `make deploybranch GIT_BRANCH=dev_other_branch` to deploy a different 
branch than the one you are currently working on. Make sure that the branch 
specified exists on github.

The first time you use the command will take some time to execute.

The code of the deployed branch is in a specific directory 
`/var/www/vhosts/mf-geoadmin3/private/branches` on both test and integration. 
The apache configuration for all branches is in apache/branches.conf, which 
should be the same accross all branches. It puts all branches under the 
url `/branch/`. The 00-branches.conf in the vhost configuration points to the 
latest deployed branch.

Sample path:
http://mf-geoadmin30i.bgdi.admin.ch/branch/dev_bottombar/prod

Overview of all deployed branches: http://mf-geoadmin30i.bgdi.admin.ch/branch

Please only use integration url for external communication (including here on 
github), even though the exact same structure is also available on our test 
instances.
