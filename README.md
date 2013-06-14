mf-geoadmin3
============

next generation map.geo.admin.ch

[![Build Status](https://travis-ci.org/geoadmin/mf-geoadmin3.png?branch=master)](https://travis-ci.org/geoadmin/mf-geoadmin3)

# Getting started

Checkout the source code:

    git clone https://github.com/geoadmin/mf-geoadmin3.git

or when you're using ssh key (see https://help.github.com/articles/generating-ssh-keys):

    git clone git@github.com:geoadmin/mf-geoadmin3.git

Bootstrap your build environment:

    python bootstrap.py --version 1.5.2 --distribute --download-base http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/ --setup-source http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/distribute_setup.py

Create a developer specific build configuration:

    cp buildout_ltjeg.cfg buildout_xxx.cfg

Where xxx designates your specific buildout configuration. Don't forget to add this to git. To create the specific build:

    buildout/bin/buildout -c buildout_xxx.cfg

If you do this on mf1t, you need to make sure that a correct configuration exists under
    
    /var/www/vhosts/mf-geoadmin3/conf

that includes the apache directory of  your working directory. If all is well, you can reach your pages at:

    http://mf-geoadmin30t.bgdi.admin.ch/xxx/


