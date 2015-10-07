SRC_JS_FILES := $(shell find src/components src/js -type f -name '*.js')
SRC_JS_FILES_FOR_COMPILER = $(shell sed -e ':a' -e 'N' -e '$$!ba' -e 's/\n/ --js /g' .build-artefacts/js-files | sed 's/^.*base\.js //')
SRC_COMPONENTS_LESS_FILES := $(shell find src/components -type f -name '*.less')
SRC_COMPONENTS_PARTIALS_FILES = $(shell find src/components -type f -path '*/partials/*' -name '*.html')
APACHE_BASE_DIRECTORY ?= $(CURDIR)
LAST_APACHE_BASE_DIRECTORY := $(shell if [ -f .build-artefacts/last-apache-base-directory ]; then cat .build-artefacts/last-apache-base-directory 2> /dev/null; else echo '-none-'; fi)
LAST_SAUCELABS_TARGETURL := $(shell if [ -f .build-artefacts/last-saucelabs-targeturl ]; then cat .build-artefacts/last-saucelabs-targeturl 2> /dev/null; else echo '-none-'; fi)
APACHE_BASE_PATH ?= /$(shell id -un)
LAST_APACHE_BASE_PATH := $(shell if [ -f .build-artefacts/last-apache-base-path ]; then cat .build-artefacts/last-apache-base-path 2> /dev/null; else echo '-none-'; fi)
API_URL ?= //mf-chsdi3.dev.bgdi.ch
LAST_API_URL := $(shell if [ -f .build-artefacts/last-api-url ]; then cat .build-artefacts/last-api-url 2> /dev/null; else echo '-none-'; fi)
PUBLIC_URL ?= //public.dev.bgdi.ch
PUBLIC_URL_REGEXP ?= ^https?:\/\/public\..*\.(bgdi|admin)\.ch\/.*
ADMIN_URL_REGEXP ?= ^(ftp|http|https):\/\/(.*(\.bgdi|\.geo\.admin)\.ch)
LESS_PARAMETERS ?= '-ru'
KEEP_VERSION ?= 'false'
LAST_VERSION := $(shell if [ -f .build-artefacts/last-version ]; then cat .build-artefacts/last-version 2> /dev/null; else echo '-none-'; fi)
VERSION := $(shell if [ '$(KEEP_VERSION)' = 'true' ] && [ '$(LAST_VERSION)' != '-none-' ]; then echo $(LAST_VERSION); else date '+%s'; fi)
GIT_BRANCH := $(shell git rev-parse --symbolic-full-name --abbrev-ref HEAD)
GIT_LAST_BRANCH := $(shell if [ -f .build-artefacts/last-git-branch ]; then cat .build-artefacts/last-git-branch 2> /dev/null; else echo 'dummy'; fi)
DEPLOY_ROOT_DIR := /var/www/vhosts/mf-geoadmin3/private/branch
DEPLOY_TARGET ?= 'dev'
LAST_DEPLOY_TARGET := $(shell if [ -f .build-artefacts/last-deploy-target ]; then cat .build-artefacts/last-deploy-target 2> /dev/null; else echo '-none-'; fi)
OL3_VERSION ?= dedf0a5d638ef36d1b74d13b8bf0b7223b762f7d
OL3_CESIUM_VERSION ?= f476fa967b91e3298ecaa1ba21860bddc74522da
CESIUM_VERSION ?= 9e67416d1016436b5cb237d6ec34f6c988bc5ecc
DEFAULT_TOPIC_ID ?= ech
TRANSLATION_FALLBACK_CODE ?= de
LANGUAGES ?= '[\"de\", \"en\", \"fr\", \"it\", \"rm\"]'
DEFAULT_EXTENT ?= '[420000, 30000, 900000, 350000]'
DEFAULT_RESOLUTION ?= 500.0
RESOLUTIONS ?= '[650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.0, 0.5, 0.25, 0.1]'
DEFAULT_EPSG ?= EPSG:21781
DEFAULT_EPSG_EXTEND ?= '[420000, 30000, 900000, 350000]'
DEFAULT_ELEVATION_MODEL ?= COMB
DEFAULT_TERRAIN ?= ch.swisstopo.terrain.3d

## Python interpreter can't have space in path name
## So prepend all python scripts with python cmd
## See: https://bugs.launchpad.net/virtualenv/+bug/241581/comments/11
PYTHON_CMD=.build-artefacts/python-venv/bin/python

