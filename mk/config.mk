SHELL = /bin/bash

# Macro functions
lastvalue = $(shell if [ -f .build-artefacts/last-$1 ]; then cat .build-artefacts/last-$1 2> /dev/null; else echo '-none-'; fi;)

# Move a set of files ($1) to a target folder ($2) changing the file extension($3) to another($4)
define moveto
	for file in $1; do \
	  cp $$file $2$$(basename $$file $3)$4; \
	done;
endef

# rc file used
USER_SOURCE ?= rc_user

# mf-geoadmin3 or mvt_clean
PROJECT ?= mf-geoadmin3

# Info variables
USER_NAME ?= $(shell id -un)
GIT_COMMIT_HASH ?= $(shell git rev-parse --verify HEAD)
LAST_GIT_COMMIT_HASH ?= $(call lastvalue,git-commit-hash)
GIT_COMMIT_SHORT ?= $(shell git rev-parse --short $(GIT_COMMIT_HASH))
LAST_GIT_COMMIT_SHORT ?= $(call lastvalue,git-commit-short)
GIT_COMMIT_DATE ?= $(shell git log -1  --date=iso --pretty=format:%cd)
CURRENT_DATE ?= $(shell date -u +"%Y-%m-%d %H:%M:%S %z")


# Files variables
SRC_JS_FILES := $(shell find src/components src/js -type f -name '*.js')
SRC_JS_FILES_FOR_COMPILER = $(shell sed -e ':a' -e 'N' -e '$$!ba' -e 's/\n/ --js /g' .build-artefacts/js-files | sed 's/^.*base\.js //')
SRC_LESS_FILES := $(shell find src -type f -name '*.less')
SRC_COMPONENTS_PARTIALS_FILES := $(shell find src/components -type f -path '*/partials/*' -name '*.html')
PYTHON_FILES := $(shell find scripts test/saucelabs -type f -name "*.py" -print)


# Apache variables
APACHE_BASE_DIRECTORY ?= $(CURDIR)
LAST_APACHE_BASE_DIRECTORY := $(call lastvalue,apache-base-directory)
APACHE_BASE_PATH ?= $(ifneq ($(USER_NAME) "root") /$(USER_NAME))
LAST_APACHE_BASE_PATH := $(call lastvalue,apache-base-path)

# Local server
PORT ?= 9001


# App services variables
TECH_SUFFIX = .bgdi.ch
API_URL ?= //api3.geo.admin.ch
API_TECH_URL ?= //mf-chsdi3.
LAST_API_URL := $(call lastvalue,api-url)
CONFIG_URL ?= //map.geo.admin.ch
CONFIG_TECH_URL ?= //mf-geoadmin3.
LAST_CONFIG_URL := $(call lastvalue,config-url)
ALTI_URL ?= //api3.geo.admin.ch
LAST_ALTI_URL := $(call lastvalue,alti-url)
ALTI_TECH_URL ?= //mf-chsdi3.
SHOP_URL ?= //shop.swisstopo.admin.ch
SHOP_TECH_URL ?= //shop-bgdi.
LAST_SHOP_URL := $(call lastvalue,shop-url)
PUBLIC_URL ?= //public.geo.admin.ch
PUBLIC_TECH_URL ?= //public.
LAST_PUBLIC_URL := $(call lastvalue,public-url)
PRINT_URL ?= //print.geo.admin.ch
PRINT_TECH_URL ?= //service-print.
LAST_PRINT_URL := $(call lastvalue,print-url)
PROXY_URL ?= //service-proxy.prod.bgdi.ch
LAST_PROXY_URL := $(call lastvalue,proxy-url)
PYPI_URL ?= https://pypi.org/simple/
LAST_PYPI_URL := $(call lastvalue,pypi-url)
PUBLIC_URL_REGEXP ?= ^https?:\/\/public\..*\.(bgdi|admin)\.ch\/.*
ADMIN_URL_REGEXP ?= ^(ftp|http|https):\/\/(.*(\.bgdi|\.geo\.admin)\.ch)
HREF_REGEXP ?= ^\s*(https?|whatsapp|file|s?ftp|blob|mailto):


