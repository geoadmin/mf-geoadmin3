
JS_FILES := $(shell find app/ -type f -name '*.js')
JS_FILES_FOR_COMPILER = $(shell sed -e :a -e 'N;s/\n/ --js /;ba' .build-artefacts/js-files | sed 's/^.*base\.js //')
VERSION := $(shell date '+%s')

.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo
	@echo "Possible targets:"
	@echo
	@echo "- css       Build CSS"
	@echo "- js        Build JavaScript"
	@echo "- deps      Build deps.js (for script autoload with Closure)"
	@echo "- index     Create index.html and index-prod.html"
	@echo "- lint      Run the linter"
	@echo "- test      Run the JavaScript tests"
	@echo "- apache    Configure Apache"
	@echo "- all       All of the above"
	@echo "- clean     Remove generated files"
	@echo "- cleanall  Remove all the build artefacts"
	@echo

.PHONY: all
all: css js deps index lint test apache

.PHONY: css
css: css/app.min.css

.PHONY: js
js: build/app.js

.PHONY: deps
deps: build/deps.js

.PHONY: index
index: index.html index-prod.html

.PHONY: lint
lint: .build-artefacts/lint.timestamp

.PHONY: test
test: build/app.js node_modules
	npm test

.PHONY: apache
apache: apache/app.conf

css/app.min.css: css/app.css node_modules
	node_modules/.bin/lessc --yui-compress $< $@

css/app.css: less/app.less node_modules
	node_modules/.bin/lessc $< $@

build/app.js: .build-artefacts/js-files .build-artefacts/closure-compiler/compiler.jar
	java -jar .build-artefacts/closure-compiler/compiler.jar $(JS_FILES_FOR_COMPILER) --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file $@

.build-artefacts/js-files: $(JS_FILES) .build-artefacts/python-venv .build-artefacts/closure-library
	.build-artefacts/python-venv/bin/python .build-artefacts/closure-library/closure/bin/build/closurebuilder.py --root=app --root=lib/closure --namespace="ga" --output_mode=list > $@

build/deps.js: $(JS_FILES) .build-artefacts/python-venv .build-artefacts/closure-library
	.build-artefacts/python-venv/bin/python .build-artefacts/closure-library/closure/bin/build/depswriter.py --root_with_prefix="app ../../app" --output_file=$@

index.html: index.mako .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "version=$(VERSION)" $< > $@

index-prod.html: index.mako .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "mode=prod" --var "version=$(VERSION)" $< > $@

apache/app.conf: apache/app.mako .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "version=$(VERSION)" --var "base_url=$(BASE_URL)" --var "base_dir=$(CURDIR)" $< > $@

.build-artefacts/lint.timestamp: .build-artefacts/python-venv/bin/gjslint $(JS_FILES)
	.build-artefacts/python-venv/bin/gjslint -r app --jslint_error=all
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
	rm -f build/app.js
	rm -f build/deps.js
	rm -f css/app.css
	rm -f css/app.min.css
	rm -f index.html
	rm -f index-prod.html
	rm -f apache/app.conf
