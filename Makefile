
APP_JS_FILES := $(filter-out app/src/deps.js, $(shell find app/src -type f -name '*.js'))
APP_JS_FILES_FOR_COMPILER = $(shell sed -e :a -e 'N;s/\n/ --js /;ba' .build-artefacts/js-files | sed 's/^.*base\.js //')
APP_TEMPLATES_SRC := app/src/contextmenu/partials/menu.html
APP_TEMPLATES_DEST := $(subst app,app-prod, $(APP_TEMPLATES_SRC))
BASE_URL_PATH ?= /$(shell id -un)
SERVICE_URL ?= http://mf-chsdi30t.bgdi.admin.ch
VERSION := $(shell date '+%s')

.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo
	@echo "Possible targets:"
	@echo
	@echo "- prod      Build app for prod (app-prod)"
	@echo "- dev       Build app for dev (app)"
	@echo "- lint      Run the linter"
	@echo "- test      Run the JavaScript tests"
	@echo "- apache    Configure Apache (restart required)" 
	@echo "- all       All of the above"
	@echo "- clean     Remove generated files"
	@echo "- cleanall  Remove all the build artefacts"
	@echo "- help      Display this help"
	@echo
	@echo "Variables:"
	@echo
	@echo "- BASE_URL_PATH Base URL path (current value: $(BASE_URL_PATH))"
	@echo "- SERVICE_URL Service URL (current value: $(SERVICE_URL))"
	@echo

.PHONY: all
all: prod dev lint test apache test/karma-conf-prod.js

.PHONY: prod
prod: app-prod/lib/build.js app-prod/style/app.css app-prod/index.html app-prod/info.json app-prod/WMTSCapabilities.xml $(APP_TEMPLATES_DEST) app-prod/img/

.PHONY: dev
dev: app/src/deps.js app/style/app.css app/index.html

.PHONY: lint
lint: .build-artefacts/lint.timestamp

.PHONY: test
test: .build-artefacts/app-whitespace.js test/karma-conf-dev.js node_modules
	./node_modules/.bin/karma start test/karma-conf-dev.js --single-run

.PHONY: apache
apache: apache/app.conf

app-prod/lib/build.js: app/lib/jquery-2.0.2.min.js app/lib/bootstrap-3.0.0.min.js app/lib/angular-1.1.5.min.js app/lib/proj4js-compressed.js app/lib/EPSG21781.js app/lib/ol.js .build-artefacts/app.js
	mkdir -p $(dir $@)
	cat $^ > $@

app-prod/style/app.css: app/style/app.css node_modules
	mkdir -p $(dir $@)
	node_modules/.bin/lessc --yui-compress $< $@

app-prod/index.html: app/index.mako.html app-prod/lib/build.js app-prod/style/app.css .build-artefacts/python-venv/bin/mako-render
	mkdir -p $(dir $@)
	.build-artefacts/python-venv/bin/mako-render --var "mode=prod" --var "version=$(VERSION)" $< > $@

app-prod/img/: app/img/*
	mkdir -p $@
	cp $^ $@

# Temporary: the entire rule should go away eventually
app-prod/info.json: app/info.json
	cp $< $@

# Temporary: the entire rule should go away eventually
app-prod/WMTSCapabilities.xml: app/WMTSCapabilities.xml
	cp $< $@

$(APP_TEMPLATES_DEST): $(APP_TEMPLATES_SRC)
	mkdir -p $(basename $@)
	cp $< $@

app/src/deps.js: $(APP_JS_FILES) .build-artefacts/python-venv .build-artefacts/closure-library
	.build-artefacts/python-venv/bin/python .build-artefacts/closure-library/closure/bin/build/depswriter.py --root="app/src" --output_file=$@

app/style/app.css: app/style/app.less node_modules
	node_modules/.bin/lessc $< $@

app/index.html: app/index.mako.html .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render $< > $@

apache/app.conf: apache/app.mako-dot-conf app-prod/lib/build.js app-prod/style/app.css .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "version=$(VERSION)" --var "base_url_path=$(BASE_URL_PATH)" --var "service_url=$(SERVICE_URL)" --var "base_dir=$(CURDIR)" $< > $@

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
	.build-artefacts/python-venv/bin/python .build-artefacts/closure-library/closure/bin/build/closurebuilder.py --root=app/src --root=app/lib/closure --namespace="ga" --output_mode=list > $@

.build-artefacts/lint.timestamp: .build-artefacts/python-venv/bin/gjslint $(APP_JS_FILES)
	.build-artefacts/python-venv/bin/gjslint -r app/src --jslint_error=all
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

.PHONY: cleanall
cleanall: clean
	rm -rf node_modules
	rm -rf .build-artefacts

.PHONY: clean
clean:
	rm -f .build-artefacts/app.js
	rm -f .build-artefacts/js-files
	rm -f .build-artefacts/lint.timestamp
	rm -f app/src/deps.js
	rm -f app/style/app.css
	rm -f app/index.html
	rm -rf app-prod
	rm -f apache/app.conf
