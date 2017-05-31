SHELL = /bin/bash

# Auto initialization of submodules
INIT := ${shell git submodule update --init}

NGEO_MODULES := src/ngeo/src/modules/import
SRC_JS_FILES := $(shell find src/components src/js -type f -name '*.js')
SRC_ES6_FILES := $(shell find ${NGEO_MODULES} -type f -name '*.js')
SRC_JS_FILES_FOR_COMPILER = $(shell sed -e ':a' -e 'N' -e '$$!ba' -e 's/\n/ --js /g' .build-artefacts/js-files | sed 's/^.*base\.js //')
SRC_LESS_FILES := $(shell find src -type f -name '*.less')
SRC_COMPONENTS_PARTIALS_FILES := $(shell find src/components ${NGEO_MODULES} -type f -path '*/partials/*' -name '*.html')
PYTHON_FILES := $(shell find scripts test/saucelabs -type f -name "*.py" -print)
APACHE_BASE_DIRECTORY ?= $(CURDIR)
LAST_APACHE_BASE_DIRECTORY := $(shell if [ -f .build-artefacts/last-apache-base-directory ]; then cat .build-artefacts/last-apache-base-directory 2> /dev/null; else echo '-none-'; fi)
APACHE_BASE_PATH ?= /$(shell id -un)
LAST_APACHE_BASE_PATH := $(shell if [ -f .build-artefacts/last-apache-base-path ]; then cat .build-artefacts/last-apache-base-path 2> /dev/null; else echo '-none-'; fi)

VARNISH_HOSTS ?= (ip-10-220-4-250.eu-west-1.compute.internal)
TECH_SUFFIX = .bgdi.ch
API_URL ?= //api3.geo.admin.ch
API_TECH_URL ?= //mf-chsdi3.
LAST_API_URL := $(shell if [ -f .build-artefacts/last-api-url ]; then cat .build-artefacts/last-api-url 2> /dev/null; else echo '-none-'; fi)
MAPPROXY_URL ?= //wmts{s}.geo.admin.ch
MAPPROXY_TECH_URL ?= //wmts{s}.
LAST_MAPPROXY_URL := $(shell if [ -f .build-artefacts/last-mapproxy-url ]; then cat .build-artefacts/last-mapproxy-url 2> /dev/null; else echo '-none-'; fi)
VECTORTILES_URL ?= //vectortiles{s}.geo.admin.ch
VECTORTILES_TECH_URL ?= //vectortiles{s}.
LAST_VECTORTILES_URL := $(shell if [ -f .build-artefacts/last-vectortiles-url ]; then cat .build-artefacts/last-vectortiles-url 2> /dev/null; else echo '-none-'; fi)
WMS_URL ?= //wms.geo.admin.ch
WMS_TECH_URL ?= //wms-bgdi.
LAST_WMS_URL := $(shell if [ -f .build-artefacts/last-wms-url ]; then cat .build-artefacts/last-wms-url 2> /dev/null; else echo '-none-'; fi)
SHOP_URL ?= //shop.swisstopo.admin.ch
SHOP_TECH_URL ?= //shop-bgdi.
LAST_SHOP_URL := $(shell if [ -f .build-artefacts/last-shop-url ]; then cat .build-artefacts/last-shop-url 2> /dev/null; else echo '-none-'; fi)
PUBLIC_URL ?= //public.geo.admin.ch
PUBLIC_TECH_URL ?= //public.
LAST_PUBLIC_URL := $(shell if [ -f .build-artefacts/last-public-url ];  then cat .build-artefacts/last-public-url 2> /dev/null; else echo '-none-'; fi)
PRINT_URL ?= //print.geo.admin.ch
PRINT_TECH_URL ?= //service-print.
LAST_PRINT_URL := $(shell if [ -f .build-artefacts/last-print-url ]; then cat .build-artefacts/last-print-url 2> /dev/null; else echo '-none-'; fi)
PROXY_URL ?= //service-proxy.prod.bgdi.ch
LAST_PROXY_URL ?= $(shell if [ -f .build-artefacts/last-proxy-ulr ]; then cat .build-artefacts/last-proxy-url 2> /dev/null; else echo '-none-'; fi)

PUBLIC_URL_REGEXP ?= ^https?:\/\/public\..*\.(bgdi|admin)\.ch\/.*
ADMIN_URL_REGEXP ?= ^(ftp|http|https):\/\/(.*(\.bgdi|\.geo\.admin)\.ch)
E2E_TARGETURL ?= https://mf-geoadmin3.dev.bgdi.ch

