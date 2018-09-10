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


# Info variables
USER_NAME ?= $(shell id -un)
GIT_COMMIT_HASH ?= $(shell git rev-parse --verify HEAD)
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
APACHE_BASE_PATH ?= /$(shell id -un)
LAST_APACHE_BASE_PATH := $(call lastvalue,apache-base-path)


# App services variables
TECH_SUFFIX = .bgdi.ch
API_URL ?= //api3.geo.admin.ch
API_TECH_URL ?= //mf-chsdi3.
LAST_API_URL := $(call lastvalue,api-url)
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


# Map libs variables
OL_VERSION ?= generate_all_exports_library # generate_all_exports_library branch from gberaudo repository, September 10 2018
OL_CESIUM_VERSION ?= v2.2.2 # v2.2.2, September 10 2018
CESIUM_VERSION ?= 54d850855346610fde9b7aa8262a03d27e71c663 # c2c/c2c_patches (Cesium 1.44), April 23 2018


# App variables
TRANSLATION_FALLBACK_CODE ?= de
LANGUAGES ?= '[\"de\", \"fr\", \"it\", \"en\", \"rm\"]'
DEFAULT_TOPIC_ID ?= ech


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
NAMED_BRANCH ?= true
DEEP_CLEAN ?= false


# S3 deploy variables
DEPLOY_TARGET ?= int
DEPLOY_GIT_BRANCH ?= $(shell git rev-parse --symbolic-full-name --abbrev-ref HEAD)
CLONEDIR = /home/$(USER_NAME)/tmp/branches/${DEPLOY_GIT_BRANCH}
CODE_DIR ?= .
S3_BASE_PATH =
S3_SRC_BASE_PATH =
ifeq ($(NAMED_BRANCH), false)
  SHA := $(shell git rev-parse HEAD | cut -c1-7)
  S3_BASE = /$(DEPLOY_GIT_BRANCH)/$(SHA)/$(VERSION)
  S3_BASE_PATH = $(S3_BASE)/
  S3_SRC_BASE_PATH = $(S3_BASE)/src/
endif


# S3 activation variables
S3_VERSION_PATH ?=


# S3 delete variables
BRANCH_TO_DELETE ?=


## Python interpreter can't have space in path name
## So prepend all python scripts with python cmd
## See: https://bugs.launchpad.net/virtualenv/+bug/241581/comments/11
PYTHON_VENV=.build-artefacts/python-venv
PYTHON_CMD=${PYTHON_VENV}/bin/python
PIP_CMD=${PYTHON_VENV}/bin/pip
MAKO_CMD=${PYTHON_VENV}/bin/mako-render
FLAKE8_CMD=${PYTHON_VENV}/bin/flake8
AUTOPEP8_CMD=${PYTHON_VENV}/bin/autopep8
CLOSURE_COMPILER=node_modules/google-closure-compiler/compiler.jar

# Node executables
NODE_BIN=node_modules/.bin
LESSC=${NODE_BIN}/lessc
KARMA=${NODE_BIN}/karma
PHANTOMJS=${NODE_BIN}/phantomjs
NG_ANNOTATE=${NODE_BIN}/ng-annotate
BABEL=${NODE_BIN}/babel
POSTCSS=${NODE_BIN}/postcss
HTMLMIN_CMD=${NODE_BIN}/html-minifier --minify-css --minify-js --collapse-whitespace --process-conditional-comments --remove-comments --custom-attr-collapse /ng-class/ -o

MAKO_LAST_VARIABLES = .build-artefacts/last-api-url \
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



