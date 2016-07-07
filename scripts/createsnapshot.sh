#!/bin/bash

T="$(date +%s)"

#bail out on any error
set -o errexit

# set some variables
BASEDIR=/var/www/vhosts/mf-geoadmin3/private
SNAPSHOT=`date '+%Y%m%d%H%M'`
SNAPSHOTDIR=$BASEDIR/snapshots/$SNAPSHOT

CREATE_SNAPSHOT="true"

# create a snapshot
if [ $CREATE_SNAPSHOT == 'true' ]; then
  sudo -u deploy deploy -c deploy/deploy.cfg $SNAPSHOTDIR
  echo "Snapshot of branch $GITBRANCH created at $SNAPSHOTDIR"
  cd $SNAPSHOTDIR/geoadmin/code/geoadmin/
  git describe --tags --abbrev=0 > .build-artefacts/last-release
  git log -1 --pretty=format:"%h - %an, %ar : %s" > .build-artefacts/last-commit-ref
  git rev-parse --symbolic-full-name --abbrev-ref HEAD > .build-artefacts/deployed-git-branch
  rm -rf .git*
  export SNAPSHOT
else
  echo "NO Snapshot created. Specify '-s' parameter got create snapshot."
  exit 2
fi

echo "Snapshot created in ${SNAPSHOTDIR}"
echo "SNAPSHOT=${SNAPSHOT}"