DEPLOY_TARGET ?= dev
LESS_PARAMETERS ?= -ru
KEEP_VERSION ?= 'false'
LAST_VERSION := $(shell if [ -f .build-artefacts/last-version ]; then cat .build-artefacts/last-version 2> /dev/null; else echo '-none-'; fi)
VERSION := $(shell if [ '$(KEEP_VERSION)' = 'true' ] && [ '$(LAST_VERSION)' != '-none-' ]; then echo '$(LAST_VERSION)'; else date '+%y%m%d%H%M'; fi)
GIT_BRANCH := $(shell if [ -f .build-artefacts/deployed-git-branch ]; then cat .build-artefacts/deployed-git-branch 2> /dev/null; else git rev-parse --symbolic-full-name --abbrev-ref HEAD; fi)
GIT_LAST_BRANCH := $(shell if [ -f .build-artefacts/last-git-branch ]; then cat .build-artefacts/last-git-branch 2> /dev/null; else echo 'dummy'; fi)
BRANCH_TO_DELETE ?=
DEPLOY_ROOT_DIR := /var/www/vhosts/mf-geoadmin3/private/branch
OL_VERSION ?= v4.1.1 # v4.1.1, May 3 2017
OL_CESIUM_VERSION ?= v1.27 # # v1.27, May 4 2017
CESIUM_VERSION ?= 345868b103ffea4c131cd17346b5bbc972638e25 # camptocamp/c2c_patches_vector_tiles_labels, May 16 2017
NGEO_VERSION ?= 4e55c05987850dae44305c5373e87002ea97d6aa # master, May 18 2017
DEFAULT_TOPIC_ID ?= ech
TRANSLATION_FALLBACK_CODE ?= de
LANGUAGES ?= '[\"de\", \"fr\", \"it\", \"en\", \"rm\"]'
LANGS ?= de fr it rm en
HTMLFILES ?= index mobile embed
TRANSLATE_GSPREAD_KEYS ?= 1F3R46w4PODfsbJq7jd79sapy3B7TXhQcYM7SEaccOA0
TRANSLATE_CSV_FILES ?= "https://docs.google.com/spreadsheets/d/1F3R46w4PODfsbJq7jd79sapy3B7TXhQcYM7SEaccOA0/export?format=csv&gid=0"
TRANSLATE_EMPTY_JSON ?= src/locales/empty.json
TRANSLATE_OUTPUT ?= src/locales
DEFAULT_EXTENT ?= '[420000, 30000, 900000, 350000]'
DEFAULT_RESOLUTION ?= 500.0
DEFAULT_LEVEL_OF_DETAIL ?= 7 #level of detail for the default resolution
RESOLUTIONS ?= '[650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.0, 0.5, 0.25, 0.1]'
LEVEL_OF_DETAILS ?= '[6, 7, 8, 9, 10, 11, 12, 13, 14, 14, 16, 17, 18, 18]' #lods corresponding to resolutions
DEFAULT_EPSG ?= EPSG:21781
DEFAULT_EPSG_EXTEND ?= '[420000, 30000, 900000, 350000]'
DEFAULT_ELEVATION_MODEL ?= COMB
DEFAULT_TERRAIN ?= ch.swisstopo.terrain.3d
SAUCELABS_TESTS ?=
USER_SOURCE ?= rc_user
USER_NAME ?= $(shell id -un)
GIT_COMMIT_HASH ?= $(shell git rev-parse --verify HEAD)
GIT_COMMIT_DATE ?= $(shell git log -1  --date=iso --pretty=format:%cd)
CURRENT_DATE ?= $(shell date -u +"%Y-%m-%d %H:%M:%S %z")
DEPLOY_GIT_BRANCH ?= $(shell git rev-parse --symbolic-full-name --abbrev-ref HEAD)
S3_VERSION_PATH ?=
S3_MF_GEOADMIN3_INFRA = mf-geoadmin3-infra-dublin
S3_BASE_PATH ?=
S3_SRC_BASE_PATH ?=
CLONEDIR = /home/$(USER_NAME)/tmp/branches/${DEPLOY_GIT_BRANCH}
DEEP_CLEAN ?= "false"
NAMED_BRANCH ?= "true"

## Python interpreter can't have space in path name
## So prepend all python scripts with python cmd
## See: https://bugs.launchpad.net/virtualenv/+bug/241581/comments/11
PYTHON_VENV=.build-artefacts/python-venv
PYTHON_CMD=${PYTHON_VENV}/bin/python
PIP_CMD=${PYTHON_VENV}/bin/pip
MAKO_CMD=${PYTHON_VENV}/bin/mako-render
HTMLMIN_CMD=${PYTHON_VENV}/bin/htmlmin
GJSLINT_CMD=${PYTHON_VENV}/bin/gjslint
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