.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo
	@echo "Possible targets:"
	@echo
	@echo "- prod             Build app for prod (/prd)"
	@echo "- dev              Build app for dev (/src)"
	@echo "- lint             Run the linter"
	@echo "- testdev          Run the JavaScript tests in dev mode"
	@echo "- testprod         Run the JavaScript tests in prod mode"
	@echo "- teste2e          Run browserstack tests"
	@echo "- testsaucelabs    Run saucelabs tests"
	@echo "- apache           Configure Apache (restart required)"
	@echo "- appcache         Update appcache file"
	@echo "- fixrights        Fix rights in common folder"
	@echo "- all              All of the above (target to run prior to creating a PR)"
	@echo "- clean            Remove generated files"
	@echo "- cleanall         Remove all the build artefacts"
	@echo "- deploydev        Deploys current github master to dev. Specify SNAPSHOT=true to create snapshot as well."
	@echo "- deployint        Deploys snapshot specified with SNAPSHOT=xxx to int."
	@echo "- deployprod       Deploys snapshot specified with SNAPSHOT=xxx to prod."
	@echo "- deploydemo       Deploys snapshot specified with SNAPSHOT=xxx to demo."
	@echo "- deploybranch     Deploys current branch to test (note: takes code from github)"
	@echo "- deploybranchint  Deploys current branch to test and int (note: takes code from github)"
	@echo "- deploybranchdemo Deploys current branch to test and demo (note: takes code from github)"
	@echo "- ol               Update ol.js and ol-debug.js "
	@echo "- translate        Generate the translation files (requires db user pwd in ~/.pgpass: dbServer:dbPort:*:dbUser:dbUserPwd)"
	@echo "- help             Display this help"
	@echo
	@echo "Variables:"
	@echo
	@echo "- DEPLOY_TARGET Deploy target (build with: $(LAST_DEPLOY_TARGET), current value: $(DEPLOY_TARGET))"
	@echo "- API_URL Service URL         (build with: $(LAST_API_URL), current value: $(API_URL))"
	@echo "- APACHE_BASE_PATH Base path  (build with: $(LAST_APACHE_BASE_PATH), current value: $(APACHE_BASE_PATH))"
	@echo "- APACHE_BASE_DIRECTORY       (build with: $(LAST_APACHE_BASE_DIRECTORY), current value: $(APACHE_BASE_DIRECTORY))"
	@echo "- SAUCELABS_TARGETURL         (build with: $(LAST_SAUCELABS_TARGETURL), current value: $(SAUCELABS_TARGETURL))"

	@echo

.PHONY: all
all: lint dev prod apache testdev testprod deploy/deploy-branch.cfg fixrights

.PHONY: prod
prod: prd/lib/ \
	prd/lib/build.js \
	prd/style/app.css \
	prd/geoadmin.appcache \
	prd/index.html \
	prd/mobile.html \
	prd/embed.html \
	prd/img/ \
	prd/style/font-awesome-3.2.1/font/ \
	prd/locales/ \
	prd/checker \
	prd/robots.txt

.PHONY: dev
dev: src/deps.js src/style/app.css src/index.html src/mobile.html src/embed.html

.PHONY: lint
lint: .build-artefacts/lint.timestamp

.PHONY: testdev
testdev: .build-artefacts/app-whitespace.js test/karma-conf-dev.js node_modules
	PHANTOMJS_BIN="node_modules/.bin/phantomjs" ./node_modules/.bin/karma start test/karma-conf-dev.js --single-run

.PHONY: testprod
testprod: prd/lib/build.js test/karma-conf-prod.js node_modules
	PHANTOMJS_BIN="node_modules/.bin/phantomjs" ./node_modules/.bin/karma start test/karma-conf-prod.js --single-run

.PHONY: teste2e
teste2e: guard-BROWSERSTACK_TARGETURL guard-BROWSERSTACK_USER guard-BROWSERSTACK_KEY
	node test/selenium/tests.js -t ${BROWSERSTACK_TARGETURL}
	${PYTHON_CMD} test/saucelabs/test.py ${SAUCELABS_TARGETURL}

.PHONY: testsaucelabs
testsaucelabs: .build-artefacts/saucelab-requirements-installation.timestamp
	${PYTHON_CMD} test/saucelabs/test.py ${SAUCELABS_TARGETURL}

.PHONY: apache
apache: apache/app.conf

