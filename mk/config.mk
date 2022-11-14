SHELL = /bin/bash

# Macro functions
lastvalue = $(shell if [ -f ".build-artefacts/last-$1" ]; then cat .build-artefacts/last-$1 2> /dev/null; else echo '-none-'; fi;)

# Move a set of files ($1) to a target folder ($2) changing the file extension($3) to another($4)
define moveto
	for file in $1; do \
	  cp $$file $2$$(basename $$file $3)$4; \
	done;
endef


# default staging is prod
STAGING ?= prod
# default rc file used is prod
RUNTIME_CONFIGURATION_FILE ?= rc_prod

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
# on mf1-dev, we can't be root, so geodata is also used as a surrogate to build the main apache config
APACHE_BASE_PATH ?= $(shell if [ "${USER_NAME}" = "root" ] || [ "${USER_NAME}" = "geodata" ]; then echo ""; else echo "/$(USER_NAME)"; fi;)
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
METEO_STYLE_BASEURL ?= //cms.geo.admin.ch
LAST_CONFIG_URL := $(call lastvalue,config-url)
ALTI_URL ?= //api3.geo.admin.ch
LAST_ALTI_URL := $(call lastvalue,alti-url)
ALTI_TECH_URL ?= //mf-chsdi3.
SHOP_URL ?= //shop.swisstopo.admin.ch
SHOP_TECH_URL ?= //shop-bgdi.
LAST_SHOP_URL := $(call lastvalue,shop-url)
FEEDBACK_URL ?= //map.geo.admin.ch
FEEDBACK_TECH_URL ?= //sys-map.prod.bgdi.ch
LAST_FEEDBACK_URL := $(call lastvalue, feedback-url)
PUBLIC_URL ?= //public.geo.admin.ch
PUBLIC_TECH_URL ?= //public.
LAST_PUBLIC_URL := $(call lastvalue,public-url)
PRINT_URL ?= //print.geo.admin.ch
PRINT_TECH_URL ?= //service-print.
LAST_PRINT_URL := $(call lastvalue,print-url)
QRCODE_URL ?= //sys-map.dev.bgdi.ch
QRCODE_TECH_URL ?= //sys-map.
LAST_QRCODE_URL := $(call lastvalue,qrcode-url)
QRCODE_PATH ?= /api/qrcode/generate
LAST_QRCODE_PATH := $(call lastvalue,qrcode-path)
PROXY_URL ?= //service-proxy.prod.bgdi.ch
LAST_PROXY_URL := $(call lastvalue,proxy-url)
SHORTEN_URL ?= s.geo.admin.ch
SHORTEN_TECH_URL ?= //sys-s.
LAST_SHORTEN_URL := $(call lastvalue,shorten-url)
STORAGE_URL ?= //sys-public.prod.bgdi.ch
STORAGE_TECH_URL ?= //sys-public.prod.bgdi.ch
STORAGE_LAST_URL := $(call lastvalue,storage-url)
PYPI_URL ?= https://pypi.org/simple/
LAST_PYPI_URL := $(call lastvalue,pypi-url)
PUBLIC_URL_REGEXP ?= ^https?:\/\/(sys-)?public\..*\.(bgdi|admin)\.ch\/.*
ADMIN_URL_REGEXP ?= ^(ftp|http|https):\/\/(.*(\.bgdi\.ch|\.geo\.admin\.ch|\.swisstopo\.cloud))
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
TOPICS =$(shell curl -L -s --retry 3 https:$(API_URL)/rest/services | jq -r '.topics[].id')


# Translations variables
LANGS ?= de fr it rm en
TRANSLATE_GSPREAD_KEYS ?= 1F3R46w4PODfsbJq7jd79sapy3B7TXhQcYM7SEaccOA0
TRANSLATE_CSV_FILES ?= "https://docs.google.com/spreadsheets/d/1bRzdX2zwN2VG7LWEdlscrP-wGlp7O46nvrXkQNnFvVY/export?format=csv&gid=54811248"
TRANSLATE_EMPTY_JSON ?= src/locales/empty.json
TRANSLATE_OUTPUT ?= src/locales


# Map variables
DEFAULT_EPSG ?= EPSG:2056
DEFAULT_EPSG_EXTEND ?= '[2420000, 1030000, 2900000, 1350000]'
DEFAULT_EXTENT ?= '[2420000, 1030000, 2900000, 1350000]'
DEFAULT_RESOLUTION ?= 500.0
RESOLUTIONS ?= '[650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.0, 0.5, 0.25, 0.1]'
TILEGRID_ORIGIN ?= '[2420000, 1350000]'
TILEGRID_RESOLUTIONS ?= '[4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1]'
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
DEEP_CLEAN ?= false
NVM_VERSION ?= v0.33.8
LAST_NVM_VERSION := $(call lastvalue,nvm-version)
NODE_VERSION ?= 10.15.3
LAST_NODE_VERSION := $(call lastvalue,node-version)
LAYERSCONFIG_VERSION ?= $(shell date +%Y%m%d%H%M%S)
LAST_LAYERSCONFIG_VERSION := $(call lastvalue,layersconfig-version)


## Python interpreter can't have space in path name
## So prepend all python scripts with python cmd
## See: https://bugs.launchpad.net/virtualenv/+bug/241581/comments/11
PYTHON_VENV=.build-artefacts/python-venv
PYTHON_CMD=${PYTHON_VENV}/bin/python2
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
		@echo -e "\n\e[33m================================================================================\n \
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