.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo
	@echo "Possible targets:"
	@echo
	@echo "- user               Build the app with user specific configuration"
	@echo "- all                Build the app with current environment"
	@echo "- release            Build app for release (/prd)"
	@echo "- debug              Build app for debug (/src)"
	@echo "- lint               Run the linter"
	@echo "- lintpy             Run the linter for the python files"
	@echo "- autolintpy         Run the auto-corrector for python files"
	@echo "- testdebug          Run the JavaScript tests in debug mode"
	@echo "- testrelease        Run the JavaScript tests in release mode"
	@echo "- teste2e            Run saucelabs tests"
	@echo "- saucelabssingle    Run saucelabs tests but only with single platform/browser"
	@echo "- apache             Configure Apache (restart required)"
	@echo "- fixrights          Fix rights in common folder"
	@echo "- clean              Remove generated files"
	@echo "- cleanall           Remove all the build artefacts"
	@echo "- deploydev          Deploys current github master to dev. Specify SNAPSHOT=true to create snapshot as well."
	@echo "- s3deploybranch     Build a branch and deploy it to S3 int. Defaults to the current branch name."
	@echo "- s3deployint        Deploys a snapshot specified with SNAPSHOT=xxx to s3 int."
	@echo "- s3deployprod       Deploys a snapshot specified with SNAPSHOT=xxx to s3 prod."
	@echo "- s3activateint      Activate a version at the root of a remote bucket. (usage only: make s3activateint S3_VERSION_PATH=<branch>/<sha>/<version>)"
	@echo "- s3activateprod     Activate a version at the root of a remote bucket. (usage only: make s3activateprod S3_VERSION_PATH=<branch>/<sha>/<version>)"
	@echo "- s3listint          List availables branches, revision and build on int bucket."
	@echo "- s3listprod         List availables branches, revision and build on prod bucket."
	@echo "- s3infoint          Get version info on remote int bucket. (usage only: make s3infoint S3_VERSION_PATH=<branch>/<sha>/<version>)"
	@echo "- s3infoprod         Get version info on remote prod bucket. (usage only: make s3infoprod S3_VERSION_PATH=<branch>/<sha>/<version>)"
	@echo "- s3deleteint        Delete a project version in a remote int bucket. (usage: make s3deleteint S3_VERSION_PATH=<branch> or <branch>/<sha>/<version>)"
	@echo "- s3deleteprod       Delete a project version in a remote prod bucket. (usage: make s3deleteprod S3_VERSION_PATH=<branch> or <branch>/<sha>/<version>)"
	@echo "- olcesium           Update olcesium.js, olcesium-debug.js, Cesium.min.js and Cesium folder"
	@echo "- ngeo               Update ngeo submodule with the version specified in Makefile"
	@echo "- libs               Update js librairies used in index.html, see npm packages defined in section 'dependencies' of package.json"
	@echo "- translate          Generate the translation files (requires db user pwd in ~/.pgpass: dbServer:dbPort:*:dbUser:dbUserPwd)"
	@echo "- help               Display this help"
	@echo
	@echo "Variables:"
	@echo
	@echo "- API_URL Service URL         (build with: $(LAST_API_URL), current value: $(API_URL))"
	@echo "- PRINT_URL Print service URL (build with: $(LAST_PRINT_URL), current value: $(PRINT_URL))"
	@echo "- MAPPROXY_URL Service URL    (build with: $(LAST_MAPPROXY_URL), current value: $(MAPPROXY_URL))"
	@echo "- VECTORTILES_URL Service URL (build with: $(LAST_VECTORTILES_URL), current value: $(VECTORTILES_URL))"
	@echo "- SHOP_URL Service URL        (build with: $(LAST_SHOP_URL), current value: $(SHOP_URL))"
	@echo "- WMS_URL Service URL         (build with  $(LAST_WMS_URL), current value: $(WMS_URL))"
	@echo "- APACHE_BASE_PATH Base path  (build with: $(LAST_APACHE_BASE_PATH), current value: $(APACHE_BASE_PATH))"
	@echo "- APACHE_BASE_DIRECTORY       (build with: $(LAST_APACHE_BASE_DIRECTORY), current value: $(APACHE_BASE_DIRECTORY))"
	@echo "- SNAPSHOT                    (current value: $(SNAPSHOT))"
	@echo "- GIT_BRANCH                  (current value: $(GIT_BRANCH))"
	@echo "- GIT_COMMIT_HASH             (current value: $(GIT_COMMIT_HASH))"
	@echo "- VERSION                     (build with: $(LAST_VERSION), current value: $(VERSION))"
	@echo "- S3_MF_GEOADMIN3_INT         (current value: $(S3_MF_GEOADMIN3_INT))"
	@echo "- S3_MF_GEOADMIN3_PROD        (current value: $(S3_MF_GEOADMIN3_PROD))"

	@echo

.PHONY: user
user:
	source $(USER_SOURCE) && make all

.PHONY: all
all: lint debug release apache testdebug testrelease fixrights

.PHONY: release
release: .build-artefacts/devlibs \
	prd/lib/ \
	prd/lib/build.js \
	prd/style/app.css \
	prd/geoadmin.appcache \
	prd/index.html \
	prd/mobile.html \
	prd/embed.html \
	prd/img/ \
	prd/style/font-awesome-4.5.0/font/ \
	prd/locales/ \
	prd/checker \
	prd/cache/ \
	prd/info.json \
	prd/robots.txt \
	prd/robots_prod.txt

