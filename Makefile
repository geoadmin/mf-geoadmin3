SRC_JS_FILES := $(shell find src/components src/js -type f -name '*.js')
SRC_JS_FILES_FOR_COMPILER = $(shell sed -e ':a' -e 'N' -e '$$!ba' -e 's/\n/ --js /g' .build-artefacts/js-files | sed 's/^.*base\.js //')
SRC_COMPONENTS_LESS_FILES := $(shell find src/components -type f -name '*.less')
SRC_COMPONENTS_PARTIALS_FILES = $(shell find src/components -type f -path '*/partials/*' -name '*.html')
BASE_URL_PATH ?= /$(shell id -un)
SERVICE_URL ?= http://mf-chsdi30t.bgdi.admin.ch
LESS_PARAMETERS ?= '-ru'
VERSION := $(shell date '+%s')/
GIT_BRANCH := $(shell git rev-parse --symbolic-full-name --abbrev-ref HEAD)
GIT_LAST_BRANCH := $(shell if [ -f .build-artefacts/last-git-branch ]; then cat .build-artefacts/last-git-branch 2> /dev/null; else echo 'dummy'; fi)
DEPLOY_ROOT_DIR := /var/www/vhosts/mf-geoadmin3/private/branches


.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo
	@echo "Possible targets:"
	@echo
	@echo "- prod         Build app for prod (prod)"
	@echo "- dev          Build app for dev (src)"
	@echo "- lint         Run the linter"
	@echo "- testdev      Run the JavaScript tests in dev mode"
	@echo "- testprod     Run the JavaScript tests in prod mode"
	@echo "- apache       Configure Apache (restart required)"
	@echo "- all          All of the above (target to run prior to creating a PR)"
	@echo "- clean        Remove generated files"
	@echo "- cleanall     Remove all the build artefacts"
	@echo "- deploybranch Deploys current branch (note: takes code from github)"
	@echo "- updateol     Update ol.js, ol-simple.js and ol-whitespace.js"
	@echo "- translate    Generate the translation files (requires db user pwd in ~/.pgpass: dbServer:dbPort:*:dbUser:dbUserPwd)"
	@echo "- help         Display this help"
	@echo
	@echo "Variables:"
	@echo
	@echo "- BASE_URL_PATH Base URL path (current value: $(BASE_URL_PATH))"
	@echo "- SERVICE_URL Service URL (current value: $(SERVICE_URL))"
	@echo

.PHONY: all
all: prod dev lint testdev testprod apache deploy/deploy-branch.cfg

.PHONY: prod
prod: prod/lib/build.js prod/style/app.css prod/index.html prod/mobile.html prod/info.json prod/img/ prod/style/font-awesome-3.2.1/font/ prod/locales/ prod/lib/jquery-2.0.3.min.map

.PHONY: dev
dev: src/deps.js src/style/app.css src/index.html src/mobile.html

.PHONY: lint
lint: .build-artefacts/lint.timestamp

.PHONY: testdev
testdev: .build-artefacts/app-whitespace.js test/karma-conf-dev.js node_modules
	./node_modules/.bin/karma start test/karma-conf-dev.js --single-run

.PHONY: testprod
testprod: prod/lib/build.js test/karma-conf-prod.js node_modules
	./node_modules/.bin/karma start test/karma-conf-prod.js --single-run

.PHONY: apache
apache: apache/app.conf

.PHONY: deploybranch
deploybranch: deploy/deploy-branch.cfg $(DEPLOY_ROOT_DIR)/$(GIT_BRANCH)/.git/config
	cd $(DEPLOY_ROOT_DIR)/$(GIT_BRANCH); \
	git checkout $(GIT_BRANCH); \
	git pull; \
	make all; \
	sudo -u deploy deploy -r deploy/deploy-branch.cfg ab

.PHONY: updateol
updateol: OL_JS = ol.js ol-simple.js ol-whitespace.js
updateol: .build-artefacts/ol3 .build-artefacts/ol-requirements-installation.timestamp
	rm -f .build-artefacts/ol3/src/ol/ga-ol3.exports
	cd .build-artefacts/ol3; git fetch origin; git merge --ff origin/master; git show; cp ../../scripts/ga-ol3.exports src/ol/ga-ol3.exports; ../python-venv/bin/python build.py $(addprefix build/,$(OL_JS))
	cp $(addprefix .build-artefacts/ol3/build/,$(OL_JS)) src/lib/

.PHONY: translate
translate: .build-artefacts/translate-requirements-installation.timestamp
	.build-artefacts/python-venv/bin/python scripts/translation2js.py src/locales/

