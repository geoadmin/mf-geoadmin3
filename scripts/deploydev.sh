#!/bin/bash

T="$(date +%s)"

#bail out on any error
set -o errexit

# adapt these for emergency deploys coming from branches
# TODO Change me back!
GITBRANCH=master
echo "Deploying branch" $GITBRANCH "to dev"

# set some variables
UUID=$(uuidgen)
ROOTDIR=/var/www/vhosts/mf-geoadmin3/private
DEPLOYDIR=$ROOTDIR/geoadmin
TEMPDIR=$ROOTDIR/geoadmin_temp_$UUID
SNAPSHOT=`date '+%Y%m%d%H%M'`
SNAPSHOTDIR=$ROOTDIR/snapshots/$SNAPSHOT

# parse parameter (if -s is specified, snapshot will be created)
CREATE_SNAPSHOT='false'
if [ "$1" == "-s" ]
then
  CREATE_SNAPSHOT='true'
fi

if mv -f $DEPLOYDIR $TEMPDIR; then
  echo "Project backup in $TEMPDIR."
else
  echo "Could not backup the project."
fi

if cd $ROOTDIR; then
  git clone https://github.com/geoadmin/mf-geoadmin3.git $DEPLOYDIR
else
  echo "Could not change directory. Restoring previous project." 1>&2
  rm -rf $DEPLOYDIR
  mv -f $TEMPDIR $DEPLOYDIR
  exit 1
fi

# Create a fresh clone of the project
if cd $DEPLOYDIR; then
  # remove all local changes and get latest GITBRANCH from remote
  git fetch origin && git reset --hard && git checkout $GITBRANCH && git reset --hard origin/$GITBRANCH
else
  echo "Could not change directory. Restoring previous project." 1>&2
  rm -rf $DEPLOYDIR
  mv -f $TEMPDIR $DEPLOYDIR
  exit 1
fi

# build the project
source rc_dev && make cleanall all

exit_code=$?

if [ "$exit_code" -gt "0" ]
then
  echo "Failed to build the app. Restoring previous project." 1>&2
  rm -rf $DEPLOYDIR
  mv -f $TEMPDIR $DEPLOYDIR
  exit $exit_code
else
  echo "Build is successfull. Deleting old project."
  rm -rf $TEMPDIR
fi

# restart apache
sudo apache2ctl graceful

echo "Deployed branch $GITBRANCH to dev main."

echo "Flushing varnishes"
for VARNISHHOST in ${VARNISH_HOSTS[@]}
do
  ./scripts/flushvarnish.sh $VARNISHHOST "${API_URL#*//}"
  ./scripts/flushvarnish.sh $VARNISHHOST "${E2E_TARGETURL#*https://}"
  echo "Flushed varnish at: ${VARNISHHOST}"
done

# create a snapshot
if [ $CREATE_SNAPSHOT == 'true' ]; then
  mkdir -p $SNAPSHOTDIR/geoadmin/code
  rsync -rl $DEPLOYDIR $SNAPSHOTDIR/geoadmin/code/geoadmin
  echo "Snapshot of branch $GITBRANCH created at $SNAPSHOTDIR"
  cd $SNAPSHOTDIR/geoadmin/code/geoadmin/
  git describe --tags --abbrev=0 > .build-artefacts/last-release
  git log -1 --pretty=format:"%h - %an, %ar : %s" > .build-artefacts/last-commit-ref
  git rev-parse --symbolic-full-name --abbrev-ref HEAD > .build-artefacts/deployed-git-branch
else
  echo "NO Snapshot created. Specify '-s' parameter got create snapshot."
fi

T="$(($(date +%s)-T))"
printf "Deploy time: %02d:%02d:%02d\n" "$((T/3600%24))" "$((T/60%60))" "$((T%60))"