.PHONY: debug
debug: .build-artefacts/devlibs src/deps.js src/style/app.css src/index.html src/mobile.html src/embed.html

.PHONY: lint
lint: .build-artefacts/devlibs .build-artefacts/lint.timestamp

.PHONY: lintpy
lintpy: ${FLAKE8_CMD}
	${FLAKE8_CMD} --max-line-length=110 $(PYTHON_FILES)

.PHONY: autolintpy
autolintpy: ${AUTOPEP8_CMD}
	${AUTOPEP8_CMD} --in-place --aggressive --aggressive --verbose --max-line-lengt=110 $(PYTHON_FILES)

.PHONY: testdebug
testdebug: .build-artefacts/app-whitespace.js test/karma-conf-debug.js
	PHANTOMJS_BIN="${PHANTOMJS}" ${KARMA} start test/karma-conf-debug.js --single-run;
	cat .build-artefacts/coverage.txt; echo;

.PHONY: testrelease
testrelease: prd/lib/build.js test/karma-conf-release.js .build-artefacts/devlibs
	PHANTOMJS_BIN="${PHANTOMJS}" ${KARMA} start test/karma-conf-release.js --single-run

.PHONY: teste2e
teste2e: saucelabs

.PHONY: saucelabs
saucelabs: guard-SAUCELABS_USER guard-SAUCELABS_KEY .build-artefacts/requirements.timestamp lintpy
	${PYTHON_CMD} test/saucelabs/test.py ${E2E_TARGETURL} ${SAUCELABS_TESTS}

.PHONY: saucelabssingle
saucelabssingle: guard-SAUCELABS_USER guard-SAUCELABS_KEY .build-artefacts/requirements.timestamp lintpy
	${PYTHON_CMD} test/saucelabs/test.py ${E2E_TARGETURL} all true

.PHONY: apache
apache: apache/app.conf

.PHONY: deploydev
deploydev:
	@ if test "$(SNAPSHOT)" = "true"; then \
		./scripts/deploydev.sh -s; \
	else \
		./scripts/deploydev.sh; \
	fi

.PHONY: s3deployinfra
s3deployinfra: guard-SNAPSHOT guard-S3_MF_GEOADMIN3_INFRA .build-artefacts/requirements.timestamp
	./scripts/deploysnapshot.sh $(SNAPSHOT) infra;

.PHONY: s3deployint
s3deployint: guard-SNAPSHOT guard-S3_MF_GEOADMIN3_INT .build-artefacts/requirements.timestamp
	./scripts/deploysnapshot.sh $(SNAPSHOT) int;

.PHONY: s3deployprod
s3deployprod: guard-SNAPSHOT guard-S3_MF_GEOADMIN3_PROD .build-artefacts/requirements.timestamp
	./scripts/deploysnapshot.sh $(SNAPSHOT) prod;

.PHONY: s3deploybranch
s3deploybranch: guard-S3_MF_GEOADMIN3_INT \
	              guard-CLONEDIR \
	              guard-DEPLOY_GIT_BRANCH \
	              guard-DEEP_CLEAN \
	              guard-NAMED_BRANCH \
	              .build-artefacts/requirements.timestamp
	./scripts/clonebuild.sh ${CLONEDIR} int ${DEPLOY_GIT_BRANCH} ${DEEP_CLEAN} ${NAMED_BRANCH};
	${PYTHON_CMD} ./scripts/s3manage.py upload ${CLONEDIR}/mf-geoadmin3 int ${NAMED_BRANCH};

.PHONY: s3deploybranchinfra
s3deploybranchinfra: guard-S3_MF_GEOADMIN3_INFRA \
	              guard-CLONEDIR \
	              guard-DEPLOY_GIT_BRANCH \
	              guard-DEEP_CLEAN \
	              guard-NAMED_BRANCH \
	              .build-artefacts/requirements.timestamp
	./scripts/clonebuild.sh ${CLONEDIR} infra ${DEPLOY_GIT_BRANCH} ${DEEP_CLEAN} ${NAMED_BRANCH};
	${PYTHON_CMD} ./scripts/s3manage.py upload ${CLONEDIR}/mf-geoadmin3 infra ${NAMED_BRANCH};


.PHONY: s3listinfra
s3listinfra: guard-S3_MF_GEOADMIN3_INFRA .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py list infra;

.PHONY: s3listint
s3listint: guard-S3_MF_GEOADMIN3_INT .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py list int;

.PHONY: s3listprod
s3listprod: guard-S3_MF_GEOADMIN3_PROD .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py list prod;

.PHONY: s3infoinfra
s3infoinfra: guard-S3_VERSION_PATH guard-S3_MF_GEOADMIN3_INFRA .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py info ${S3_VERSION_PATH} infra;

