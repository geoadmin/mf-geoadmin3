#!/bin/bash

#bail out on any error
set -o errexit

# Check if snapshot parameter is supplied and there are 2 parameters
if [ "$2" != "int" ] && [ "$2" != "prod" ]
then
  echo "Error: Please specify 1) snapshot directoy and 2) target."
  exit 1
fi

SNAPSHOTDIR=/var/www/vhosts/mf-geoadmin3/private/snapshots/$1

sudo -u deploy deploy -r deploy/deploy.cfg $2 $SNAPSHOTDIR