.PHONY: appcache
appcache: cleanappcache prd/geoadmin.appcache prd/index.html prd/mobile.html prd/embed.html

.PHONY: deploydev
deploydev:
	@ if test "$(SNAPSHOT)" = "true"; then \
		./scripts/deploydev.sh -s; \
	else \
		./scripts/deploydev.sh; \
  fi

.PHONY: deploydemo
deploydemo: guard-SNAPSHOT
	./scripts/deploysnapshot.sh $(SNAPSHOT) demo

.PHONY: deployint
deployint: guard-SNAPSHOT
	./scripts/deploysnapshot.sh $(SNAPSHOT) int

.PHONY: deployprod
deployprod: guard-SNAPSHOT
	./scripts/deploysnapshot.sh $(SNAPSHOT) prod

.PHONY: deploybranch
deploybranch: deploy/deploy-branch.cfg $(DEPLOY_ROOT_DIR)/$(GIT_BRANCH)/.git/config
	cd $(DEPLOY_ROOT_DIR)/$(GIT_BRANCH); \
	git checkout master; \
	git branch -D $(GIT_BRANCH); \
	git pull; \
	git checkout $(GIT_BRANCH); \
	make preparebranch; \
	cp scripts/00-$(GIT_BRANCH).conf /var/www/vhosts/mf-geoadmin3/conf; \
	bash -c "source rc_branch && make cleanall all";

.PHONY: deploybranchint
deploybranchint: deploybranch
	cd $(DEPLOY_ROOT_DIR)/$(GIT_BRANCH); \
	sudo -u deploy deploy -r deploy/deploy-branch.cfg int;

.PHONY: deploybranchdemo
deploybranchdemo: deploybranch
	cd $(DEPLOY_ROOT_DIR)/$(GIT_BRANCH); \
	sudo -u deploy deploy -r deploy/deploy-branch.cfg demo;

.PHONY: preparebranch
preparebranch: rc_branch scripts/00-$(GIT_BRANCH).conf

.PHONY: ol
ol: OL_JS = ol.js ol-debug.js
ol: scripts/ol-geoadmin.json .build-artefacts/ol3
	cd .build-artefacts/ol3; \
	git reset HEAD --hard; \
	git fetch -a; \
	git checkout $(OL3_VERSION); \
	git show; \
	cat ../../scripts/ga-ol3-style.exports >> src/ol/style/style.js; \
	cat ../../scripts/ga-ol3-tilegrid.exports >> src/ol/tilegrid/tilegrid.js; \
	cat ../../scripts/ga-ol3-tilerange.exports >> src/ol/tilerange.js; \
	cat ../../scripts/ga-ol3-view.exports >> src/ol/view.js; \
	npm install; \
	node tasks/build.js config/ol-debug.json build/ol-debug.js; \
	node tasks/build.js ../../scripts/ol-geoadmin.json build/ol.js; \
	cd ../../; \
	cp $(addprefix .build-artefacts/ol3/build/,$(OL_JS)) src/lib/;

.PHONY: ol3cesium
ol3cesium: .build-artefacts/ol3-cesium
	cd .build-artefacts/ol3-cesium; \
	git reset HEAD --hard; \
	git fetch -a; \
	git checkout $(OL3_CESIUM_VERSION); \
	git submodule update --recursive --init --force; \
	cd cesium; \
	git remote | grep c2c || git remote add c2c git://github.com/camptocamp/cesium; \
	git fetch c2c; \
	git checkout $(CESIUM_VERSION); \
	cd ..; \
	git show; \
	ln -T -f -s ../../../../ol3-cesium-plugin/ src/plugins/geoadmin; \
	make dist; \
	node build/build.js ../../scripts/ol3cesium-debug-geoadmin.json dist/ol3cesium-debug.js;  \
	cp dist/ol3cesium-debug.js ../../src/lib/; \
	make cesium/Build/Cesium/Cesium.js -e CESIUM_COMPILE_TARGET=minifyRelease; \
	cp -r cesium/Build/Cesium ../../src/lib/; \
	cat ../../src/lib/Cesium/Cesium.js dist/ol3cesium.js > ../../src/lib/ol3cesium.js;

.PHONY: fastclick
fastclick: .build-artefacts/fastclick .build-artefacts/closure-compiler/compiler.jar
	cp .build-artefacts/fastclick/lib/fastclick.js src/lib/fastclick.js
	java -jar .build-artefacts/closure-compiler/compiler.jar \
	    src/lib/fastclick.js \
	    --compilation_level SIMPLE_OPTIMIZATIONS \
	    --js_output_file  src/lib/fastclick.min.js