.PHONY: s3infoint
s3infoint: guard-S3_VERSION_PATH guard-S3_MF_GEOADMIN3_INT .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py info ${S3_VERSION_PATH} int;

.PHONY: s3infoprod
s3infoprod: guard-S3_VERSION_PATH guard-S3_MF_GEOADMIN3_PROD .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py info ${S3_VERSION_PATH} prod;

.PHONY: s3activateinfra
s3activateinfra: guard-S3_VERSION_PATH guard-S3_MF_GEOADMIN3_INFRA .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py activate ${S3_VERSION_PATH} infra;

.PHONY: s3activateint
s3activateint: guard-S3_VERSION_PATH guard-S3_MF_GEOADMIN3_INT .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py activate ${S3_VERSION_PATH} int;

.PHONY: s3activateprod
s3activateprod: guard-S3_VERSION_PATH guard-S3_MF_GEOADMIN3_PROD .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py activate ${S3_VERSION_PATH} prod;

.PHONY: s3deleteinfra
s3deleteinfra: guard-S3_VERSION_PATH guard-S3_MF_GEOADMIN3_INFRA .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py delete ${S3_VERSION_PATH} infra;

.PHONY: s3deleteint
s3deleteint: guard-S3_VERSION_PATH guard-S3_MF_GEOADMIN3_INT .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py delete ${S3_VERSION_PATH} int;

.PHONY: s3deleteprod
s3deleteprod: guard-S3_VERSION_PATH guard-S3_MF_GEOADMIN3_PROD .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py delete ${S3_VERSION_PATH} prod;

.PHONY: olcesium
olcesium: .build-artefacts/ol-cesium
	cd .build-artefacts/ol-cesium; \
	git reset HEAD --hard; \
	git fetch --all; \
	git checkout $(OL_CESIUM_VERSION); \
	git show; \
	git submodule update --recursive --init --force; \
	cd ol; \
	git reset HEAD --hard; \
	git fetch --all; \
	git checkout $(OL_VERSION); \
	git show; \
	cat ../../../scripts/ga-ol-reproj.exports >> src/ol/reproj/reproj.js; \
	cat ../../../scripts/ga-ol-style.exports >> src/ol/style/style.js; \
	cat ../../../scripts/ga-ol-tilegrid.exports >> src/ol/tilegrid/tilegrid.js; \
	cat ../../../scripts/ga-ol-tilerange.exports >> src/ol/tilerange.js; \
	cat ../../../scripts/ga-ol-view.exports >> src/ol/view.js; \
	npm install --only prod; \
	node tasks/build-ext.js; \
	cd ../cesium; \
	git remote | grep c2c || git remote add c2c git://github.com/camptocamp/cesium; \
	git fetch --all; \
	git checkout $(CESIUM_VERSION); \
	git show; \
	cd ..; \
	ln -T -f -s ../../../../ol-cesium-plugin/ src/plugins/geoadmin; \
	( cd cesium; [ -f node_modules/.bin/gulp ] || npm install ); \
	( cd cesium; if [ -f "Build/Cesium/Cesium.js" ] ; then echo 'Skipping Cesium minified build'; else node_modules/.bin/gulp minifyRelease; fi ); \
	( cd cesium; if [ -f "Build/CesiumUnminified/Cesium.js" ] ; then echo 'Skipping Cesium debug build'; else node_modules/.bin/gulp generateStubs combine; fi ); \
	npm install; \
	node build/generate-exports.js dist/exports.js; \
	node build/build.js ../../scripts/olcesium-debug-geoadmin.json dist/olcesium-debug.js; \
	node build/build.js ../../scripts/olcesium-geoadmin.json dist/olcesium.js; \
	cp dist/olcesium-debug.js ../../src/lib/; \
	cp dist/olcesium.js ../../src/lib/olcesium.js; \
	rm -rf ../../src/lib/Cesium; \
	cp -r cesium/Build/CesiumUnminified ../../src/lib/Cesium; \
	cp cesium/Build/Cesium/Cesium.js ../../src/lib/Cesium.min.js; \
	cp Cesium.externs.js ../../externs/Cesium.externs.js;

