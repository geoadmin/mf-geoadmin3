#!/bin/bash

# This script deploy a snapshot of geoadmin. All the make targets are executed
# like if it is master so with NAMED_BRANCH=false.

T="$(date +%s)"

# Bail out on any error
set -o errexit

# Check if snapshot parameter is supplied and there are 2 parameters
if [ "$2" != "int" ] && [ "$2" != "prod" ] && [ "$2" != "infra" ]
then
  echo "Error: Please specify 1) snapshot directoy and 2) target."
  exit 1
fi

pwd=$(pwd)
DEPLOY_TARGET=$2
CODE_DIR=/var/www/vhosts/mf-geoadmin3/private/snapshots/$1/geoadmin/code/geoadmin

# Go to snapshot folder
cd $CODE_DIR

# Build the app 
make $DEPLOY_TARGET NAMED_BRANCH=false \
                    KEEP_VERSION=$KEEP_VERSION

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

echo "Upload to s3"
make s3copybranch DEPLOY_TARGET=$DEPLOY_TARGET \
                  NAMED_BRANCH=false \
                  CODE_DIR=$CODE_DIR

echo "Flushing varnishes"
make flushvarnish DEPLOY_TARGET=$DEPLOY_TARGET

T="$(($(date +%s)-T))"
printf "Deploy time: %02d:%02d:%02d\n" "$((T/3600%24))" "$((T/60%60))" "$((T%60))"
