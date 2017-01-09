#!/bin/bash

# bail out on any error
set -o errexit

get_s3_basepath () {
  SHA=$(git rev-parse HEAD | cut -c1-7)
  VERSION=$(cat .build-artefacts/last-version)
  echo "/$1/$SHA/$VERSION/"
}

create_snapshot_dir () {
  if [ ! -d "${CLONEDIR}" ]; then
    mkdir -p "${CLONEDIR}"
  fi
}

update_and_reset_git_project () {
  echo "Reseting repository to HEAD for branch=${DEPLOY_GIT_BRANCH}"
  git fetch
  git checkout $DEPLOY_GIT_BRANCH
  git reset --hard origin/$DEPLOY_GIT_BRANCH
}

# set some variables and defaults
CLONEDIR=${@:$OPTIND:1}
DEPLOY_TARGET=${@:$OPTIND+1:1}
DEPLOY_GIT_BRANCH=${@:$OPTIND+2:1}
DEEP_CLEAN=${@:$OPTIND+3:1}
NAMED_BRANCH=${@:$OPTIND+4:1}

create_snapshot_dir
cd ${CLONEDIR}

if [ ! -d mf-geoadmin3 ]; then
  echo "Cloning branch=${DEPLOY_GIT_BRANCH}, into directory=${CLONEDIR}"
  git clone -b ${DEPLOY_GIT_BRANCH}  https://github.com/geoadmin/mf-geoadmin3.git
  cd mf-geoadmin3

else
  cd mf-geoadmin3
  if [ "$DEEP_CLEAN" = "true" ]; then
    make cleanall
  else
    make clean
  fi
  update_and_reset_git_project
fi

git submodule update --init

if [ "$NAMED_BRANCH" = "true" ]; then
  export KEEP_VERSION="true"
  S3_BASE_PATH=/$DEPLOY_GIT_BRANCH/
else
  export KEEEP_VERSION="false"
  make .build-artefacts/last-version
  S3_BASE_PATH=$(get_s3_basepath $DEPLOY_GIT_BRANCH)
fi
S3_SRC_BASE_PATH=$S3_BASE_PATH"src/"

echo "S3_BASE_PATH:"
echo $S3_BASE_PATH
echo "S3_SRC_BASE_PATH:"
echo $S3_SRC_BASE_PATH

echo "Building the project"
export S3_BASE_PATH=$S3_BASE_PATH
export S3_SRC_BASE_PATH=$S3_SRC_BASE_PATH
source rc_$DEPLOY_TARGET && make all