.PHONY: ngeo
ngeo:
	cd src/ngeo; \
	git fetch origin; \
	git checkout ${NGEO_VERSION}; \
	git show

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
	chgrp -f -R geodata . || :
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
	    src/lib/Cesium \
	    src/lib/Cesium.min.js \
	    src/lib/olcesium.js
	mkdir -p $@
	cp -rf  $^ $@

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
		--var "git_branch=$(GIT_BRANCH)" \
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
		--var "print_url=$(PRINT_URL)" \
		--var "print_tech_url=$(PRINT_TECH_URL)" \
		--var "proxy_url=$(PROXY_URL)" \
		--var "mapproxy_url=$(MAPPROXY_URL)" \
		--var "mapproxy_tech_url=$(MAPPROXY_TECH_URL)" \
		--var "vectortiles_url=$(VECTORTILES_URL)" \
		--var "vectortiles_tech_url=$(VECTORTILES_TECH_URL)" \
		--var "public_url=$(PUBLIC_URL)" \
		--var "public_tech_url=$(PUBLIC_TECH_URL)" \
		--var "shop_url=$(SHOP_URL)" \
		--var "shop_tech_url=$(SHOP_TECH_URL)" \
		--var "wms_url=$(WMS_URL)" \
		--var "wms_tech_url=$(WMS_TECH_URL)" \
		--var "default_topic_id=$(DEFAULT_TOPIC_ID)" \
		--var "translation_fallback_code=$(TRANSLATION_FALLBACK_CODE)" \
		--var "languages=$(LANGUAGES)" \
		--var "default_extent"="$(DEFAULT_EXTENT)" \
		--var "default_resolution"="$(DEFAULT_RESOLUTION)" \
		--var "default_level_of_detail"="$(DEFAULT_LEVEL_OF_DETAIL)" \
		--var "resolutions"="$(RESOLUTIONS)" \
		--var "level_of_details"="$(LEVEL_OF_DETAILS)" \
		--var "public_url=$(PUBLIC_URL)" \
		--var "default_elevation_model=${DEFAULT_ELEVATION_MODEL}" \
		--var "default_terrain=$(DEFAULT_TERRAIN)" \
		--var "admin_url_regexp=$(ADMIN_URL_REGEXP)" \
		--var "public_url_regexp=$(PUBLIC_URL_REGEXP)" \
		--var "default_epsg"="$(DEFAULT_EPSG)" \
		--var "default_epsg_extend"="$(DEFAULT_EPSG_EXTEND)" \
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

prd/index.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    ${HTMLMIN_CMD} \
	    .build-artefacts/last-api-url \
	    .build-artefacts/last-mapproxy-url \
	    .build-artefacts/last-vectortiles-url \
	    .build-artefacts/last-shop-url \
	    .build-artefacts/last-wms-url \
	    .build-artefacts/last-public-url \
	    .build-artefacts/last-print-url \
	    .build-artefacts/last-proxy-url \
	    .build-artefacts/last-apache-base-path \
	    .build-artefacts/last-version
	mkdir -p $(dir $@)
	$(call buildpage,desktop,prod,$(VERSION),$(VERSION)/,$(S3_BASE_PATH))
	${PYTHON_CMD} ${HTMLMIN_CMD} --remove-comments --keep-optional-attribute-quotes $@ $@

prd/mobile.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    ${HTMLMIN_CMD} \
	    .build-artefacts/last-api-url \
	    .build-artefacts/last-mapproxy-url \
	    .build-artefacts/last-vectortiles-url \
	    .build-artefacts/last-shop-url \
	    .build-artefacts/last-wms-url \
	    .build-artefacts/last-public-url \
	    .build-artefacts/last-print-url \
	    .build-artefacts/last-proxy-url \
	    .build-artefacts/last-apache-base-path \
	    .build-artefacts/last-version
	mkdir -p $(dir $@)
	$(call buildpage,mobile,prod,$(VERSION),$(VERSION)/,$(S3_BASE_PATH))
	${PYTHON_CMD} ${HTMLMIN_CMD} --remove-comments --keep-optional-attribute-quotes $@ $@

prd/embed.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    ${HTMLMIN_CMD} \
	    .build-artefacts/last-api-url \
	    .build-artefacts/last-mapproxy-url \
	    .build-artefacts/last-shop-url \
	    .build-artefacts/last-wms-url \
	    .build-artefacts/last-public-url \
	    .build-artefacts/last-print-url \
	    .build-artefacts/last-proxy-url \
	    .build-artefacts/last-apache-base-path \
	    .build-artefacts/last-version
	mkdir -p $(dir $@)
	$(call buildpage,embed,prod,$(VERSION),$(VERSION)/,$(S3_BASE_PATH))
	${PYTHON_CMD} ${HTMLMIN_CMD} --remove-comments --keep-optional-attribute-quotes $@ $@

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
	    --root_with_prefix="src/ngeo ngeo" \
	    --output_file=$@

src/style/app.css: $(SRC_LESS_FILES)
	${LESSC} $(LESS_PARAMETERS) src/style/app.less $@
	${POSTCSS} $@ --use autoprefixer --replace --no-map

src/index.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    .build-artefacts/last-api-url \
	    .build-artefacts/last-mapproxy-url \
	    .build-artefacts/last-vectortiles-url \
	    .build-artefacts/last-shop-url \
	    .build-artefacts/last-wms-url \
	    .build-artefacts/last-public-url \
	    .build-artefacts/last-print-url \
	    .build-artefacts/last-proxy-url \
	    .build-artefacts/last-apache-base-path
	$(call buildpage,desktop,,,,$(S3_SRC_BASE_PATH))