# Map services variables
WMS_URL ?= //wms.geo.admin.ch
WMS_TECH_URL ?= //wms-bgdi.
LAST_WMS_URL := $(call lastvalue,wms-url)
WMTS_URL ?= //wmts{s}.geo.admin.ch
WMTS_TECH_URL ?= //tod.
LAST_WMTS_URL ?= $(call lastvalue,wmts-url)
TERRAIN_URL ?= //terrain100.geo.admin.ch
TERRAIN_TECH_URL ?= //terrain.
LAST_TERRAIN_URL ?= $(call lastvalue,terrain-url)
VECTORTILES_URL ?= //vectortiles{s}.geo.admin.ch
VECTORTILES_TECH_URL ?= //vectortiles{s}.
LAST_VECTORTILES_URL := $(call lastvalue,vectortiles-url)


# E2E variables
E2E_TARGETURL ?= https://mf-geoadmin3.dev.bgdi.ch
E2E_TESTS ?= false
E2E_BROWSER ?= false
E2E_SINGLE ?= false
SAUCELABS_TESTS ?=


# Less variables
LESS_PARAMETERS ?= -ru


# App variables
TRANSLATION_FALLBACK_CODE ?= de
LANGUAGES ?= '[\"de\", \"fr\", \"it\", \"en\", \"rm\"]'
DEFAULT_TOPIC_ID ?= ech
TOPICS =$(shell curl -s --retry 3 https://api3.geo.admin.ch/rest/services | jq -r '.topics[].id')


# Translations variables
LANGS ?= de fr it rm en
TRANSLATE_GSPREAD_KEYS ?= 1F3R46w4PODfsbJq7jd79sapy3B7TXhQcYM7SEaccOA0
TRANSLATE_CSV_FILES ?= "https://docs.google.com/spreadsheets/d/1bRzdX2zwN2VG7LWEdlscrP-wGlp7O46nvrXkQNnFvVY/export?format=csv&gid=54811248"
TRANSLATE_EMPTY_JSON ?= src/locales/empty.json
TRANSLATE_OUTPUT ?= src/locales


# Map variables
DEFAULT_EPSG = EPSG:3857
DEFAULT_EPSG_EXTEND = '[-20037508.3428, -20037508.3428, 20037508.3428, 20037508.3428]'
# Only for WMS services
# The Swiss bounds expressed as $DEFAULT_EPSG
SWISS_EXTENT = '[558147.7958306982, 5677741.814085617, 1277662.36597472, 6152731.529704217]'
DEFAULT_EXTENT = $(DEFAULT_EPSG_EXTEND)
DEFAULT_RESOLUTION = 611.496226280
RESOLUTIONS = '[9783.939620504, 4891.969810252, 2445.984905126, 1222.9924525616, 611.4962262808, 305.7481131404, 152.87405657048, 76.43702828524, 38.21851414248, 19.109257071296, 9.554628535648, 4.777314267824, 2.388657133912, 1.194328566956, 0.597164283478, 0.2985821417404, 0.1492910708702]'
TILEGRID_ORIGIN = '[-20037508.3428, 20037508.3428]'
TILEGRID_RESOLUTIONS = '[156543.03392812, 78271.51696392, 39135.75848196, 19567.879241008, 9783.939620504, 4891.969810252, 2445.984905126, 1222.9924525616, 611.4962262808, 305.7481131404, 152.87405657048, 76.43702828524, 38.21851414248, 19.109257071296, 9.554628535648, 4.777314267824, 2.388657133912, 1.194328566956, 0.597164283478, 0.2985821417404, 0.1492910708702]'
TILEGRID_WMTS_DFLT_MIN_RES ?= 0.5

# Globe variables
DEFAULT_LEVEL_OF_DETAIL ?= 7 #level of detail for the default resolution
LEVEL_OF_DETAILS ?= '[6, 7, 8, 9, 10, 11, 12, 13, 14, 14, 16, 17, 18, 18]' #lods corresponding to resolutions
DEFAULT_TERRAIN ?= ch.swisstopo.terrain.3d
DEFAULT_ELEVATION_MODEL ?= COMB

# Build variables
KEEP_VERSION ?= false
LAST_VERSION = $(call lastvalue,version)
VERSION := $(shell if [ $(KEEP_VERSION) = true ] && [ '$(LAST_VERSION)' != '-none-' ]; then echo '$(LAST_VERSION)'; else date '+%y%m%d%H%M'; fi)
NAMED_BRANCH ?= true
DEEP_CLEAN ?= false
NVM_VERSION ?= v0.33.8
LAST_NVM_VERSION := $(call lastvalue,nvm-version)
NODE_VERSION ?= 10.15.3
LAST_NODE_VERSION := $(call lastvalue,node-version)


## Python interpreter can't have space in path name
## So prepend all python scripts with python cmd
## See: https://bugs.launchpad.net/virtualenv/+bug/241581/comments/11
PYTHON_VENV=.build-artefacts/python-venv
PYTHON_CMD=${PYTHON_VENV}/bin/python
AWS_CMD=${PYTHON_VENV}/bin/aws
PIP_CMD=${PYTHON_VENV}/bin/pip
MAKO_CMD=${PYTHON_VENV}/bin/mako-render
FLAKE8_CMD=${PYTHON_VENV}/bin/flake8
AUTOPEP8_CMD=${PYTHON_VENV}/bin/autopep8
CLOSURE_COMPILER=node_modules/google-closure-compiler/compiler.jar

# Node executables
NODE_BIN=node_modules/.bin
NVM_DIR ?= $(HOME)/.nvm
NODE_VERSION_COMPARISON := $(shell ./scripts/version_compare.sh $(NODE_VERSION) $(shell node -v))
# only set node version with NVM if needed (big impact on build perf)
ifeq ($(NODE_VERSION_COMPARISON),matches)
	# no need for nvm, you lucky bastard!
	FORCE_NODE_VERSION_IF_NEEDED=
else
	# Big disclaimer as nvm tends to make build time plummet
	FORCE_NODE_VERSION_IF_NEEDED= \
		echo -e "\n\e[33m================================================================================\n \
						Your node version doesn't match with the required version to build mf-geoadmin3 (\e[1m$(NODE_VERSION)\e[0m\e[33m).\n \
						NVM will be used to force the required version during build, but this has a big impact on build performance.\n \
						Please set your environment to use version \e[1m$(NODE_VERSION)\e[0m\e[33m of node.js for optimal build time\n \
						================================================================================\n\e[0m" \
		&& source ${NVM_DIR}/nvm.sh && nvm use ${NODE_VERSION} && 
endif
# Node version must (might, see above) be forced at every step to ensure that the default OS version is not used
# as it was causing many syntax errors in node modules (default debian jessie version is 5.9.x, most modules need > 6.x.x)
LESSC=${FORCE_NODE_VERSION_IF_NEEDED}${NODE_BIN}/lessc
KARMA=${FORCE_NODE_VERSION_IF_NEEDED}${NODE_BIN}/karma
PHANTOMJS=${FORCE_NODE_VERSION_IF_NEEDED}${NODE_BIN}/phantomjs
NG_ANNOTATE=${FORCE_NODE_VERSION_IF_NEEDED}${NODE_BIN}/ng-annotate
POSTCSS=${FORCE_NODE_VERSION_IF_NEEDED}${NODE_BIN}/postcss
HTMLMIN_CMD=${FORCE_NODE_VERSION_IF_NEEDED}${NODE_BIN}/html-minifier --minify-css --minify-js --collapse-whitespace --process-conditional-comments --remove-comments --custom-attr-collapse /ng-class/ -o
ES_LINT=${FORCE_NODE_VERSION_IF_NEEDED}${NODE_BIN}/eslint

MAKO_LAST_VARIABLES = .build-artefacts/last-api-url \
	    .build-artefacts/last-config-url \
	    .build-artefacts/last-alti-url \
	    .build-artefacts/last-shop-url \
	    .build-artefacts/last-public-url \
	    .build-artefacts/last-print-url \
	    .build-artefacts/last-proxy-url \
	    .build-artefacts/last-wms-url \
	    .build-artefacts/last-wmts-url \
	    .build-artefacts/last-terrain-url \
	    .build-artefacts/last-vectortiles-url \
	    .build-artefacts/last-apache-base-path

MAKO_LAST_VARIABLES_PROD = ${MAKO_LAST_VARIABLES} \
	    .build-artefacts/last-version

# Config MVT
OFFLINE_MIN_ZOOM ?= 8    # First zoom from which we save the 15km2, before we save tiles on the entire DEFAULT_EXTENT.
OFFLINE_MIN_ZOOM_NON_BGLAYER ?= 12 # For non bg layer we only save the 15km2 from this zoom level. Must be a even number because e load only 1 level on 2.
OFFLINE_MAX_ZOOM ?= 16   # Last zoom saved
OFFLINE_Z_OFFSET ?= 0   # Difference between map zoom levekl and layer zoom lvel to request. In swiss coordinate it's 14 for stop layer.
