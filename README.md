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
    export SERVICE_URL=/http://mf-chsdi30t.bgdi.admin.ch
    $ source rc_elemoine 
    $ make  

For builds on test (rc_dev), integration (rc_ab) and production (rc_prod), you
should source the corresponding `rc` file.

On mf1t, create an Apache configuration file for your environment. Ex:

    $ cat /var/www/vhosts/mf-geoadmin3/conf/00-elemoine.conf
    Include /home/elemoine/mf-geoadmin3/apache/*.conf 
