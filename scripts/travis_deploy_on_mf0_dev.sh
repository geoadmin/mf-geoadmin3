#!/bin/bash

echo -e ">>> Building auth file.."
 
if [ -z "$id_rsa_{1..23}" ]; then echo 'No $id_rsa_{1..23} found !' ; exit 1; fi
 
# Careful ! Put the correct number here !!! (the last line number)
mkdir .ssh
chmod 0700 .ssh
echo -n $id_rsa_{1..23} >> .ssh/travis_rsa_64
chmod 0775 .ssh/travis_rsa_64
base64 --decode --ignore-garbage .ssh/travis_rsa_64 > .ssh/id_rsa
 
chmod 600 .ssh/id_rsa

echo -e "authfile built!"

echo -e "rsyncing to the dev env."
export PROXY_SSH_COMMAND="ssh -i .ssh/id_rsa -o StrictHostKeyChecking=no -Aq travis@ssh0.prod.bgdi.ch nc -q0 %h 22"
export SSH_COMMAND="ssh -i .ssh/id_rsa -o StrictHostKeyChecking=no -o ProxyCommand='$PROXY_SSH_COMMAND'"
rsync -e "$SSH_COMMAND" -Cavz ./prd travis@mf0.dev.bgdi.ch:/home/travis/
rsync -e "$SSH_COMMAND" -Cavz ./apache travis@mf0.dev.bgdi.ch:/home/travis/
