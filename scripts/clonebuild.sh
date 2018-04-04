#!/bin/bash
# This script clone a specific branch to a specific folder then build it.

# bail out on any error
set -o errexit

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

# Remove the clone folder
if [ $DEEP_CLEAN = true ]; then
  make cleanall
fi

create_snapshot_dir
cd ${CLONEDIR}

# Clone or update the project
if [ ! -d mf-geoadmin3 ]; then
  echo "Cloning branch=${DEPLOY_GIT_BRANCH}, into directory=${CLONEDIR}"
  git clone -b ${DEPLOY_GIT_BRANCH}  https://github.com/geoadmin/mf-geoadmin3.git
  cd mf-geoadmin3
else
  cd mf-geoadmin3
  make clean
  update_and_reset_git_project
fi

# Build the app with correct parameter
make $DEPLOY_TARGET  NAMED_BRANCH=$NAMED_BRANCH

