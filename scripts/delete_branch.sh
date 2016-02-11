#!/bin/bash

BRANCHES=$(ls   /var/www/vhosts/mf-geoadmin3/private/branch/)
BASE=/var/www/vhosts/mf-geoadmin3


if [ "$#" -ne 1 ]; then
        echo "No branch name given"
        echo "Possible values:"
        for b in ${BRANCHES};
            do
               echo ${b}
            done
        exit 0
fi


BRANCH=$1

conf="${BASE}/conf/00-${BRANCH}.conf"
basedir="${BASE}/private/branch/${BRANCH}" 


if [ -d "${basedir}" ]
    then
        echo "Found ${basedir}"
        if [ -f "${conf}" ];
            echo "Found ${conf}"
            then
                read -p "Do you want to delete ${BRANCH} ? " -n 1 -r
                echo    # (optional) move to a new line
                if [[ $REPLY =~ ^[Yy]$ ]]
                  then
                     echo "Deleting branch ${BRANCH}"
                     rm -f  ${conf}
                     rm -rf ${basedir}
                     echo "Please, restart apache"
                fi
            else
                echo "No ${conf} found. Please check manually"
        fi
else 
    echo "branch ${BRANCH} not found"
fi
