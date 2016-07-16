#!/bin/bash

#bail out on any error
set -o errexit

# set some variables

BASEDIR=/tmp
TIMESTAMP=$(date '+%Y%m%d%H%M')


SNAPSHOTDIR=${@:$OPTIND:1}
GITBRANCH=${@:$OPTIND+1:1}
SHA=${@:$OPTIND+2:1}

GITBRANCH=${GITBRANCH:-master}


# Use HEAD if no spcific Git hash is passed

if [ -z ${SHA} ]; then
    SHA=$(curl -s "https://api.github.com/repos/geoadmin/mf-geoadmin3/commits?sha=${GITBRANCH}" |  jq '.[0] .sha')
fi


if [ ! -d "${SNAPSHOTDIR}" ]; then
    mkdir -p "${SNAPSHOTDIR}"
fi

echo "Will clone branch=${GITBRANCH}, hash=${SHA} into directory=${SNAPSHOTDIR}"



cd ${SNAPSHOTDIR}

git clone --depth 1 -b ${GITBRANCH}  https://github.com/geoadmin/mf-geoadmin3.git   

cd mf-geoadmin3


git reset --hard  $SHA

# build the project
source rc_dev
make cleanall all


