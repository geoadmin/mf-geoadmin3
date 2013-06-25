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

Use `make` (or `make help`) to know about the possible `make` targets:

    $ make
    Usage: make <target>

    Possible targets:

    - prod      Build app for prod (app-prod)
    - dev       Build app for dev (app)
    - lint      Run the linter
    - test      Run the JavaScript tests
    - all       All of the above
    - clean     Remove generated files
    - cleanall  Remove all the build artefacts

On mf1t, create an Apache configuration file for your environment. Ex:

    $ cat /var/www/vhosts/mf-geoadmin3/conf/00-elemoine.conf
    Alias /elemoine /home/elemoine/mf-geoadmin3/
