#!/bin/bash

# Adapt your ~/.pgpass file for this to work

# A POSIX variable
OPTIND=1         # Reset in case getopts has been used previously in the shell.

conf_to_use="buildout_nose_dev.cfg"

while getopts "ip" opt; do
  case "$opt" in
  i) conf_to_use="buildout_nose_int.cfg"
     ;;
  p) conf_to_use="buildout_nose_prod.cfg"
     ;;
  esac
done

shift $((OPTIND-1))
[ "$1" = "--" ] && shift

mv -f production.ini production.ini.bup
mv -f development.ini development.ini.bup

buildout/bin/buildout -c $conf_to_use install nosetest-ini && buildout/bin/nosetests -I test_links.py -I mapproxy/test_wmtscapabilities.py -I test_wmtsgettile.py -I test_varnish.py

rc=$?

mv -f production.ini.bup production.ini
mv -f development.ini.bup development.ini

exit $rc

