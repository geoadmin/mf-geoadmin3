#!/bin/bash

#bail out on any error
set -o errexit

# set some variables and default

GIT_CLONE_OPTS=""
SNAPSHOTDIR=${@:$OPTIND:1}
GITBRANCH=${@:$OPTIND+1:1}
SHA=${@:$OPTIND+2:1}

GITBRANCH=${GITBRANCH:-master}


# Use HEAD if no specific git hash is passed and clone only the last commit

if [ -z ${SHA} ]; then
   SHA=$(curl -s "https://api.github.com/repos/geoadmin/mf-geoadmin3/commits?sha=${GITBRANCH}" |  jq -r '.[0] .sha')
   GIT_CLONE_OPTS="--depth 1"
  
fi


if [ ! -d "${SNAPSHOTDIR}" ]; then
    mkdir -p "${SNAPSHOTDIR}"
fi

echo "Cloning branch=${GITBRANCH}, hash=${SHA} into directory=${SNAPSHOTDIR}"


cd ${SNAPSHOTDIR}

git clone ${GIT_CLONE_OPTS} -b ${GITBRANCH}  https://github.com/geoadmin/mf-geoadmin3.git   

cd mf-geoadmin3


echo "Reseting repository to SHA=${SHA}"
git reset --hard  $SHA

echo "Building the project"
# FIXME Build should be target independant
# See https://github.com/geoadmin/mf-geoadmin3/pull/3402
source rc_dev
# FIXME No tests for now!!!! Should be make all
make cleanall debug release apache deploy/deploy-branch.cfg fixrights


