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

     - css       Build CSS
     - js        Build JavaScript
     - deps      Build deps.js (for script autoload with Closure)
     - index     Create index.html and index-prod.html
     - lint      Run the linter
     - test      Run the JavaScript tests
     - all       All of the above
     - clean     Remove generated files
     - cleanall  Remove all the build artefacts

    Variables:
    
    - BASE_HREF href value for <base> in index.html (current value: /elemoine/)  
    - BASE_PATH value for directory path of mf-geoadmin3 project

    Variables can be set as make macros or envvars. For example: 

    $ make BASE_HREF=/elemoine/ index 
    $ BASE_HREF=/elemoine/ make 

You can avoid setting variables/macros on the `make` command line by creating 
an `rc` file that you source once. Ex: 
    
    $ cat rc 
    export BASE_HREF=/elemoine/ 
    $ source rc 
    $ make 

On mf1t, create an Apache configuration file for your environment. Ex:

    $ cat /var/www/vhosts/mf-geoadmin3/conf/00-elemoine.conf
    Alias /elemoine /home/elemoine/mf-geoadmin3/
    Include /home/elemoine/mf-geoadmin3/apache/*.conf