.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo
	@echo "Possible targets:"
	@echo
	@echo "- user                Build the app using user specific environment variables (see $(USER_SOURCE) file)"
	@echo "- all                 Build the app using current environment variables"
	@echo "- build               Build the app using current environment variables. No linting and testing."
	@echo "- dev                 Build the app using dev environment variables (see rc_dev file). No linting and testing."
	@echo "- int                 Build the app using int environment variables (see rc_int file). No linting and testing."
	@echo "- prod                Build the app using prod environment variables (see rc_prod file). No linting and testing."
	@echo "- release             Build app for release (/prd)"
	@echo "- debug               Build app for debug (/src)"
	@echo "- lint                Run the linter on src/components, src/js folders, test/specs and python files"
	@echo "- testdebug           Run the JavaScript tests in debug mode"
	@echo "- testrelease         Run the JavaScript tests in release mode"
	@echo "- teste2e             Run saucelabs tests"
	@echo "- saucelabssingle     Run saucelabs tests but only with single platform/browser"
	@echo "- apache              Configure Apache (restart required)"
	@echo "- fixrights           Fix rights in common folder"
	@echo "- clean               Remove generated files"
	@echo "- cleanall            Remove all the build artefacts"
	@echo "- deploydev           Deploys current github master to dev. Specify SNAPSHOT=true to create snapshot as well."
	@echo "- s3deploybranchint   Build a branch and deploy it to S3 int. Defaults to the current branch name."
	@echo "- s3deploybranchinfra Build a branch and deploy it to S3 infra. Defaults to the current branch name."
	@echo "- s3deployint         Deploys a snapshot specified with SNAPSHOT=xxx to s3 int."
	@echo "- s3deployprod        Deploys a snapshot specified with SNAPSHOT=xxx to s3 prod."
	@echo "- s3activateint       Activate a version at the root of a remote bucket. (usage only: make s3activateint S3_VERSION_PATH=<branch>/<sha>/<version>)"
	@echo "- s3activateprod      Activate a version at the root of a remote bucket. (usage only: make s3activateprod S3_VERSION_PATH=<branch>/<sha>/<version>)"
	@echo "- s3copybranch        Copy the current directory content to S3. Defaults to the current branch name. WARNING: your code must have been compiled with 'make <user|int|prod>' first."
	@echo "                      Usage: make s3copybranch DEPLOY_TARGET=<int|prod>"
	@echo "                                               NAMED_BRANCH=<true|false>"
	@echo "                                               CODE_DIR=<Path to the folder, default to current folder> (optional)"
	@echo "                                               DEPLOY_GIT_BRANCH=<Name of the branch to deploy, default to current branch> (optional)"
	@echo "- s3listint           List availables branches, revision and build on int bucket."
	@echo "- s3listprod          List availables branches, revision and build on prod bucket."
	@echo "- s3infoint           Get version info on remote int bucket. (usage only: make s3infoint S3_VERSION_PATH=<branch>/<sha>/<version>)"
	@echo "- s3infoprod          Get version info on remote prod bucket. (usage only: make s3infoprod S3_VERSION_PATH=<branch>/<sha>/<version>)"
	@echo "- s3deleteint         Delete a project version in a remote int bucket. (usage: make s3deleteint S3_VERSION_PATH=<branch> or <branch>/<sha>/<version>)"
	@echo "- s3deleteprod        Delete a project version in a remote prod bucket. (usage: make s3deleteprod S3_VERSION_PATH=<branch> or <branch>/<sha>/<version>)"
	@echo "- flushvarnish        Flush varnish instances. (usage: make flushvarnish DEPLOY_TARGET=<int|prod|infra>)"
	@echo "- cesium              Update Cesium.min.js and Cesium folder. Needs Node js version >= 6."
	@echo "- olcesium            Update olcesium.js, olcesium-debug.js. Needs Node js version >= 6 and java >=8."
	@echo "- libs                Update js librairies used in index.html, see npm packages defined in section 'dependencies' of package.json"
	@echo "- translate           Generate the translation files (requires db user pwd in ~/.pgpass: dbServer:dbPort:*:dbUser:dbUserPwd)"
	@echo "- help                Display this help"
	@echo
	@echo "Variables:"
	@echo
	@echo "- API_URL Service URL         (build with: $(LAST_API_URL), current value: $(API_URL))"
	@echo "- ALTI_URL Alti service URL   (build with: $(LAST_ALTI_URL), current value: $(ALTI_URL))"
	@echo "- PRINT_URL Print service URL (build with: $(LAST_PRINT_URL), current value: $(PRINT_URL))"
	@echo "- SHOP_URL Service URL        (build with: $(LAST_SHOP_URL), current value: $(SHOP_URL))"
	@echo "- WMS_URL Service URL         (build with  $(LAST_WMS_URL), current value: $(WMS_URL))"
	@echo "- WMTS_URL Service URL        (build with  $(LAST_WMTS_URL), current value: $(WMTS_URL))"
	@echo "- TERRAIN_URL Service URL     (build with: $(LAST_TERRAIN_URL), current value: $(TERRAIN_URL))"
	@echo "- VECTORTILES_URL Service URL (build with: $(LAST_VECTORTILES_URL), current value: $(VECTORTILES_URL))"
	@echo "- APACHE_BASE_PATH Base path  (build with: $(LAST_APACHE_BASE_PATH), current value: $(APACHE_BASE_PATH))"
	@echo "- APACHE_BASE_DIRECTORY       (build with: $(LAST_APACHE_BASE_DIRECTORY), current value: $(APACHE_BASE_DIRECTORY))"
	@echo "- VERSION                     (build with: $(LAST_VERSION), current value: $(VERSION))"
	@echo "- SNAPSHOT                    (current value: $(SNAPSHOT))"
	@echo "- DEPLOY_GIT_BRANCH           (current value: $(DEPLOY_GIT_BRANCH))"
	@echo "- GIT_COMMIT_HASH             (current value: $(GIT_COMMIT_HASH))"
	@echo "- VARNISH_HOSTS               (current value: ${VARNISH_HOSTS})"
	@echo "- DEPLOY_TARGET               (current value: ${DEPLOY_TARGET})"
	@echo

showVariables:
	@echo "DEPLOY_TARGET = $(DEPLOY_TARGET)"
	@echo "VERSION = $(VERSION)"
	@echo "S3_BASE_PATH = $(S3_BASE_PATH)"
	@echo "S3_SRC_BASE_PATH = $(S3_SRC_BASE_PATH)"

.PHONY: all
all: showVariables lint debug release apache testdebug testrelease fixrights

.PHONY: user
user:
	source $(USER_SOURCE) && make all

.PHONY: build
build: showVariables .build-artefacts/devlibs .build-artefacts/requirements.timestamp $(SRC_JS_FILES) debug release

.PHONY: dev
dev:
	source rc_dev && make build

.PHONY: int
int:
	source rc_int && make build

.PHONY: prod
prod:
	source rc_prod && make build

