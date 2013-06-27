
APP_JS_FILES := $(filter-out app/src/deps.js, $(shell find app/src -type f -name '*.js'))
APP_LIB_FILES := $(shell find app/lib -type f -name '*.js')
APP_JS_FILES_FOR_COMPILER = $(shell sed -e :a -e 'N;s/\n/ --js /;ba' .build-artefacts/js-files | sed 's/^.*base\.js //')
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
	@echo
	@echo "Variables:"
	@echo
	@echo "- BASE_URL_PATH Base URL path (current value: $(BASE_URL_PATH))"
	@echo "- SERVICE_URL Service URL path (current value: $(SERVICE_URL))"
	@echo

.PHONY: all
all: prod dev lint test apache

.PHONY: prod
prod: app-prod/src/app.js app-prod/style/app.css app-prod/index.html app-prod/info.json app-prod/WMTSCapabilities.xml .build-artefacts/lib.timestamp

.PHONY: dev
dev: app/src/deps.js app/style/app.css app/index.html

.PHONY: lint
lint: .build-artefacts/lint.timestamp

.PHONY: test
test: app-prod/src/app.js node_modules
	npm test

app-prod/style/app.css: app/style/app.css node_modules
	mkdir -p app-prod/style
	node_modules/.bin/lessc --yui-compress $< $@

.PHONY: apache 
apache: apache/app.conf

# Temporary: the entire rule should go away eventually
app-prod/info.json: app/info.json
	cp $< $@

# Temporary: the entire rule should go away eventually
app-prod/WMTSCapabilities.xml: app/WMTSCapabilities.xml
	cp $< $@

app/style/app.css: app/style/app.less node_modules
	node_modules/.bin/lessc $< $@

app-prod/src/app.js: .build-artefacts/js-files .build-artefacts/closure-compiler/compiler.jar
	mkdir -p app-prod/src
	java -jar .build-artefacts/closure-compiler/compiler.jar $(APP_JS_FILES_FOR_COMPILER) --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file $@

# closurebuilder.py complains if it cannot find a Closure base.js script, so we
# add lib/closure as a root. When compiling we remove base.js from the js files
# passed to the Closure compiler.
.build-artefacts/js-files: $(APP_JS_FILES) .build-artefacts/python-venv .build-artefacts/closure-library
	.build-artefacts/python-venv/bin/python .build-artefacts/closure-library/closure/bin/build/closurebuilder.py --root=app/src --root=app/lib/closure --namespace="ga" --output_mode=list > $@

app/src/deps.js: $(APP_JS_FILES) .build-artefacts/python-venv .build-artefacts/closure-library
	.build-artefacts/python-venv/bin/python .build-artefacts/closure-library/closure/bin/build/depswriter.py --root="app/src" --output_file=$@

app/index.html: app/index.mako.html .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render $< > $@

app-prod/index.html: app/index.mako.html app-prod/src/app.js app-prod/style/app.css .build-artefacts/lib.timestamp .build-artefacts/python-venv/bin/mako-render
	mkdir -p app-prod
	.build-artefacts/python-venv/bin/mako-render --var "mode=prod" --var "version=$(VERSION)" $< > $@

apache/app.conf: apache/app.mako.conf app-prod/src/app.js app-prod/style/app.css .build-artefacts/lib.timestamp .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "version=$(VERSION)" --var "base_url_path=$(BASE_URL_PATH)" --var "service_url=$(SERVICE_URL)" --var "base_dir=$(CURDIR)" $< > $@ 

.build-artefacts/lib.timestamp: $(APP_LIB_FILES)
	cp -r app/lib app-prod
	touch $@

.build-artefacts/lint.timestamp: .build-artefacts/python-venv/bin/gjslint $(APP_JS_FILES)
	.build-artefacts/python-venv/bin/gjslint -r app/src --jslint_error=all
	touch $@

node_modules:
	npm install

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
	mkdir -p .build-artefacts/closure-compiler
	wget -O $@ http://closure-compiler.googlecode.com/files/compiler-latest.zip
	touch $@

.PHONY: cleanall
cleanall: clean
	rm -rf node_modules
	rm -rf .build-artefacts

.PHONY: clean
clean:
	rm -f .build-artefacts/js-files
	rm -f .build-artefacts/lint.timestamp
	rm -f .build-artefacts/lib.timestamp
	rm -f app/src/deps.js
	rm -f app/style/app.css
	rm -f app/index.html
	rm -rf app-prod
	rm -f apache/app.conf 
