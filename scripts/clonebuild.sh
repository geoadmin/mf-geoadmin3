#!/bin/bash

#bail out on any error
set -o errexit

# set some variables and default

GIT_CLONE_OPTS=""
SNAPSHOTDIR=${@:$OPTIND:1}
DEPLOY_GIT_BRANCH=${@:$OPTIND+1:1}
DEPLOY_GIT_BRANCH=${DEPLOY_GIT_BRANCH:-master}
DEPLOY_TARGET=${@:$OPTIND+2:1}

if [ ! -d "${SNAPSHOTDIR}" ]; then
    mkdir -p "${SNAPSHOTDIR}"
fi

echo "Cloning branch=${DEPLOY_GIT_BRANCH}, into directory=${SNAPSHOTDIR}"
cd ${SNAPSHOTDIR}

if [ ! -d mf-geoadmin3 ]; then
    git clone ${GIT_CLONE_OPTS} -b ${DEPLOY_GIT_BRANCH}  https://github.com/geoadmin/mf-geoadmin3.git
    cd mf-geoadmin3
else
    cd mf-geoadmin3
    make cleanall
    echo "Reseting repository to HEAD for branch=${DEPLOY_GIT_BRANCH}"
    git fetch
    git checkout $DEPLOY_GIT_BRANCH
    git reset --hard origin/$DEPLOY_GIT_BRANCH
fi

make .build-artefacts/last-version
SHA=$(git rev-parse HEAD | cut -c1-7)
VERSION=$(cat .build-artefacts/last-version)
S3_BASE_PATH=/$DEPLOY_GIT_BRANCH/$SHA/$VERSION
export S3_SRC_BASE_PATH=$S3_BASE_PATH/src/
export S3_BASE_PATH=$S3_BASE_PATH/

echo "S3_BASE_PATH="
echo $S3_BASE_PATH
echo "S3_SRC_BASE_PATH="
echo $S3_SRC_BASE_PATH

echo "Building the project"
source rc_$DEPLOY_TARGET && make all