.PHONY: release
release: showVariables \
	.build-artefacts/devlibs \
	prd/lib/ \
	prd/lib/Cesium/ \
	prd/lib/Cesium/Workers/ \
	prd/lib/Cesium/ThirdParty/Workers/ \
	prd/lib/build.js \
	prd/style/app.css \
	prd/geoadmin.appcache \
	prd/index.html \
	prd/mobile.html \
	prd/embed.html \
	prd/404.html \
	prd/img/ \
	prd/style/font-awesome-4.5.0/font/ \
	prd/locales/ \
	prd/checker \
	prd/cache/ \
	prd/info.json \
	prd/robots.txt \
	prd/robots_prod.txt

.PHONY: debug
debug: showVariables \
	.build-artefacts/devlibs \
	src/deps.js \
	src/style/app.css \
	src/index.html \
	src/mobile.html \
	src/embed.html \
	src/404.html

.PHONY: lint
lint: .build-artefacts/devlibs .build-artefacts/requirements.timestamp $(SRC_JS_FILES) linttest lintpy
	${NODE_BIN}/eslint $(SRC_JS_FILES) --fix

linttest: .build-artefacts/devlibs .build-artefacts/requirements.timestamp
	${NODE_BIN}/eslint test/specs/ --fix

lintpy: .build-artefacts/requirements.timestamp ${FLAKE8_CMD} ${PYTHON_FILES}
	${AUTOPEP8_CMD} --in-place --aggressive --aggressive --verbose --max-line-lengt=110 $(PYTHON_FILES)

.PHONY: testdebug
testdebug: .build-artefacts/app-whitespace.js test/karma-conf-debug.js
	PHANTOMJS_BIN="${PHANTOMJS}" ${KARMA} start test/karma-conf-debug.js;
	cat .build-artefacts/coverage/coverage.txt; echo;
	echo "A complete report is available at ${E2E_TARGETURL}${APACHE_BASE_PATH}/src/coverage/index.html"

.PHONY: testrelease
testrelease: prd/lib/build.js test/karma-conf-release.js .build-artefacts/devlibs
	PHANTOMJS_BIN="${PHANTOMJS}" ${KARMA} start test/karma-conf-release.js;

.PHONY: teste2e
teste2e: saucelabs

.PHONY: saucelabs
saucelabs: guard-SAUCELABS_USER guard-SAUCELABS_KEY .build-artefacts/requirements.timestamp lintpy
	${PYTHON_CMD} test/saucelabs/test.py --url ${E2E_TARGETURL} \
	                                     --tests ${E2E_TESTS} \
	                                     --browser ${E2E_BROWSER} \
	                                     --single ${E2E_SINGLE}

.PHONY: saucelabssingle
saucelabssingle:
	make saucelabs E2E_SINGLE=true E2E_TESTS=${E2E_TESTS}

.PHONY: apache
apache: apache/app.conf

.PHONY: deploydev
deploydev:
	@ if test $(SNAPSHOT) = true; then \
		./scripts/deploydev.sh -s; \
	else \
		./scripts/deploydev.sh; \
	fi

.PHONY: s3deployinfra
s3deployinfra: guard-SNAPSHOT .build-artefacts/requirements.timestamp
	./scripts/deploysnapshot.sh $(SNAPSHOT) infra;

.PHONY: s3deployint
s3deployint: guard-SNAPSHOT .build-artefacts/requirements.timestamp
	./scripts/deploysnapshot.sh $(SNAPSHOT) int;

.PHONY: s3deployprod
s3deployprod: guard-SNAPSHOT .build-artefacts/requirements.timestamp
	./scripts/deploysnapshot.sh $(SNAPSHOT) prod;

s3deploybranch: guard-CLONEDIR \
                guard-DEPLOY_TARGET \
                guard-DEPLOY_GIT_BRANCH \
                guard-DEEP_CLEAN \
                guard-NAMED_BRANCH \
                .build-artefacts/requirements.timestamp \
                showVariables
	./scripts/clonebuild.sh ${CLONEDIR} ${DEPLOY_TARGET} ${DEPLOY_GIT_BRANCH} ${DEEP_CLEAN} ${NAMED_BRANCH};
	make s3copybranch CODE_DIR=${CLONEDIR}/mf-geoadmin3 \
                    DEPLOY_TARGET=${DEPLOY_TARGET} \
                    NAMED_BRANCH=${NAMED_BRANCH}

.PHONY: s3deploybranchint
s3deploybranchint:
	make s3deploybranch DEPLOY_TARGET=int

.PHONY: s3deploybranchinfra
s3deploybranchinfra:
	make s3deploybranch DEPLOY_TARGET=infra

.PHONY: s3copybranch
s3copybranch: guard-DEPLOY_TARGET \
              guard-NAMED_BRANCH \
              guard-CODE_DIR \
              guard-DEPLOY_GIT_BRANCH \
              .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py upload ${CODE_DIR} ${DEPLOY_TARGET} ${NAMED_BRANCH} ${DEPLOY_GIT_BRANCH};

.PHONY: s3listinfra
s3listinfra: .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py list infra;

.PHONY: s3listint
s3listint: .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py list int;

.PHONY: s3listprod
s3listprod: .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py list prod;

.PHONY: s3infoinfra
s3infoinfra: guard-S3_VERSION_PATH .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py info ${S3_VERSION_PATH} infra;

.PHONY: s3infoint
s3infoint: guard-S3_VERSION_PATH .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py info ${S3_VERSION_PATH} int;

.PHONY: s3infoprod
s3infoprod: guard-S3_VERSION_PATH .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py info ${S3_VERSION_PATH} prod;

