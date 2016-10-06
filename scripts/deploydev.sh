#!/bin/bash

T="$(date +%s)"

#bail out on any error
set -o errexit

# adapt these for emergency deploys coming from branches
# TODO Change me back!
GITBRANCH=r_161005_hotfixes
echo "Deploying branch" $GITBRANCH "to dev"

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
if [ ! -d $BASEDIR/geoadmin ]
then
  git clone git@github.com:geoadmin/mf-geoadmin3.git $BASEDIR/geoadmin
fi

cd $BASEDIR/geoadmin

# remove all local changes and get latest GITBRANCH from remote
git fetch --all && git reset --hard && git checkout $GITBRANCH && git reset --hard origin/$GITBRANCH && git clean -fxd .

# build the project
source rc_dev && make cleanall all

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
  rsync -rl $BASEDIR/geoadmin/ $SNAPSHOTDIR/geoadmin/code/geoadmin
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
