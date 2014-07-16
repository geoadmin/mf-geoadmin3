#!/bin/bash

#bail out on any error
set -o errexit

# adapt these for emergency deploys coming from branches
GITBRANCH=master

# set some variables
BASEDIR=/var/www/vhosts/mf-geoadmin3/private
SNAPSHOT=`date '+%Y%m%d%H%M'`
SNAPSHOTDIR=$BASEDIR/snapshots/$SNAPSHOT

# parse parameter (if -s is specified, snapshot will be created)
CREATE_SNAPSHOT='false'
if [ "$1" == "-s" ]
then
  CREATE_SNAPSHOT='true'
fi

# build latest 'master' version on dev
cd $BASEDIR/geoadmin

# remove all local changes and get latest GITBRANCH from remote
git fetch --all && git reset --hard && git checkout $GITBRANCH && git reset --hard origin/$GITBRANCH

# build the project
source rc_dev 
make cleanall all

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

