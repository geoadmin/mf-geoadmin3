#!/bin/bash

# A POSIX variable
OPTIND=1         # Reset in case getopts has been used previously in the shell.

#
# Script to test htmlpopups. It let's you
# - specify just on layer to test
# - specify if features should be randomized
# - number of features to test

# Adapt the below variables accoring to your needs

# Name of the layer to test. Comment if you want to test all. Must be
# valid chsdi layername that has queryable attribute = True
export CHSDI_ONLY_LAYER=ch.swisstopo.lubis-bildstreifen

# Staging of the layer above. Must correspond to the attached bod
export CHSDI_STAGING=prod

# Set the below variable to True if you want to randomiz the feature(s) used for testing
# Randomisation has performance impact for large tables (lots of features)
export CHSDI_RANDOM_FEATURES=False

# Number of features to the the popups with
# Uncomment to limit to 1
# Non number means 'all' - potentially nuclear option for layers with alot of features (e.g. GWR)
export CHSDI_NUM_FEATURES=10

buildout/bin/nosetests chsdi/tests/integration/test_layers.py:test_all_htmlpopups