.PHONY: s3activateinfra
s3activateinfra: guard-S3_VERSION_PATH .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py activate ${S3_VERSION_PATH} infra;

.PHONY: s3activateint
s3activateint: guard-S3_VERSION_PATH .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py activate ${S3_VERSION_PATH} int;

.PHONY: s3activateprod
s3activateprod: guard-S3_VERSION_PATH .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py activate ${S3_VERSION_PATH} prod;

.PHONY: s3deleteinfra
s3deleteinfra: guard-S3_VERSION_PATH .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py delete ${S3_VERSION_PATH} infra;

.PHONY: s3deleteint
s3deleteint: guard-S3_VERSION_PATH .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py delete ${S3_VERSION_PATH} int;

.PHONY: s3deleteprod
s3deleteprod: guard-S3_VERSION_PATH .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py delete ${S3_VERSION_PATH} prod;

.PHONY: flushvarnish
flushvarnish: guard-DEPLOY_TARGET
	source rc_${DEPLOY_TARGET} && make flushvarnishinternal

# This internal target has been created to have the good global variable values
# from rc_XXX file.
flushvarnishinternal: guard-API_URL guard-E2E_TARGETURL
	@if [ ! $(VARNISH_HOSTS) ] ; then \
	  echo 'The VARNISH_HOSTS variable in rc_${DEPLOY_TARGET} is empty.';\
		echo 'Nothing to be done.'; \
	fi; \
	for VARNISHHOST in $(VARNISH_HOSTS) ; do \
		./scripts/flushvarnish.sh $$VARNISHHOST "$(subst //,,$(API_URL))" ;\
		./scripts/flushvarnish.sh $$VARNISHHOST "$(subst https://,,$(E2E_TARGETURL))" ;\
		echo "Flushed varnish at: $$VARNISHHOST" ;\
	done;

