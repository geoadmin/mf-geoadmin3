#!/bin/bash

# compare two dot separated version string and return
# - match if versions match
# - first_greater if first version is greater than second
# - first_smaller if first version is smaller than second

# exemple of usage
#
# sh ./version_compare.sh 1.0.0 1.0.1
#
# or with lib called directly
#
# sh ./version_compare.sh $(node -v) 10.0.0
#
version_compare () {
    if [[ $1 == $2 ]]
    then
        return 0
    fi
    local IFS=.
    local i ver1=($1) ver2=($2)
    # fill empty fields in ver1 with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++))
    do
        ver1[i]=0
    done
    for ((i=0; i<${#ver1[@]}; i++))
    do
        if [[ -z ${ver2[i]} ]]
        then
            # fill empty fields in ver2 with zeros
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]}))
        then
            return 1
        fi
        if  ((10#${ver1[i]} < 10#${ver2[i]}))
        then
            return 2
        fi
    done
}
version_compare $1 $2
result_value=$?
if [[ $result_value == 1 ]];
then
    echo "first_greater";
elif [[ $result_value == 2 ]];
then
    echo "first_smaller";
elif [[ $result_value == 0 ]]; then
    echo "matches"
else
    echo "Error, unknow result"
fi
