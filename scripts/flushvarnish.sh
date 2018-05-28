#!/bin/bash

# First parameter is varnish host
# Second parameter is base url to flush

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 2 ] || die "2 argument required, $# provided, Parameter1: $1"

ssh -l ${USER} $1 "sudo varnish-ban.sh 'req.http.host_header == $2 && req.url ~ \"^/[0-9]+/\"'"

