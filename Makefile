
APP_JS_FILES := $(filter-out app/components/deps.js, $(shell find app/components -type f -name '*.js'))
APP_JS_FILES_FOR_COMPILER = $(shell sed -e :a -e 'N;s/\n/ --js /;ba' .build-artefacts/js-files | sed 's/^.*base\.js //')
APP_LESS_FILES := $(shell find app/components -type f -name '*.less')
APP_PROD_TEMPLATE_FILES := $(subst app,app-prod,$(shell find app/components -type f -path '*/partials/*' -name '*.html'))
BASE_URL_PATH ?= /$(shell id -un)
SERVICE_URL ?= http://mf-chsdi30t.bgdi.admin.ch
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
	@echo "- prod         Build app for prod (app-prod)"
	@echo "- dev          Build app for dev (app)"
	@echo "- lint         Run the linter"
	@echo "- test         Run the JavaScript tests"
	@echo "- apache       Configure Apache (restart required)" 
	@echo "- all          All of the above"
	@echo "- clean        Remove generated files"
	@echo "- cleanall     Remove all the build artefacts"
	@echo "- deploybranch Deploys current branch (note: takes code from github)"
	@echo "- updateol     Update ol.js, ol-simple.js and ol-whitespace.js"
	@echo "- help         Display this help"
	@echo
	@echo "Variables:"
	@echo
	@echo "- BASE_URL_PATH Base URL path (current value: $(BASE_URL_PATH))"
	@echo "- SERVICE_URL Service URL (current value: $(SERVICE_URL))"
	@echo

.PHONY: all
all: prod dev lint test apache test/karma-conf-prod.js deploy/deploy-branch.cfg

.PHONY: prod
prod: app-prod/lib/build.js app-prod/style/app.css app-prod/index.html app-prod/mobile.html app-prod/info.json app-prod/layers.json $(APP_PROD_TEMPLATE_FILES) app-prod/img/ app-prod/style/font-awesome-3.2.1/font/ app-prod/locales/

.PHONY: dev
dev: app/components/deps.js app/style/app.css app/index.html app/mobile.html

.PHONY: lint
lint: .build-artefacts/lint.timestamp

.PHONY: test
test: .build-artefacts/app-whitespace.js test/karma-conf-dev.js node_modules
	./node_modules/.bin/karma start test/karma-conf-dev.js --single-run

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
updateol: .build-artefacts/ol3
	cd .build-artefacts/ol3; git fetch origin; git merge --ff origin/master; git show; ../python-venv/bin/python build.py $(addprefix build/,$(OL_JS))
	cp $(addprefix .build-artefacts/ol3/build/,$(OL_JS)) app/lib/

app-prod/lib/build.js: app/lib/jquery-2.0.2.min.js app/lib/bootstrap-3.0.0.min.js app/lib/angular-1.1.5.min.js app/lib/proj4js-compressed.js app/lib/EPSG21781.js app/lib/ol.js app/lib/angular-translate-0.9.4.min.js app/lib/angular-translate-loader-static-files-0.1.2.min.js .build-artefacts/app.js
	mkdir -p $(dir $@)
	cat $^ > $@

app-prod/style/app.css: app/style/app.css node_modules
	mkdir -p $(dir $@)
	node_modules/.bin/lessc --yui-compress $< $@

app-prod/index.html: app/index.mako.html app-prod/lib/build.js app-prod/style/app.css .build-artefacts/python-venv/bin/mako-render
	mkdir -p $(dir $@)
	.build-artefacts/python-venv/bin/mako-render --var "device=desktop" --var "mode=prod" --var "version=$(VERSION)" --var "service_url=$(SERVICE_URL)" $< > $@

app-prod/mobile.html: app/index.mako.html .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "device=mobile" --var "mode=prod" --var "version=$(VERSION)" --var "service_url=$(SERVICE_URL)" $< > $@

app-prod/img/: app/img/*
	mkdir -p $@
	cp $^ $@

app-prod/style/font-awesome-3.2.1/font/: app/style/font-awesome-3.2.1/font/*
	mkdir -p $@
	cp $^ $@

app-prod/locales/: app/locales/*.json
	mkdir -p $@
	cp $^ $@

# Temporary: the entire rule should go away eventually
app-prod/info.json: app/info.json
	cp $< $@

# Temporary: the entire rule should go away eventually
app-prod/layers.json: app/layers.json
	cp $< $@

$(APP_PROD_TEMPLATE_FILES): app-prod/%: app/%
	mkdir -p $(dir $@)
	cp $< $@

app/components/deps.js: $(APP_JS_FILES) .build-artefacts/python-venv .build-artefacts/closure-library
	.build-artefacts/python-venv/bin/python .build-artefacts/closure-library/closure/bin/build/depswriter.py --root_with_prefix="app/components components" --root_with_prefix="app/js js" --path_with_depspath="app/MainModule.js MainModule.js" --output_file=$@

app/style/app.css: app/style/app.less $(APP_LESS_FILES) node_modules
	node_modules/.bin/lessc -ru $< $@

app/index.html: app/index.mako.html .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "device=desktop" --var "version=" --var "service_url=$(SERVICE_URL)" $< > $@

app/mobile.html: app/index.mako.html .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "device=mobile" --var "version=" --var "service_url=$(SERVICE_URL)" $< > $@

apache/app.conf: apache/app.mako-dot-conf app-prod/lib/build.js app-prod/style/app.css .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "base_url_path=$(BASE_URL_PATH)" --var "service_url=$(SERVICE_URL)" --var "base_dir=$(CURDIR)" $< > $@

test/karma-conf-dev.js: test/karma-conf.mako.js .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render $< > $@

test/karma-conf-prod.js: test/karma-conf.mako.js .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "mode=prod" $< > $@

node_modules:
	npm install

.build-artefacts/app.js: .build-artefacts/js-files .build-artefacts/closure-compiler/compiler.jar
	mkdir -p $(dir $@)
	java -jar .build-artefacts/closure-compiler/compiler.jar $(APP_JS_FILES_FOR_COMPILER) --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file $@

.build-artefacts/app-whitespace.js: .build-artefacts/js-files .build-artefacts/closure-compiler/compiler.jar
	java -jar .build-artefacts/closure-compiler/compiler.jar  $(APP_JS_FILES_FOR_COMPILER) --compilation_level WHITESPACE_ONLY --formatting PRETTY_PRINT --js_output_file $@

# closurebuilder.py complains if it cannot find a Closure base.js script, so we
# add lib/closure as a root. When compiling we remove base.js from the js files
# passed to the Closure compiler.
.build-artefacts/js-files: $(APP_JS_FILES) .build-artefacts/python-venv .build-artefacts/closure-library
	.build-artefacts/python-venv/bin/python .build-artefacts/closure-library/closure/bin/build/closurebuilder.py --root=app/js --root=app/components --root=app/lib/closure --namespace="ga" --output_mode=list app/MainModule.js > $@

.build-artefacts/lint.timestamp: .build-artefacts/python-venv/bin/gjslint $(APP_JS_FILES)
	.build-artefacts/python-venv/bin/gjslint -r app/components --jslint_error=all
	touch $@

.build-artefacts/python-venv/bin/mako-render: .build-artefacts/python-venv
	.build-artefacts/python-venv/bin/pip install "Mako==0.8.1"
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
	git clone --depth 1 git@github.com:openlayers/ol3.git $@

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
	rm -f app/components/deps.js
	rm -f app/style/app.css
	rm -f app/index.html
	rm -f app/mobile.html
	rm -rf app-prod
	rm -f apache/app.conf
	rm -f deploy/deploy-branch.cfg