.PHONY: typeahead
typeahead: .build-artefacts/closure-compiler/compiler.jar
	java -jar .build-artefacts/closure-compiler/compiler.jar \
	    src/lib/typeahead-0.9.3.js \
	    --compilation_level SIMPLE_OPTIMIZATIONS \
	    --js_output_file  src/lib/typeahead-0.9.3.min.js

.PHONY: filesaver
filesaver: .build-artefacts/filesaver
	cp .build-artefacts/filesaver/FileSaver.js src/lib/filesaver.js
	cp .build-artefacts/filesaver/FileSaver.min.js src/lib/filesaver.min.js

.PHONY: datepicker
datepicker: .build-artefacts/datepicker
	cp .build-artefacts/datepicker/src/js/bootstrap-datetimepicker.js src/lib/
	cp .build-artefacts/datepicker/src/less/bootstrap-datetimepicker.less src/style/
	cp .build-artefacts/datepicker/build/js/bootstrap-datetimepicker.min.js src/lib/

.PHONY: translate
translate: .build-artefacts/translate-requirements-installation.timestamp
	${PYTHON_CMD} scripts/translation2js.py src/locales/

.PHONY: fixrights
fixrights:
	chgrp -f -R geodata . || :
	chmod -f -R g+rw . || :

guard-%:
	@ if test "${${*}}" = ""; then \
	  echo "Environment variable $* not set. Add it to your command."; \
	  exit 1; \
	fi

prd/robots.txt: scripts/robots.mako-dot-txt .build-artefacts/last-deploy-target
	mkdir -p $(dir $@)
	${PYTHON_CMD} .build-artefacts/python-venv/bin/mako-render \
	    --var "deploy_target=$(DEPLOY_TARGET)" $< > $@

prd/lib/: src/lib/d3-3.3.1.min.js \
	    src/lib/bootstrap-datetimepicker.min.js  \
	    src/lib/IE9Fixes.js \
	    src/lib/jQuery.XDomainRequest.js \
	    src/lib/Cesium \
	    src/lib/ol3cesium.js
	mkdir -p $@
	cp -rf  $^ $@

prd/lib/build.js: src/lib/jquery-2.0.3.min.js \
		    src/lib/bootstrap-3.3.1.min.js \
		    src/lib/moment-with-customlocales.min.js \
		    src/lib/typeahead-0.9.3.min.js src/lib/angular.min.js \
		    src/lib/proj4js-compressed.js \
		    src/lib/EPSG21781.js \
		    src/lib/EPSG2056.js \
		    src/lib/EPSG32631.js \
		    src/lib/EPSG32632.js \
		    src/lib/ol.js \
		    src/lib/angular-translate.min.js \
		    src/lib/angular-translate-loader-static-files.min.js \
		    src/lib/fastclick.min.js \
		    src/lib/localforage.min.js \
		    src/lib/filesaver.min.js \
		    .build-artefacts/app.js
	mkdir -p $(dir $@)
	cat $^ | sed 's/^\/\/[#,@] sourceMappingURL=.*//' > $@

prd/style/app.css: src/style/app.less \
		    src/style/print.less \
		    src/style/ga_bootstrap.less \
		    src/style/ga_variables.less \
		    $(SRC_COMPONENTS_LESS_FILES) \
		    node_modules \
		    .build-artefacts/bootstrap
	mkdir -p $(dir $@)
	node_modules/.bin/lessc -ru --clean-css $< $@

prd/geoadmin.appcache: src/geoadmin.mako.appcache \
			.build-artefacts/python-venv/bin/mako-render \
			.build-artefacts/last-version
	mkdir -p $(dir $@);
	${PYTHON_CMD} .build-artefacts/python-venv/bin/mako-render \
	    --var "version=$(VERSION)" \
	    --var "deploy_target=$(DEPLOY_TARGET)" \
	    --var "apache_base_path=$(APACHE_BASE_PATH)" \
	    --var "languages=$(LANGUAGES)" \
	    --var "api_url=$(API_URL)" \
	    --var "public_url=$(PUBLIC_URL)" $< > $@

