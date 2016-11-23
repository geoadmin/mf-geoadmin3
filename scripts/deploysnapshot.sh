#!/bin/bash

T="$(date +%s)"

# Bail out on any error
set -o errexit

# Check if snapshot parameter is supplied and there are 2 parameters
if [ "$2" != "int" ] && [ "$2" != "prod" ]
then
  echo "Error: Please specify 1) snapshot directoy and 2) target."
  exit 1
fi

pwd=$(pwd)
DEPLOY_TARGET=$2
NEW_VERSION=$3
RC_FILE=rc_$DEPLOY_TARGET
SNAPSHOTDIR=/var/www/vhosts/mf-geoadmin3/private/snapshots/$1

# Prepare snapshot
cd $SNAPSHOTDIR/geoadmin/code/geoadmin
if [ "$NEW_VERSION" = "true" ]; then
  make .build-artefacts/last-version
fi


DEPLOY_GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
SHA=$(git rev-parse HEAD | cut -c1-7)
VERSION=$(cat .build-artefacts/last-version)
S3_BASE_PATH=/$DEPLOY_GIT_BRANCH/$SHA/$VERSION
export S3_SRC_BASE_PATH=$S3_BASE_PATH/src/
export S3_BASE_PATH=$S3_BASE_PATH/
source $RC_FILE && make all

echo -n "Checking service and layersConfig files"
cat prd/cache/services  | python -c 'import json,sys;obj=json.load(sys.stdin);print "Topics numbers:",len(obj["topics"])'
for lang in de fr it rm en; do
  echo -e "${lang}: \c"
  cat prd/cache/layersConfig.${lang}.json  | python -c 'import json,sys;obj=json.load(sys.stdin);print "Layers numbers:",len(obj.keys())'
done

echo -n "Did you verified them? (y/n)"
echo
read answer
if [ ! "${answer}" == "y" ]; then
  echo "deploy aborted"
  exit 1
fi

# Upload to S3
echo "$pwd/.build-artefacts/python-venv/bin/python $pwd/scripts/s3manage.py upload $SNAPSHOTDIR/geoadmin/code/geoadmin $DEPLOY_TARGET"
$pwd/.build-artefacts/python-venv/bin/python $pwd/scripts/s3manage.py upload $SNAPSHOTDIR/geoadmin/code/geoadmin $DEPLOY_TARGET

# Flush varnish
echo "Flushing varnishes"
source $RC_FILE
for VARNISHHOST in ${VARNISH_HOSTS[@]}
do
  ./scripts/flushvarnish.sh $VARNISHHOST "${API_URL#*//}"
  ./scripts/flushvarnish.sh $VARNISHHOST "${E2E_TARGETURL#*https://}"
  echo "Flushed varnish at: ${VARNISHHOST}"
done

T="$(($(date +%s)-T))"

printf "Deploy time: %02d:%02d:%02d\n" "$((T/3600%24))" "$((T/60%60))" "$((T%60))"