prod/lib/build.js: src/lib/jquery-2.0.3.min.js src/lib/bootstrap-3.0.0.min.js src/lib/typeahead-0.9.3.min.js src/lib/angular-1.2.0rc2.min.js src/lib/proj4js-compressed.js src/lib/EPSG21781.js src/lib/EPSG2056.js src/lib/ol.js src/lib/angular-animate-1.2.0rc2.min.js src/lib/angular-translate-1.1.0.min.js src/lib/angular-translate-loader-static-files-0.1.5.min.js src/lib/fastclick.js .build-artefacts/app.js
	mkdir -p $(dir $@)
	cat $^ > $@

prod/style/app.css: src/style/app.less src/style/ga_bootstrap.less src/style/ga_variables.less $(SRC_COMPONENTS_LESS_FILES) node_modules .build-artefacts/bootstrap
	mkdir -p $(dir $@)
	node_modules/.bin/lessc -ru --yui-compress $< $@

prod/index.html: src/index.mako.html prod/lib/build.js prod/style/app.css .build-artefacts/python-venv/bin/mako-render
	mkdir -p $(dir $@)
	.build-artefacts/python-venv/bin/mako-render --var "device=desktop" --var "mode=prod" --var "version=$(VERSION)" --var "base_url_path=$(BASE_URL_PATH)" --var "service_url=$(SERVICE_URL)" $< > $@

prod/mobile.html: src/index.mako.html .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "device=mobile" --var "mode=prod" --var "version=$(VERSION)" --var "base_url_path=$(BASE_URL_PATH)" --var "service_url=$(SERVICE_URL)" $< > $@