define buildpage
	${PYTHON_CMD} .build-artefacts/python-venv/bin/mako-render \
		--var "device=$1" \
		--var "mode=$2" \
		--var "version=$3" \
		--var "versionslashed=$4" \
		--var "apache_base_path=$(APACHE_BASE_PATH)" \
		--var "api_url=$(API_URL)" \
		--var "default_topic_id=$(DEFAULT_TOPIC_ID)" \
		--var "translation_fallback_code=$(TRANSLATION_FALLBACK_CODE)" \
		--var "languages=$(LANGUAGES)" \
		--var "default_extent"="$(DEFAULT_EXTENT)" \
		--var "default_resolution"="$(DEFAULT_RESOLUTION)" \
		--var "resolutions"="$(RESOLUTIONS)" \
		--var "public_url=$(PUBLIC_URL)" \
		--var "default_elevation_model=${DEFAULT_ELEVATION_MODEL}" \
		--var "default_terrain=$(DEFAULT_TERRAIN)" \
		--var "admin_url_regexp=$(ADMIN_URL_REGEXP)" \
		--var "public_url_regexp=$(PUBLIC_URL_REGEXP)" \
		--var "default_epsg"="$(DEFAULT_EPSG)" \
		--var "default_epsg_extend"="$(DEFAULT_EPSG_EXTEND)" $< > $@
endef

prd/index.html: src/index.mako.html \
	    .build-artefacts/python-venv/bin/mako-render \
	    .build-artefacts/python-venv/bin/htmlmin \
	    .build-artefacts/last-api-url \
	    .build-artefacts/last-apache-base-path \
	    .build-artefacts/last-version
	mkdir -p $(dir $@)
	$(call buildpage,desktop,prod,$(VERSION),$(VERSION)/)
	${PYTHON_CMD} .build-artefacts/python-venv/bin/htmlmin --remove-comments --keep-optional-attribute-quotes $@ $@

prd/mobile.html: src/index.mako.html \
	    .build-artefacts/python-venv/bin/mako-render \
	    .build-artefacts/python-venv/bin/htmlmin \
	    .build-artefacts/last-api-url \
	    .build-artefacts/last-apache-base-path \
	    .build-artefacts/last-version
	mkdir -p $(dir $@)
	$(call buildpage,mobile,prod,$(VERSION),$(VERSION)/)
	${PYTHON_CMD} .build-artefacts/python-venv/bin/htmlmin --remove-comments --keep-optional-attribute-quotes $@ $@

prd/embed.html: src/index.mako.html \
	    .build-artefacts/python-venv/bin/mako-render \
	    .build-artefacts/python-venv/bin/htmlmin \
	    .build-artefacts/last-api-url \
	    .build-artefacts/last-apache-base-path \
	    .build-artefacts/last-version
	mkdir -p $(dir $@)
	$(call buildpage,embed,prod,$(VERSION),$(VERSION)/)
	${PYTHON_CMD} .build-artefacts/python-venv/bin/htmlmin --remove-comments --keep-optional-attribute-quotes $@ $@