src/mobile.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    .build-artefacts/last-api-url \
	    .build-artefacts/last-mapproxy-url \
	    .build-artefacts/last-vectortiles-url \
	    .build-artefacts/last-shop-url \
	    .build-artefacts/last-wms-url \
	    .build-artefacts/last-public-url \
	    .build-artefacts/last-print-url \
	    .build-artefacts/last-proxy-url \
	    .build-artefacts/last-apache-base-path
	$(call buildpage,mobile,,,,$(S3_SRC_BASE_PATH))

src/embed.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    .build-artefacts/last-api-url \
	    .build-artefacts/last-mapproxy-url \
	    .build-artefacts/last-vectortiles-url \
	    .build-artefacts/last-shop-url \
	    .build-artefacts/last-wms-url \
	    .build-artefacts/last-public-url \
	    .build-artefacts/last-print-url \
	    .build-artefacts/last-proxy-url \
	    .build-artefacts/last-apache-base-path
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
	npm install --only dev;
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
	npm install --only prod;
	cp -f $(addprefix node_modules/angular/, angular.js angular.min.js) src/lib/;
	cp -f $(addprefix node_modules/angular-translate/dist/, angular-translate.js angular-translate.min.js) src/lib/;
	cp -f $(addprefix node_modules/angular-translate/dist/angular-translate-loader-static-files/, angular-translate-loader-static-files.js angular-translate-loader-static-files.min.js) src/lib/;
	cp -f $(addprefix node_modules/localforage/dist/, localforage.js localforage.min.js) src/lib/;
	cp -f $(addprefix node_modules/jquery/dist/, jquery.js jquery.min.js) src/lib/;
	cp -f $(addprefix node_modules/jquery-ajax-transport-xdomainrequest/, jQuery.XDomainRequest.js  jquery.xdomainrequest.min.js) src/lib/;
	cp -f $(addprefix node_modules/d3/, d3.js d3.min.js) src/lib/;
	cp -f $(addprefix node_modules/bootstrap/dist/js/, bootstrap.js bootstrap.min.js) src/lib/;
	cp -f $(addprefix node_modules/corejs-typeahead/dist/, typeahead.jquery.js typeahead.jquery.min.js) src/lib/;
	cp -f node_modules/slipjs/slip.js src/lib;
	cp -f node_modules/fastclick/lib/fastclick.js src/lib/;
	$(call applypatches)
	$(call compilejs fastclick)
	$(call compilejs slip)

.build-artefacts/app.js: .build-artefacts/js-files
	mkdir -p $(dir $@)
	java -jar ${CLOSURE_COMPILER} $(SRC_JS_FILES_FOR_COMPILER) \
	    --compilation_level SIMPLE_OPTIMIZATIONS \
	    --jscomp_error checkVars \
	    --externs externs/ol.js \
	    --externs externs/ol-cesium.js \
	    --externs externs/Cesium.externs.js \
	    --externs externs/slip.js \
	    --externs externs/angular.js \
	    --externs externs/jquery.js \
	    --js_output_file $@

$(addprefix .build-artefacts/annotated/, $(SRC_JS_FILES) src/TemplateCacheModule.js): \
	    .build-artefacts/annotated/%.js: %.js .build-artefacts/devlibs
	mkdir -p $(dir $@)
	${NG_ANNOTATE} -a $< > $@

$(addprefix .build-artefacts/annotated/, $(SRC_ES6_FILES)): \
	    .build-artefacts/annotated/%.js: %.js .build-artefacts/devlibs
	mkdir -p $(dir $@)
	${BABEL} $< --out-file tmp
	${NG_ANNOTATE} -a tmp | sed "/goog\.require('ol.*/d" > $@
	rm -f tmp

.build-artefacts/app-whitespace.js: .build-artefacts/js-files
	java -jar ${CLOSURE_COMPILER} $(SRC_JS_FILES_FOR_COMPILER) \
	    --compilation_level WHITESPACE_ONLY \
	    --formatting PRETTY_PRINT \
	    --js_output_file $@

# closurebuilder.py complains if it cannot find a Closure base.js script, so we
# add lib/closure as a root. When compiling we remove base.js from the js files
# passed to the Closure compiler.
.build-artefacts/js-files: $(addprefix .build-artefacts/annotated/, $(SRC_JS_FILES) src/TemplateCacheModule.js) \
	    $(addprefix .build-artefacts/annotated/, $(SRC_ES6_FILES)) \
	    ${PYTHON_VENV} \
	    node_modules/google-closure-library
	${PYTHON_CMD} node_modules/google-closure-library/closure/bin/build/closurebuilder.py \
	    --root=.build-artefacts/annotated \
	    --root=node_modules/google-closure-library \
	    --namespace="geoadmin" \
	    --namespace="__ga_template_cache__" \
	    --output_mode=list > $@