prod/img/: src/img/*
	mkdir -p $@
	cp $^ $@

prod/style/font-awesome-3.2.1/font/: src/style/font-awesome-3.2.1/font/*
	mkdir -p $@
	cp $^ $@

prod/locales/: src/locales/*.json
	mkdir -p $@
	cp $^ $@

prod/lib/jquery-2.0.3.min.map: src/lib/jquery-2.0.3.min.map
	mkdir -p $@
	cp $< $@

# Temporary: the entire rule should go away eventually
prod/info.json: src/info.json
	cp $< $@

src/deps.js: $(SRC_JS_FILES) .build-artefacts/python-venv .build-artefacts/closure-library
	.build-artefacts/python-venv/bin/python .build-artefacts/closure-library/closure/bin/build/depswriter.py --root_with_prefix="src/components components" --root_with_prefix="src/js js" --output_file=$@

src/style/app.css: src/style/app.less src/style/ga_bootstrap.less src/style/ga_variables.less $(SRC_COMPONENTS_LESS_FILES) node_modules .build-artefacts/bootstrap
	node_modules/.bin/lessc $(LESS_PARAMETERS) $< $@

src/index.html: src/index.mako.html .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "device=desktop" --var "version=" --var "base_url_path=$(BASE_URL_PATH)" --var "service_url=$(SERVICE_URL)" $< > $@

src/mobile.html: src/index.mako.html .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "device=mobile" --var "version=" --var "base_url_path=$(BASE_URL_PATH)" --var "service_url=$(SERVICE_URL)" $< > $@

src/TemplateCacheModule.js: src/TemplateCacheModule.mako.js $(SRC_COMPONENTS_PARTIALS_FILES) .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "partials=$(subst src/,,$(SRC_COMPONENTS_PARTIALS_FILES))" --var "basedir=src" $< > $@

apache/app.conf: apache/app.mako-dot-conf prod/lib/build.js prod/style/app.css .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "base_url_path=$(BASE_URL_PATH)" --var "service_url=$(SERVICE_URL)" --var "base_dir=$(CURDIR)" $< > $@

test/karma-conf-dev.js: test/karma-conf.mako.js .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render $< > $@

test/karma-conf-prod.js: test/karma-conf.mako.js .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "mode=prod" $< > $@

node_modules: package.json
	npm install

.build-artefacts/app.js: .build-artefacts/js-files .build-artefacts/closure-compiler/compiler.jar .build-artefacts/externs/angular.js .build-artefacts/externs/jquery.js
	mkdir -p $(dir $@)
	java -jar .build-artefacts/closure-compiler/compiler.jar $(SRC_JS_FILES_FOR_COMPILER) --compilation_level SIMPLE_OPTIMIZATIONS --jscomp_error checkVars --externs externs/ol.js --externs .build-artefacts/externs/angular.js --externs .build-artefacts/externs/jquery.js --js_output_file $@

$(addprefix .build-artefacts/annotated/, $(SRC_JS_FILES) src/TemplateCacheModule.js): .build-artefacts/annotated/%.js: %.js node_modules
	mkdir -p $(dir $@)
	./node_modules/ng-annotate/ng-annotate -a $< > $@

.build-artefacts/app-whitespace.js: .build-artefacts/js-files .build-artefacts/closure-compiler/compiler.jar
	java -jar .build-artefacts/closure-compiler/compiler.jar  $(SRC_JS_FILES_FOR_COMPILER) --compilation_level WHITESPACE_ONLY --formatting PRETTY_PRINT --js_output_file $@

# closurebuilder.py complains if it cannot find a Closure base.js script, so we
# add lib/closure as a root. When compiling we remove base.js from the js files
# passed to the Closure compiler.
.build-artefacts/js-files: $(addprefix .build-artefacts/annotated/, $(SRC_JS_FILES) src/TemplateCacheModule.js) .build-artefacts/python-venv .build-artefacts/closure-library
	.build-artefacts/python-venv/bin/python .build-artefacts/closure-library/closure/bin/build/closurebuilder.py --root=.build-artefacts/annotated --root=src/lib/closure --namespace="ga" --namespace="__ga_template_cache__" --output_mode=list > $@

.build-artefacts/lint.timestamp: .build-artefacts/python-venv/bin/gjslint $(SRC_JS_FILES)
	.build-artefacts/python-venv/bin/gjslint -r src/components src/js --jslint_error=all
	touch $@

.build-artefacts/python-venv/bin/mako-render: .build-artefacts/python-venv
	.build-artefacts/python-venv/bin/pip install "Mako==0.8.1"
	touch $@

.build-artefacts/translate-requirements-installation.timestamp: .build-artefacts/python-venv
	.build-artefacts/python-venv/bin/pip install "psycopg2==2.5.1"
	.build-artefacts/python-venv/bin/pip install "PyYAML==3.10"
	touch $@

.build-artefacts/ol-requirements-installation.timestamp: .build-artefacts/python-venv
	.build-artefacts/python-venv/bin/pip install "regex"
	touch $@

.build-artefacts/python-venv/bin/gjslint: .build-artefacts/python-venv
	.build-artefacts/python-venv/bin/pip install "http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz"
	touch $@

.build-artefacts/python-venv:
	mkdir -p .build-artefacts
	virtualenv --no-site-packages $@

.build-artefacts/closure-library:
	mkdir -p .build-artefacts
	git clone http://code.google.com/p/closure-library/ $@

.build-artefacts/closure-compiler/compiler.jar: .build-artefacts/closure-compiler/compiler-latest.zip
	unzip $< -d .build-artefacts/closure-compiler
	touch $@

.build-artefacts/closure-compiler/compiler-latest.zip:
	mkdir -p $(dir $@)
	wget -O $@ http://closure-compiler.googlecode.com/files/compiler-latest.zip
	touch $@

$(DEPLOY_ROOT_DIR)/$(GIT_BRANCH)/.git/config:
	rm -rf $(DEPLOY_ROOT_DIR)/$(GIT_BRANCH)
	git clone https://github.com/geoadmin/mf-geoadmin3 $(DEPLOY_ROOT_DIR)/$(GIT_BRANCH)

deploy/deploy-branch.cfg: deploy/deploy-branch.mako.cfg .build-artefacts/last-git-branch .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "git_branch=$(GIT_BRANCH)" $< > $@

.build-artefacts/last-git-branch::
	test $(GIT_BRANCH) != $(GIT_LAST_BRANCH) && echo $(GIT_BRANCH) > .build-artefacts/last-git-branch || :

.build-artefacts/ol3:
	git clone --depth 1 https://github.com/openlayers/ol3.git $@

.build-artefacts/bootstrap:
	git clone https://github.com/twbs/bootstrap.git $@ && cd .build-artefacts/bootstrap && git checkout v3.0.0

.build-artefacts/externs/angular.js:
	mkdir -p $(dir $@)
	wget -O $@ http://closure-compiler.googlecode.com/git/contrib/externs/angular.js
	touch $@

# Closure's contrib dir doesn't include externs for jQuery 2, but the jQuery
# 1.9 externs are sufficient for our usage.
.build-artefacts/externs/jquery.js:
	mkdir -p $(dir $@)
	wget -O $(subst -1.9,,$@) http://closure-compiler.googlecode.com/git/contrib/externs/jquery-1.9.js
	touch $@

.PHONY: cleanall
cleanall: clean
	rm -rf node_modules
	rm -rf .build-artefacts

.PHONY: clean
clean:
	rm -f .build-artefacts/app.js
	rm -f .build-artefacts/js-files
	rm -f .build-artefacts/lint.timestamp
	rm -f .build-artefacts/last-git-branch
	rm -rf .build-artefacts/annotated
	rm -f src/deps.js
	rm -f src/style/app.css
	rm -f src/index.html
	rm -f src/mobile.html
	rm -f src/TemplateCacheModule.js
	rm -rf prod
	rm -f apache/app.conf
	rm -f deploy/deploy-branch.cfg