.PHONY: cesium
cesium: .build-artefacts/cesium
	cd .build-artefacts/cesium; \
	git remote add c2c https://github.com/camptocamp/cesium; \
	git fetch --all; \
	git checkout $(CESIUM_VERSION); \
	npm install; \
	npm run combineRelease; \
	npm run minifyRelease; \
	rm -r ../../src/lib/Cesium; \
	cp -r Build/CesiumUnminified ../../src/lib/Cesium; \
	cp Build/Cesium/Cesium.js ../../src/lib/Cesium.min.js; \
	$(call moveto,Build/Cesium/Workers/*.js,../../src/lib/Cesium/Workers/,'.js','.min.js') \
	$(call moveto,Build/Cesium/ThirdParty/Workers/*.js,../../src/lib/Cesium/ThirdParty/Workers/,'.js','.min.js')

openlayers: .build-artefacts/openlayers
	cd .build-artefacts/openlayers; \
	git fetch --all; \
	git checkout $(OL_VERSION); \
	npm install; \
	make build

.PHONY: olcesium
olcesium:  .build-artefacts/cesium openlayers .build-artefacts/olcesium
	if ! [ -f ".build-artefacts/cesium/Build/Cesium/Cesium.js" ]; then make cesium; else echo 'Cesium already built'; fi; \
	cd .build-artefacts/olcesium; \
	git fetch --all; \
	git checkout $(OL_CESIUM_VERSION); \
	mkdir -p src/olcs/plugins/geoadmin; \
	cp -r ../../olcesium-plugin src/olcs/plugins/geoadmin/; \
	npm install; \
	npm link ../cesium; \
	npm link ../openlayers; \
	sed -i "1 s/^{\$$/{root: true,/" .eslintrc.yaml; \
	node build/generate-exports.js dist/exports.js; \
	node build/build.js ../../scripts/olcesium-debug-geoadmin.json dist/olcesium-debug.js; \
	node build/build.js ../../scripts/olcesium-geoadmin.json dist/olcesium.js; \
	cp dist/olcesium-debug.js ../../src/lib/; \
	cp dist/olcesium.js ../../src/lib/olcesium.js; \
	cp Cesium.externs.js ../../externs/Cesium.externs.js; \

.PHONY: filesaver
filesaver: .build-artefacts/filesaver
	cp .build-artefacts/filesaver/FileSaver.js src/lib/filesaver.js
	cp .build-artefacts/filesaver/FileSaver.min.js src/lib/filesaver.min.js

.PHONY: datepicker
datepicker: .build-artefacts/datepicker
	cp .build-artefacts/datepicker/src/js/bootstrap-datetimepicker.js src/lib/
	cp .build-artefacts/datepicker/src/less/bootstrap-datetimepicker.less src/style/
	cp .build-artefacts/datepicker/build/js/bootstrap-datetimepicker.min.js src/lib/

.PHONY: polyfill
polyfill: .build-artefacts/polyfill
	cp $</polyfill.js src/lib/
	cp $</polyfill.min.js src/lib/

.PHONY: translate
translate:
	${PYTHON_CMD} scripts/translation2json.py \
            --files $(TRANSLATE_CSV_FILES) \
            --languages "$(LANGUAGES)" \
            --empty-json-file $(TRANSLATE_EMPTY_JSON) \
            --output-folder $(TRANSLATE_OUTPUT)

.PHONY: fixrights
fixrights:
	@ if grep 'geodata' /etc/group; then \
		chgrp -f -R geodata . || : ; \
	fi; \
	chmod -f -R g+rw . || :

guard-%:
	@ if test "${${*}}" = ""; then \
	  echo "Environment variable $* not set. Add it to your command."; \
	  exit 1; \
	fi

prd/robots.txt: scripts/robots.mako-dot-txt .build-artefacts/last-version
	mkdir -p $(dir $@)
	${PYTHON_CMD} ${MAKO_CMD} \
	    --var "version=$(VERSION)" \
	    --var "deploy_target=dev" $< > $@

prd/robots_prod.txt: scripts/robots.mako-dot-txt .build-artefacts/last-version
	mkdir -p $(dir $@)
	${PYTHON_CMD} ${MAKO_CMD} \
	    --var "version=$(VERSION)" \
	    --var "deploy_target=prod" $< > $@

prd/lib/: src/lib/d3.min.js \
	    src/lib/bootstrap-datetimepicker.min.js  \
	    src/lib/IE9Fixes.js \
	    src/lib/jquery.xdomainrequest.min.js \
	    src/lib/Cesium.min.js \
	    src/lib/olcesium.js
	mkdir -p $@
	cp -rf  $^ $@

prd/lib/Cesium/: src/lib/Cesium/Assets
	mkdir -p $@
	cp -rf  $^ $@

prd/lib/Cesium/Workers/: src/lib/Cesium/Workers/*.min.js
	mkdir -p $@; \
	$(call moveto,$^,$@,'.min.js','.js')

prd/lib/Cesium/ThirdParty/Workers/: src/lib/Cesium/ThirdParty/Workers/*.min.js
	mkdir -p $@; \
	$(call moveto,$^,$@,'.min.js','.js')

prd/lib/build.js: src/lib/polyfill.min.js \
	    src/lib/jquery.min.js \
	    src/lib/slip.min.js \
	    src/lib/bootstrap.min.js \
	    src/lib/moment-with-customlocales.min.js \
	    src/lib/typeahead.jquery.min.js \
	    src/lib/angular.min.js \
	    src/lib/proj4js-compressed.js \
	    src/lib/EPSG21781.js \
	    src/lib/EPSG2056.js \
	    src/lib/EPSG32631.js \
	    src/lib/EPSG32632.js \
	    src/lib/olcesium.js \
	    src/lib/angular-translate.min.js \
	    src/lib/angular-translate-loader-static-files.min.js \
	    src/lib/fastclick.min.js \
	    src/lib/localforage.min.js \
	    src/lib/filesaver.min.js \
	    src/lib/gyronorm.complete.min.js \
	    .build-artefacts/app.js
	mkdir -p $(dir $@)
	cat $^ | sed 's/^\/\/[#,@] sourceMappingURL=.*//' > $@

prd/style/app.css: $(SRC_LESS_FILES)
	mkdir -p $(dir $@)
	${LESSC} $(LESS_PARAMETERS) --clean-css src/style/app.less $@
	${POSTCSS} $@ --use autoprefixer --replace --no-map

prd/geoadmin.appcache: src/geoadmin.mako.appcache \
			${MAKO_CMD} \
			.build-artefacts/last-version
	rm -f prd/*.appcache
	mkdir -p $(dir $@);
	${PYTHON_CMD} ${MAKO_CMD} \
	    --var "version=$(VERSION)" \
	    --var "deploy_target=$(DEPLOY_TARGET)" \
	    --var "apache_base_path=$(APACHE_BASE_PATH)" \
	    --var "languages=$(LANGUAGES)" \
	    --var "s3basepath=$(S3_BASE_PATH)" $< > $@
	mv $@ prd/geoadmin.$(VERSION).appcache

prd/cache/: .build-artefacts/last-version \
			.build-artefacts/last-api-url
	mkdir -p $@
	curl -q -o prd/cache/services http:$(API_URL)/rest/services
	$(foreach lang, $(LANGS), curl -s --retry 3 -o prd/cache/layersConfig.$(lang).json http:$(API_URL)/rest/services/all/MapServer/layersConfig?lang=$(lang);)

prd/info.json: src/info.mako.json
	${PYTHON_CMD} ${MAKO_CMD} \
		--var "version=$(VERSION)" \
		--var "user_name=$(USER_NAME)" \
		--var "git_branch=$(DEPLOY_GIT_BRANCH)" \
		--var "git_commit_date=$(GIT_COMMIT_DATE)" \
		--var "git_commit_hash=$(GIT_COMMIT_HASH)" \
		--var "build_date=$(CURRENT_DATE)"  $< > $@

define buildpage
	${PYTHON_CMD} ${MAKO_CMD} \
		--var "device=$1" \
		--var "mode=$2" \
		--var "version=$3" \
		--var "versionslashed=$4" \
		--var "s3basepath"="$5" \
		--var "apache_base_path=$(APACHE_BASE_PATH)" \
		--var "tech_suffix=$(TECH_SUFFIX)" \
		--var "api_url=$(API_URL)" \
		--var "api_tech_url=$(API_TECH_URL)" \
		--var "alti_url=$(ALTI_URL)" \
		--var "alti_tech_url=$(ALTI_TECH_URL)" \
		--var "print_url=$(PRINT_URL)" \
		--var "print_tech_url=$(PRINT_TECH_URL)" \
		--var "proxy_url=$(PROXY_URL)" \
		--var "public_url=$(PUBLIC_URL)" \
		--var "public_tech_url=$(PUBLIC_TECH_URL)" \
		--var "shop_url=$(SHOP_URL)" \
		--var "shop_tech_url=$(SHOP_TECH_URL)" \
		--var "wms_url=$(WMS_URL)" \
		--var "wms_tech_url=$(WMS_TECH_URL)" \
		--var "wmts_url=$(WMTS_URL)" \
		--var "wmts_tech_url=$(WMTS_TECH_URL)" \
		--var "terrain_url=$(TERRAIN_URL)" \
		--var "terrain_tech_url=$(TERRAIN_TECH_URL)" \
		--var "vectortiles_url=$(VECTORTILES_URL)" \
		--var "vectortiles_tech_url=$(VECTORTILES_TECH_URL)" \
		--var "default_topic_id=$(DEFAULT_TOPIC_ID)" \
		--var "translation_fallback_code=$(TRANSLATION_FALLBACK_CODE)" \
		--var "languages=$(LANGUAGES)" \
		--var "default_extent"="$(DEFAULT_EXTENT)" \
		--var "default_resolution"="$(DEFAULT_RESOLUTION)" \
		--var "default_level_of_detail"="$(DEFAULT_LEVEL_OF_DETAIL)" \
		--var "resolutions"="$(RESOLUTIONS)" \
		--var "level_of_details"="$(LEVEL_OF_DETAILS)" \
		--var "default_elevation_model=${DEFAULT_ELEVATION_MODEL}" \
		--var "default_terrain=$(DEFAULT_TERRAIN)" \
		--var "admin_url_regexp=$(ADMIN_URL_REGEXP)" \
		--var "public_url_regexp=$(PUBLIC_URL_REGEXP)" \
		--var "href_regexp=$(HREF_REGEXP)" \
		--var "default_epsg"="$(DEFAULT_EPSG)" \
		--var "default_epsg_extend"="$(DEFAULT_EPSG_EXTEND)" \
		--var "tilegrid_origin"="$(TILEGRID_ORIGIN)" \
		--var "tilegrid_resolutions"="$(TILEGRID_RESOLUTIONS)" \
		--var "tilegrid_wmts_dflt_min_res"="$(TILEGRID_WMTS_DFLT_MIN_RES)" \
		--var "staging"="$(DEPLOY_TARGET)" $< > $@
endef

define applypatches
	git apply --directory=src/lib scripts/fastclick.patch;
	git apply --directory=src/lib scripts/slipjs.patch;
endef

define compilejs
	java -jar ${CLOSURE_COMPILER} \
		src/lib/$1.js \
		--compilation_level SIMPLE_OPTIMIZATIONS \
		--js_output_file  src/lib/$1.min.js;
endef

define cachelastvariable
	mkdir -p $(dir $1)
	test "$2" != "$3" && \
	    echo "$2" > .build-artefacts/last-$4 || :
endef
prd/index.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    ${MAKO_LAST_VARIABLES_PROD}
	mkdir -p $(dir $@)
	$(call buildpage,desktop,prod,$(VERSION),$(VERSION)/,$(S3_BASE_PATH))
	${HTMLMIN_CMD} $@ $@

prd/mobile.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    ${MAKO_LAST_VARIABLES_PROD}
	mkdir -p $(dir $@)
	$(call buildpage,mobile,prod,$(VERSION),$(VERSION)/,$(S3_BASE_PATH))
	${HTMLMIN_CMD} $@ $@

prd/embed.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    ${MAKO_LAST_VARIABLES_PROD}
	mkdir -p $(dir $@)
	$(call buildpage,embed,prod,$(VERSION),$(VERSION)/,$(S3_BASE_PATH))
	${HTMLMIN_CMD} $@ $@

prd/404.html: src/404.html
	mkdir -p $(dir $@)
	${HTMLMIN_CMD} $@ $<

prd/img/: src/img/*
	mkdir -p $@
	cp -R $^ $@
	cp -f $@/favicon.ico $@/../

prd/style/font-awesome-4.5.0/font/: src/style/font-awesome-4.5.0/font/*
	mkdir -p $@
	cp $^ $@

prd/locales/: src/locales/*.json
	mkdir -p $@
	cp $^ $@

prd/checker: src/checker
	mkdir -p $(dir $@)
	cp $< $@

src/deps.js: $(SRC_JS_FILES) ${PYTHON_VENV}
	${PYTHON_CMD} node_modules/google-closure-library/closure/bin/build/depswriter.py \
	    --root_with_prefix="src/components components" \
	    --root_with_prefix="src/js js" \
	    --output_file=$@

src/style/app.css: $(SRC_LESS_FILES)
	${LESSC} $(LESS_PARAMETERS) src/style/app.less $@
	${POSTCSS} $@ --use autoprefixer --replace --no-map

src/index.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    ${MAKO_LAST_VARIABLES}
	$(call buildpage,desktop,,,,$(S3_SRC_BASE_PATH))

src/mobile.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    ${MAKO_LAST_VARIABLES}
	$(call buildpage,mobile,,,,$(S3_SRC_BASE_PATH))

src/embed.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    ${MAKO_LAST_VARIABLES}
	$(call buildpage,embed,,,,$(S3_SRC_BASE_PATH))

src/TemplateCacheModule.js: src/TemplateCacheModule.mako.js \
	    ${SRC_COMPONENTS_PARTIALS_FILES} \
	    ${MAKO_CMD}
	${PYTHON_CMD} ${MAKO_CMD} \
	    --var "partials=$(shell echo "${SRC_COMPONENTS_PARTIALS_FILES}" | sed 's/^src\///' | sed 's/ src\// /g')" \
	    --var "basedir=src" $< > $@

apache/app.conf: apache/app.mako-dot-conf \
	    ${MAKO_CMD} \
	    .build-artefacts/last-apache-base-path \
	    .build-artefacts/last-apache-base-directory \
	    .build-artefacts/last-api-url \
	    .build-artefacts/last-version
	${PYTHON_CMD} ${MAKO_CMD} \
	    --var "apache_base_path=$(APACHE_BASE_PATH)" \
	    --var "apache_base_directory=$(APACHE_BASE_DIRECTORY)" \
	    --var "api_url=$(API_URL)" \
	    --var "version=$(VERSION)" $< > $@

test/karma-conf-debug.js: test/karma-conf.mako.js ${MAKO_CMD}
	${PYTHON_CMD} ${MAKO_CMD} --var "mode=debug" $< > $@

test/karma-conf-release.js: test/karma-conf.mako.js ${MAKO_CMD}
	${PYTHON_CMD} ${MAKO_CMD} --var "mode=release" $< > $@

test/lib/angular-mocks.js test/lib/expect.js test/lib/sinon.js externs/angular.js externs/jquery.js: package.json
	npm install;
	cp -f node_modules/angular-mocks/angular-mocks.js test/lib/;
	cp -f node_modules/expect.js/index.js test/lib/expect.js;
	cp -f node_modules/sinon/pkg/sinon.js test/lib/;
	cp -f node_modules/google-closure-compiler/contrib/externs/angular-1.4.js externs/angular.js;
	cp -f node_modules/google-closure-compiler/contrib/externs/jquery-1.9.js externs/jquery.js;

.build-artefacts/devlibs: test/lib/angular-mocks.js test/lib/expect.js test/lib/sinon.js externs/angular.js externs/jquery.js
	mkdir -p $(dir $@)
	touch $@

.PHONY: libs
libs:
	npm install;
	cp -f $(addprefix node_modules/angular/, angular.js angular.min.js) src/lib/;
	cp -f $(addprefix node_modules/angular-translate/dist/, angular-translate.js angular-translate.min.js) src/lib/;
	cp -f $(addprefix node_modules/angular-translate/dist/angular-translate-loader-static-files/, angular-translate-loader-static-files.js angular-translate-loader-static-files.min.js) src/lib/;
	cp -f $(addprefix node_modules/localforage/dist/, localforage.js localforage.min.js) src/lib/;
	cp -f $(addprefix node_modules/jquery/dist/, jquery.js jquery.min.js) src/lib/;
	cp -f $(addprefix node_modules/jquery-ajax-transport-xdomainrequest/, jQuery.XDomainRequest.js  jquery.xdomainrequest.min.js) src/lib/;
	cp -f $(addprefix node_modules/d3/dist/, d3.js d3.min.js) src/lib/;
	cp -f $(addprefix node_modules/bootstrap/dist/js/, bootstrap.js bootstrap.min.js) src/lib/;
	cp -f $(addprefix node_modules/gyronorm/dist/, gyronorm.complete.js gyronorm.complete.min.js) src/lib/;
	cp -f $(addprefix node_modules/corejs-typeahead/dist/, typeahead.jquery.js typeahead.jquery.min.js) src/lib/;
	cp -f node_modules/slipjs/slip.js src/lib;
	cp -f node_modules/fastclick/lib/fastclick.js src/lib/;
	$(call applypatches)
	$(call compilejs,fastclick)
	$(call compilejs,slip)

.build-artefacts/app.js: .build-artefacts/js-files
	mkdir -p $(dir $@)
	java -jar ${CLOSURE_COMPILER} $(SRC_JS_FILES_FOR_COMPILER) \
	    --compilation_level SIMPLE_OPTIMIZATIONS \
	    --jscomp_error checkVars \
	    --externs externs/ol.js \
	    --externs externs/olcesium.js \
	    --externs externs/Cesium.externs.js \
	    --externs externs/slip.js \
	    --externs externs/angular.js \
	    --externs externs/jquery.js \
	    --js_output_file $@

$(addprefix .build-artefacts/annotated/, $(SRC_JS_FILES) src/TemplateCacheModule.js): \
	    .build-artefacts/annotated/%.js: %.js .build-artefacts/devlibs
	mkdir -p $(dir $@)
	${NG_ANNOTATE} -a $< > $@

.build-artefacts/app-whitespace.js: .build-artefacts/js-files
	java -jar ${CLOSURE_COMPILER} $(SRC_JS_FILES_FOR_COMPILER) \
	    --compilation_level WHITESPACE_ONLY \
	    --formatting PRETTY_PRINT \
	    --js_output_file $@

# closurebuilder.py complains if it cannot find a Closure base.js script, so we
# add lib/closure as a root. When compiling we remove base.js from the js files
# passed to the Closure compiler.
.build-artefacts/js-files: $(addprefix .build-artefacts/annotated/, $(SRC_JS_FILES) src/TemplateCacheModule.js) \
	    ${PYTHON_VENV} \
	    node_modules/google-closure-library
	${PYTHON_CMD} node_modules/google-closure-library/closure/bin/build/closurebuilder.py \
	    --root=.build-artefacts/annotated \
	    --root=node_modules/google-closure-library \
	    --namespace="geoadmin" \
	    --namespace="__ga_template_cache__" \
	    --output_mode=list > $@

.build-artefacts/requirements.timestamp: .build-artefacts/last-pypi-url ${PYTHON_VENV} requirements.txt
	${PIP_CMD} install --index-url ${PYPI_URL} -r requirements.txt
	@if [ ! -e ${PYTHON_VENV}/local ]; then \
	  ln -s . ${PYTHON_VENV}/local; \
	fi
	cp scripts/cmd.py ${PYTHON_VENV}/local/lib/python2.7/site-packages/mako/cmd.py
	touch $@

${PYTHON_VENV}: .build-artefacts/last-pypi-url
	mkdir -p .build-artefacts
	virtualenv --no-site-packages $@
	${PIP_CMD} install --index-url ${PYPI_URL} -U pip setuptools

.build-artefacts/last-version::
	$(call cachelastvariable,$@,$(VERSION),$(LAST_VERSION),version)

.build-artefacts/last-api-url::
	$(call cachelastvariable,$@,$(API_URL),$(LAST_API_URL),api-url)

.build-artefacts/last-alti-url::
	$(call cachelastvariable,$@,$(ALTI_URL),$(LAST_ALTI_URL),alti-url)
.build-artefacts/last-shop-url::
	$(call cachelastvariable,$@,$(SHOP_URL),$(LAST_SHOP_URL),shop-url)

.build-artefacts/last-wms-url::
	$(call cachelastvariable,$@,$(WMS_URL),$(LAST_WMS_URL),wms-url)

.build-artefacts/last-public-url::
	$(call cachelastvariable,$@,$(PUBLIC_URL),$(LAST_PUBLIC_URL),public-url)

.build-artefacts/last-print-url::
	$(call cachelastvariable,$@,$(PRINT_URL),$(LAST_PRINT_URL),print-url)

.build-artefacts/last-proxy-url::
	$(call cachelastvariable,$@,$(PROXY_URL),$(LAST_PROXY_URL),proxy-url)

.build-artefacts/last-apache-base-path::
	$(call cachelastvariable,$@,$(APACHE_BASE_PATH),$(LAST_APACHE_BASE_PATH),apache-base-path)

.build-artefacts/last-deploy-target::
	$(call cachelastvariable,$@,$(DEPLOY_TARGET),$(LAST_DEPLOY_TARGET),deploy-target)

.build-artefacts/last-apache-base-directory::
	$(call cachelastvariable,$@,$(APACHE_BASE_DIRECTORY),$(LAST_APACHE_BASE_DIRECTORY),apache-base-directory)

.build-artefacts/last-wms-url::
	$(call cachelastvariable,$@,$(WMS_URL),$(LAST_WMS_URL),wms-url)

.build-artefacts/last-wmts-url::
	$(call cachelastvariable,$@,$(WMTS_URL),$(LAST_WMTS_URL),wmts-url)

.build-artefacts/last-terrain-url::
	$(call cachelastvariable,$@,$(TERRAIN_URL),$(LAST_TERRAIN_URL),terrain-url)

.build-artefacts/last-vectortiles-url::
	$(call cachelastvariable,$@,$(VECTORTILES_URL),$(LAST_VECTORTILES_URL),vectortiles-url)

.build-artefacts/last-pypi-url::
	$(call cachelastvariable,$@,$(PYPI_URL),$(LAST_PYPI_URL),pypi-url)


.build-artefacts/cesium:
	git clone https://github.com/AnalyticalGraphicsInc/cesium.git $@

.build-artefacts/openlayers:
	git clone https://github.com/gberaudo/openlayers.git $@

.build-artefacts/olcesium:
	git clone https://github.com/openlayers/ol-cesium.git $@


# No npm module
.build-artefacts/filesaver:
	git clone https://github.com/eligrey/FileSaver.js.git $@

# No npm module for version 3
# datepicker needs custom build of moment js with specific locales
# don't use version 4 the uncompresssed file is twice bigger
.build-artefacts/datepicker:
	git clone https://github.com/Eonasdan/bootstrap-datetimepicker.git $@ && \
	    cd $@ && git checkout 3.1.4

# No npm module
# We use the service to get only the minimal polyfill file for ie9
.build-artefacts/polyfill:
	mkdir -p $@
	curl -q -o $@/polyfill.js 'https://cdn.polyfill.io/v2/polyfill.js?features=URL,Array.isArray,requestAnimationFrame,Element.prototype.classList&flags=always,gated&unknown=polyfill'
	curl -q -o $@/polyfill.min.js 'https://cdn.polyfill.io/v2/polyfill.min.js?features=URL,Array.isArray,requestAnimationFrame,Element.prototype.classList&flags=always,gated&unknown=polyfill'

.PHONY: cleanall
cleanall: clean
	rm -rf node_modules
	rm -rf .build-artefacts
	rm -rf ${CLONEDIR}

.PHONY: clean
clean:
	rm -f .build-artefacts/app.js
	rm -f .build-artefacts/js-files
	rm -rf .build-artefacts/annotated
	rm -f externs/angular.js
	rm -f externs/jquery.js
	rm -f test/lib/*.js
	rm -f src/deps.js
	rm -f src/style/app.css
	rm -f src/TemplateCacheModule.js
	rm -f src/index.html
	rm -f src/mobile.html
	rm -f src/embed.html
	rm -rf prd