.build-artefacts/lint.timestamp: .build-artefacts/requirements.timestamp $(SRC_JS_FILES)
	${GJSLINT_CMD} -r src/components -r src/js
	touch $@

.build-artefacts/requirements.timestamp: ${PYTHON_VENV} requirements.txt
	${PIP_CMD} install -r requirements.txt
	@if [ ! -e ${PYTHON_VENV}/local ]; then \
	  ln -s . ${PYTHON_VENV}/local; \
	fi
	cp scripts/cmd.py ${PYTHON_VENV}/local/lib/python2.7/site-packages/mako/cmd.py
	touch $@

${PYTHON_VENV}:
	mkdir -p .build-artefacts
	virtualenv --no-site-packages $@
	${PIP_CMD} install -U pip setuptools

.build-artefacts/last-version::
	mkdir -p $(dir $@)
	test "$(VERSION)" != "$(LAST_VERSION)" && echo $(VERSION) > .build-artefacts/last-version || :

.build-artefacts/last-git-branch::
	mkdir -p $(dir $@)
	test "$(GIT_BRANCH)" != "$(GIT_LAST_BRANCH)" && echo $(GIT_BRANCH) > .build-artefacts/last-git-branch || :

.build-artefacts/last-api-url::
	mkdir -p $(dir $@)
	test "$(API_URL)" != "$(LAST_API_URL)" && echo $(API_URL) > .build-artefacts/last-api-url || :

.build-artefacts/last-mapproxy-url::
	mkdir -p $(dir $@)
	test "$(MAPPROXY_URL)" != "$(LAST_MAPPROXY_URL)" && echo $(MAPPROXY_URL) > .build-artefacts/last-mapproxy-url || :

.build-artefacts/last-vectortiles-url::
	mkdir -p $(dir $@)
	test "$(VECTORTILES_URL)" != "$(LAST_VECTORTILES_URL)" && echo $(VECTORTILES_URL) > .build-artefacts/last-vectortiles-url || :

.build-artefacts/last-shop-url::
	mkdir -p $(dir $@)
	test "$(SHOP_URL)" != "$(LAST_SHOP_URL)" && echo $(SHOP_URL) > .build-artefacts/last-shop-url || :

.build-artefacts/last-wms-url::
	mkdir -p $(dir $@)
	test "$(WMS_URL)" != "$(LAST_WMS_URL)" && echo $(WMS_URL) > .build-artefacts/last-wms-url || :

.build-artefacts/last-public-url::
	mkdir -p $(dir $@)
	test "$(PUBLIC_URL)" != "$(LAST_PUBLIC_URL)" && echo $(PUBLIC_URL) > .build-artefacts/last-public-url || :

.build-artefacts/last-print-url::
	mkdir -p $(dir $@)
	test "$(PRINT_URL)" != "$(LAST_PRINT_URL)" && echo $(PRINT_URL) > .build-artefacts/last-print-url || :

.build-artefacts/last-proxy-url::
	mkdir -p $(dir $@)
	test "$(PROXY_URL)" != "$(LAST_PROXY_URL)" && echo $(PROXY_URL) > .build-artefacts/last-proxy-url || :

.build-artefacts/last-apache-base-path::
	mkdir -p $(dir $@)
	test "$(APACHE_BASE_PATH)" != "$(LAST_APACHE_BASE_PATH)" && \
	    echo $(APACHE_BASE_PATH) > .build-artefacts/last-apache-base-path || :

.build-artefacts/last-deploy-target::
	mkdir -p $(dir $@)
	test "$(DEPLOY_TARGET)" != "$(LAST_DEPLOY_TARGET)" && \
	     echo $(DEPLOY_TARGET) > .build-artefacts/last-deploy-target || :

.build-artefacts/last-apache-base-directory::
	mkdir -p $(dir $@)
	test "$(APACHE_BASE_DIRECTORY)" != "$(LAST_APACHE_BASE_DIRECTORY)" && \
	    echo "$(APACHE_BASE_DIRECTORY)" > .build-artefacts/last-apache-base-directory || :

.build-artefacts/ol-cesium:
	git clone --recursive https://github.com/openlayers/ol-cesium.git $@

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
	curl -q -o $@/polyfill.js 'https://cdn.polyfill.io/v2/polyfill.js?features=Array.isArray,requestAnimationFrame,Element.prototype.classList&flags=always,gated&unknown=polyfill'
	curl -q -o $@/polyfill.min.js 'https://cdn.polyfill.io/v2/polyfill.min.js?features=Array.isArray,requestAnimationFrame,Element.prototype.classList&flags=always,gated&unknown=polyfill'

.PHONY: cleanall
cleanall: clean
	rm -rf node_modules
	rm -rf .build-artefacts

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
	rm -rf src/ngeo
	git submodule update --init
