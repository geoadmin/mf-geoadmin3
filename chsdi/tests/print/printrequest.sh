#!/bin/bash


HOST=http://localhost:9001
PRINT=printmulti


if [ -z "$1" ]
    then
        echo "No spec file supplied. Exit"
        echo "Usage: $0 <specfile>"
        exit 1
    else
        SPECFILE=$1
fi


echo "JSON file" $SPECFILE
echo "Using server" $HOST


urlEncoded=$(python -c "import urllib; print urllib.quote('''${HOST}/${PRINT}''')")


json=$(time curl   --max-time 600  --header "X-SearchServer-Authorized: true" --header "Content-Type:application/json; charset=UTF-8" --header "Referer: http://map.geo.admin.ch" --data @${SPECFILE} -X POST "${HOST}/${PRINT}/create.json?url=${urlEncoded}")

echo "JSON="  ${json}