prd/img/: src/img/*
	mkdir -p $@
	cp -R $^ $@

prd/style/font-awesome-3.2.1/font/: src/style/font-awesome-3.2.1/font/*
	mkdir -p $@
	cp $^ $@

prd/locales/: src/locales/*.json
	mkdir -p $@
	cp $^ $@

prd/checker: src/checker
	mkdir -p $(dir $@)
	cp $< $@

src/deps.js: $(SRC_JS_FILES) .build-artefacts/python-venv .build-artefacts/closure-library
	${PYTHON_CMD} .build-artefacts/closure-library/closure/bin/build/depswriter.py \
	    --root_with_prefix="src/components components" \
	    --root_with_prefix="src/js js" \
	    --output_file=$@

src/style/app.css: src/style/app.less \
	    src/style/print.less \
	    src/style/ga_bootstrap.less \
	    src/style/ga_variables.less \
	    $(SRC_COMPONENTS_LESS_FILES) \
	    node_modules \
	    .build-artefacts/bootstrap
	node_modules/.bin/lessc $(LESS_PARAMETERS) $< $@

src/index.html: src/index.mako.html \
	    .build-artefacts/python-venv/bin/mako-render \
	    .build-artefacts/last-api-url \
	    .build-artefacts/last-apache-base-path
	$(call buildpage,desktop,,,)

src/mobile.html: src/index.mako.html \
	    .build-artefacts/python-venv/bin/mako-render \
	    .build-artefacts/last-api-url \
	    .build-artefacts/last-apache-base-path
	$(call buildpage,mobile,,,)

src/embed.html: src/index.mako.html \
	    .build-artefacts/python-venv/bin/mako-render \
	    .build-artefacts/last-api-url \
	    .build-artefacts/last-apache-base-path
	$(call buildpage,embed,,,)

src/TemplateCacheModule.js: src/TemplateCacheModule.mako.js \
	    $(SRC_COMPONENTS_PARTIALS_FILES) \
	    .build-artefacts/python-venv/bin/mako-render
	${PYTHON_CMD} .build-artefacts/python-venv/bin/mako-render \
	    --var "partials=$(subst src/,,$(SRC_COMPONENTS_PARTIALS_FILES))" \
	    --var "basedir=src" $< > $@

apache/app.conf: apache/app.mako-dot-conf \
	    .build-artefacts/python-venv/bin/mako-render \
	    .build-artefacts/last-api-url \
	    .build-artefacts/last-apache-base-path \
	    .build-artefacts/last-apache-base-directory \
	    .build-artefacts/last-version
	${PYTHON_CMD} .build-artefacts/python-venv/bin/mako-render \
	    --var "apache_base_path=$(APACHE_BASE_PATH)" \
	    --var "api_url=$(API_URL)" \
	    --var "public_url=$(PUBLIC_URL)" \
	    --var "apache_base_directory=$(APACHE_BASE_DIRECTORY)" \
	    --var "version=$(VERSION)" $< > $@

test/karma-conf-dev.js: test/karma-conf.mako.js .build-artefacts/python-venv/bin/mako-render
	${PYTHON_CMD} .build-artefacts/python-venv/bin/mako-render $< > $@

test/karma-conf-prod.js: test/karma-conf.mako.js .build-artefacts/python-venv/bin/mako-render
	${PYTHON_CMD} .build-artefacts/python-venv/bin/mako-render --var "mode=prod" $< > $@

node_modules: ANGULAR_JS = angular.js angular.min.js
node_modules: ANGULAR_TRANSLATE_JS = angular-translate.js angular-translate.min.js
node_modules: ANGULAR_TRANSLATE_LOADER_JS = angular-translate-loader-static-files.js angular-translate-loader-static-files.min.js
node_modules: LOCALFORAGE = localforage.js localforage.min.js
node_modules: package.json
	npm install
	cp $(addprefix node_modules/angular/,$(ANGULAR_JS)) src/lib/;
	cp $(addprefix node_modules/angular-translate/dist/,$(ANGULAR_TRANSLATE_JS)) src/lib/;
	cp $(addprefix node_modules/angular-translate/dist/angular-translate-loader-static-files/,$(ANGULAR_TRANSLATE_LOADER_JS)) src/lib/;
	cp $(addprefix node_modules/localforage/dist/,$(LOCALFORAGE)) src/lib;


.build-artefacts/app.js: .build-artefacts/js-files \
	    .build-artefacts/closure-compiler/compiler.jar \
	    .build-artefacts/externs/angular.js \
	    .build-artefacts/externs/jquery.js
	mkdir -p $(dir $@)
	java -jar .build-artefacts/closure-compiler/compiler.jar $(SRC_JS_FILES_FOR_COMPILER) \
	    --compilation_level SIMPLE_OPTIMIZATIONS \
	    --jscomp_error checkVars \
	    --externs externs/ol.js \
	    --externs externs/ol3-cesium.js \
	    --externs externs/Cesium.externs.js \
	    --externs .build-artefacts/externs/angular.js \
	    --externs .build-artefacts/externs/jquery.js \
	    --js_output_file $@

$(addprefix .build-artefacts/annotated/, $(SRC_JS_FILES) src/TemplateCacheModule.js): \
	    .build-artefacts/annotated/%.js: %.js node_modules
	mkdir -p $(dir $@)
	./node_modules/.bin/ng-annotate -a $< > $@

.build-artefacts/app-whitespace.js: .build-artefacts/js-files \
	    .build-artefacts/closure-compiler/compiler.jar
	java -jar .build-artefacts/closure-compiler/compiler.jar  $(SRC_JS_FILES_FOR_COMPILER) \
	    --compilation_level WHITESPACE_ONLY \
	    --formatting PRETTY_PRINT \
	    --js_output_file $@

# closurebuilder.py complains if it cannot find a Closure base.js script, so we
# add lib/closure as a root. When compiling we remove base.js from the js files
# passed to the Closure compiler.
.build-artefacts/js-files: $(addprefix .build-artefacts/annotated/, $(SRC_JS_FILES) src/TemplateCacheModule.js) \
	    .build-artefacts/python-venv \
	    .build-artefacts/closure-library
	${PYTHON_CMD} .build-artefacts/closure-library/closure/bin/build/closurebuilder.py \
	    --root=.build-artefacts/annotated \
	    --root=.build-artefacts/closure-library \
	    --namespace="ga" \
	    --namespace="__ga_template_cache__" \
	    --output_mode=list > $@

.build-artefacts/lint.timestamp: .build-artefacts/python-venv/bin/gjslint $(SRC_JS_FILES)
	.build-artefacts/python-venv/bin/gjslint -r src/components -r src/js
	touch $@

.build-artefacts/python-venv/bin/mako-render: .build-artefacts/python-venv
	${PYTHON_CMD} .build-artefacts/python-venv/bin/pip install "Mako==1.0.0"
	touch $@
	@ if [[ ! -e .build-artefacts/python-venv/local ]]; then \
	    ln -s . .build-artefacts/python-venv/local; \
	fi
	cp scripts/cmd.py .build-artefacts/python-venv/local/lib/python2.7/site-packages/mako/cmd.py

.build-artefacts/python-venv/bin/htmlmin: .build-artefacts/python-venv
	${PYTHON_CMD} .build-artefacts/python-venv/bin/pip install "htmlmin==0.1.6"
	touch $@

.build-artefacts/saucelab-requirements-installation.timestamp: .build-artefacts/python-venv
	${PYTHON_CMD} .build-artefacts/python-venv/bin/pip install "selenium"
	${PYTHON_CMD} .build-artefacts/python-venv/bin/pip install "sauceclient"
	${PYTHON_CMD} .build-artefacts/python-venv/bin/pip install "pytest"
	${PYTHON_CMD} .build-artefacts/python-venv/bin/pip install "pytest-xdist"
	touch $@

.build-artefacts/translate-requirements-installation.timestamp: .build-artefacts/python-venv
	${PYTHON_CMD} .build-artefacts/python-venv/bin/pip install "PyYAML==3.10"
	${PYTHON_CMD} .build-artefacts/python-venv/bin/pip install "oauth2client==1.4.11"
	${PYTHON_CMD} .build-artefacts/python-venv/bin/pip install "gspread==0.2.5"
	${PYTHON_CMD} .build-artefacts/python-venv/bin/pip install "pyopenssl==0.15.1"
	touch $@

.build-artefacts/python-venv/bin/gjslint: .build-artefacts/python-venv
	${PYTHON_CMD} .build-artefacts/python-venv/bin/pip install \
	    "http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz"
	touch $@

.build-artefacts/python-venv:
	mkdir -p .build-artefacts
	virtualenv --no-site-packages $@

## Check compatibility with ol3 https://github.com/openlayers/ol3/blob/master/closure-util.json
.build-artefacts/closure-library:
	mkdir -p .build-artefacts
	git clone http://github.com/google/closure-library/ $@
	cd $@ && git reset --hard 0011afd534469ba111786fe68300a634e08a4d80 && cd ../../

.build-artefacts/closure-compiler/compiler-latest.zip:
	mkdir -p $(dir $@)
	wget -O $@ http://dl.google.com/closure-compiler/compiler-latest.zip

.build-artefacts/closure-compiler/compiler.jar: .build-artefacts/closure-compiler/compiler-latest.zip
	unzip $< -d .build-artefacts/closure-compiler
	touch $@

$(DEPLOY_ROOT_DIR)/$(GIT_BRANCH)/.git/config:
	rm -rf $(DEPLOY_ROOT_DIR)/$(GIT_BRANCH)
	git clone https://github.com/geoadmin/mf-geoadmin3 $(DEPLOY_ROOT_DIR)/$(GIT_BRANCH)

deploy/deploy-branch.cfg: deploy/deploy-branch.mako.cfg \
	    .build-artefacts/last-git-branch \
	    .build-artefacts/python-venv/bin/mako-render
	${PYTHON_CMD} .build-artefacts/python-venv/bin/mako-render \
	    --var "git_branch=$(GIT_BRANCH)" $< > $@

rc_branch: rc_branch.mako \
	    .build-artefacts/last-git-branch \
	    .build-artefacts/last-deploy-target \
	    .build-artefacts/python-venv/bin/mako-render
	${PYTHON_CMD} .build-artefacts/python-venv/bin/mako-render \
	    --var "deploy_target=$(DEPLOY_TARGET)" \
	    --var "apache_base_path=$(GIT_BRANCH)" $< > $@

scripts/00-$(GIT_BRANCH).conf: scripts/00-branch.mako-dot-conf \
	    .build-artefacts/last-git-branch \
	    .build-artefacts/python-venv/bin/mako-render
	${PYTHON_CMD} .build-artefacts/python-venv/bin/mako-render \
	    --var "git_branch=$(GIT_BRANCH)" $< > $@

.build-artefacts/last-version::
	mkdir -p $(dir $@)
	test $(VERSION) != $(LAST_VERSION) && echo $(VERSION) > .build-artefacts/last-version || :

.build-artefacts/last-git-branch::
	mkdir -p $(dir $@)
	test $(GIT_BRANCH) != $(GIT_LAST_BRANCH) && echo $(GIT_BRANCH) > .build-artefacts/last-git-branch || :

.build-artefacts/last-api-url::
	mkdir -p $(dir $@)
	test $(API_URL) != $(LAST_API_URL) && echo $(API_URL) > .build-artefacts/last-api-url || :

.build-artefacts/last-apache-base-path::
	mkdir -p $(dir $@)
	test $(APACHE_BASE_PATH) != $(LAST_APACHE_BASE_PATH) && \
	    echo $(APACHE_BASE_PATH) > .build-artefacts/last-apache-base-path || :

.build-artefacts/last-apache-base-directory::
	mkdir -p $(dir $@)
	test $(APACHE_BASE_DIRECTORY) != $(LAST_APACHE_BASE_DIRECTORY) && \
	    echo $(APACHE_BASE_DIRECTORY) > .build-artefacts/last-apache-base-directory || :

.build-artefacts/last-deploy-target::
	mkdir -p $(dir $@)
	test $(DEPLOY_TARGET) != $(LAST_DEPLOY_TARGET) && \
	    echo $(DEPLOY_TARGET) > .build-artefacts/last-deploy-target || :

## LTALP it is correct ?
##.build-artefacts/last-saucelabs-targeturl::
##	mkdir -p $(dir $@)
##	test $(SAUCELABS_TARGETURL) != $(LAST_SAUCELABS_TARGETURL) && \
##	    echo $(SAUCELABS_TARGETURL) > .build-artefacts/last-saucelabs-targeturl || :

.build-artefacts/ol3:
	git clone https://github.com/openlayers/ol3.git $@

.build-artefacts/ol3-cesium:
	git clone --recursive https://github.com/openlayers/ol3-cesium.git $@

.build-artefacts/bootstrap:
	git clone https://github.com/twbs/bootstrap.git $@ && cd $@ && git checkout v3.3.1

.build-artefacts/fastclick:
	git clone https://github.com/ftlabs/fastclick.git $@ && cd $@ && git checkout v1.0.6

.build-artefacts/filesaver:
	git clone https://github.com/eligrey/FileSaver.js.git $@

# datepicker needs custom build of moment js with specific locales
.build-artefacts/datepicker:
	git clone https://github.com/Eonasdan/bootstrap-datetimepicker.git $@ && \
	    cd $@ && git checkout v3.1.3

.build-artefacts/externs/angular.js:
	mkdir -p $(dir $@)
	wget -O $@ https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/angular-1.4.js
	touch $@

# Closure's contrib dir doesn't include externs for jQuery 2, but the jQuery
# 1.9 externs are sufficient for our usage.
.build-artefacts/externs/jquery.js:
	mkdir -p $(dir $@)
	wget -O $(subst -1.9,,$@) https://raw.github.com/google/closure-compiler/master/contrib/externs/jquery-1.9.js
	touch $@

.PHONY: cleanall
cleanall: clean
	rm -rf node_modules
	rm -rf .build-artefacts


.PHONY: cleanappcache
cleanappcache:
	rm -f prd/geoadmin.appcache
	rm -f prd/index.html
	rm -f prd/mobile.html
	rm -f prd/embed.html

.PHONY: clean
clean:
	rm -f .build-artefacts/app.js
	rm -f .build-artefacts/js-files
	rm -rf .build-artefacts/annotated
	rm -f src/deps.js
	rm -f src/style/app.css
	rm -f src/TemplateCacheModule.js
	rm -f src/index.html
	rm -f src/mobile.html
	rm -f src/embed.html
	rm -rf prd
