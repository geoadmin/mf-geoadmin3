#!/bin/bash

#bail out on any error
set -o errexit

BASE_DIR=/var/www/vhosts/mf-chsdi3
GIT_BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)
CODE_DIR=$BASE_DIR/private/branch/$GIT_BRANCH

if ! [ -f $CODE_DIR/.git/config ];
then
    git clone https://github.com/geoadmin/mf-chsdi3 $CODE_DIR
    cd $CODE_DIR
    python bootstrap.py --version 1.5.2 --distribute --download-base http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/ --setup-source http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/distribute_setup.py
fi

cd $CODE_DIR
git checkout $GIT_BRANCH
git fetch origin $GIT_BRANCH
git reset --hard origin/$GIT_BRANCH
# This creates the branch configuration
buildout/bin/buildout -c buildout_dev.cfg
# Use the branch configuration
buildout/bin/buildout -c buildout_branch.cfg
# Copy the apache configuration for the branch
cp deploy/conf/00-branch.conf $BASE_DIR/conf/00-$GIT_BRANCH.conf
# deploy to int if 'int' is specified
if [ $1 -a $1 == 'int' ];
then
    sudo -u deploy deploy -r deploy/deploy-branch.cfg int;
fi


