#!/bin/bash

T="$(date +%s)"

# set correct umask to assure proper rights after build
umask 0002

#bail out on any error
set -o errexit

# set some variables
DEPLOYDIR=/var/www/vhosts/mf-chsdi3/private/chsdi/
SNAPSHOT=`date '+%Y%m%d%H%M'`
SNAPSHOTDIR=/var/www/vhosts/mf-chsdi3/private/snapshots/$SNAPSHOT

# parse parameter (if -n is specified, no snapshot will be created)
GITBRANCH=master
CREATE_SNAPSHOT='false'
if [ "$1" == "-s" ]
then
  CREATE_SNAPSHOT='true'
  if [ -n "$2" ]
  then
    GITBRANCH=$2
  fi
fi

# build latest 'master' version on dev
cd $DEPLOYDIR

# remove all local changes and get latest GITBRANCH from remote
git fetch origin && git reset --hard && git checkout $GITBRANCH && git reset --hard origin/$GITBRANCH

# bootstrap the project to be on the safe side
python bootstrap.py --version 1.5.2 --distribute --download-base http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/ --setup-source http://pypi.camptocamp.net/distribute-0.6.22_fix-issue-227/distribute_setup.py
# clean and build the project
buildout/bin/buildout -c buildout_cleaner.cfg
buildout/bin/buildout -c buildout_dev.cfg

# restart apache
sudo apache2ctl graceful

echo "Deployed branch $GITBRANCH to dev main."

# create a snapshot
if [ $CREATE_SNAPSHOT == 'true' ]; then
  sudo -u deploy deploy -c deploy/deploy.cfg $SNAPSHOTDIR
  echo "Snapshot of branch $GITBRANCH created at $SNAPSHOTDIR"
else
  echo "NO Snapshot created. Specify '-s' parameter got create snapshot."
fi

T="$(($(date +%s)-T))"

printf "Deploy time: %02d:%02d:%02d\n" "$((T/3600%24))" "$((T/60%60))" "$((T%60))"
