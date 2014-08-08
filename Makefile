SRC_JS_FILES := $(shell find src/components src/js -type f -name '*.js')
SRC_JS_FILES_FOR_COMPILER = $(shell sed -e ':a' -e 'N' -e '$$!ba' -e 's/\n/ --js /g' .build-artefacts/js-files | sed 's/^.*base\.js //')
SRC_COMPONENTS_LESS_FILES := $(shell find src/components -type f -name '*.less')
SRC_COMPONENTS_PARTIALS_FILES = $(shell find src/components -type f -path '*/partials/*' -name '*.html')
APACHE_BASE_DIRECTORY ?= $(CURDIR)
LAST_APACHE_BASE_DIRECTORY := $(shell if [ -f .build-artefacts/last-apache-base-directory ]; then cat .build-artefacts/last-apache-base-directory 2> /dev/null; else echo '-none-'; fi)
ifeq "$(CURDIR)" "/var/www/vhosts/mf-geoadmin3/private/geoadmin"
	APACHE_BASE_PATH ?= ""
else
	APACHE_BASE_PATH ?= /$(shell id -un)
endif
LAST_APACHE_BASE_PATH := $(shell if [ -f .build-artefacts/last-apache-base-path ]; then cat .build-artefacts/last-apache-base-path 2> /dev/null; else echo '-none-'; fi)
API_URL ?= //mf-chsdi3.dev.bgdi.ch
LAST_API_URL := $(shell if [ -f .build-artefacts/last-api-url ]; then cat .build-artefacts/last-api-url 2> /dev/null; else echo '-none-'; fi)
LESS_PARAMETERS ?= '-ru'
VERSION := $(shell date '+%s')
GIT_BRANCH := $(shell git rev-parse --symbolic-full-name --abbrev-ref HEAD)
GIT_LAST_BRANCH := $(shell if [ -f .build-artefacts/last-git-branch ]; then cat .build-artefacts/last-git-branch 2> /dev/null; else echo 'dummy'; fi)
DEPLOY_ROOT_DIR := /var/www/vhosts/mf-geoadmin3/private/branch
DEPLOY_TARGET ?= 'dev'
LAST_DEPLOY_TARGET := $(shell if [ -f .build-artefacts/last-deploy-target ]; then cat .build-artefacts/last-deploy-target 2> /dev/null; else echo '-none-'; fi)

.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo
	@echo "Possible targets:"
	@echo
	@echo "- prod            Build app for prod (/prd)"
	@echo "- dev             Build app for dev (/src)"
	@echo "- lint            Run the linter"
	@echo "- testdev         Run the JavaScript tests in dev mode"
	@echo "- testprod        Run the JavaScript tests in prod mode"
	@echo "- apache          Configure Apache (restart required)"
	@echo "- fixrights       Fix rights in common folder"
	@echo "- all             All of the above (target to run prior to creating a PR)"
	@echo "- clean           Remove generated files"
	@echo "- cleanall        Remove all the build artefacts"
	@echo "- deploydev       Deploys current github master to dev. Specify SNAPSHOT=true to create snapshot as well."
	@echo "- deployint       Deploys snapshot specified with SNAPSHOT=xxx to int."
	@echo "- deployprod      Deploys snapshot specified with SNAPSHOT=xxx to prod."
	@echo "- deploybranch    Deploys current branch to test (note: takes code from github)"
	@echo "- deploybranchint Deploys current branch to test and int (note: takes code from github)"
	@echo "- updateol        Update ol.js, ol-simple.js and ol-whitespace.js"
	@echo "- translate       Generate the translation files (requires db user pwd in ~/.pgpass: dbServer:dbPort:*:dbUser:dbUserPwd)"
	@echo "- help            Display this help"
	@echo
	@echo "Variables:"
	@echo
	@echo "- DEPLOY_TARGET Deploy target (build with: $(LAST_DEPLOY_TARGET), current value: $(DEPLOY_TARGET))"
	@echo "- API_URL Service URL         (build with: $(LAST_API_URL), current value: $(API_URL))"
	@echo "- APACHE_BASE_PATH Base path  (build with: $(LAST_APACHE_BASE_PATH), current value: $(APACHE_BASE_PATH))"
	@echo "- APACHE_BASE_DIRECTORY       (build with: $(LAST_APACHE_BASE_DIRECTORY), current value: $(APACHE_BASE_DIRECTORY))"

	@echo

.PHONY: all
all: prod dev lint apache testdev testprod deploy/deploy-branch.cfg fixrights

.PHONY: prod
prod: prd/lib/ prd/lib/build.js prd/style/app.css prd/index.html prd/mobile.html prd/img/ prd/style/font-awesome-3.2.1/font/ prd/locales/ prd/checker prd/robots.txt

.PHONY: dev
dev: src/deps.js src/style/app.css src/index.html src/mobile.html

.PHONY: lint
lint: .build-artefacts/lint.timestamp

.PHONY: testdev
testdev: .build-artefacts/app-whitespace.js test/karma-conf-dev.js node_modules
	./node_modules/.bin/karma start test/karma-conf-dev.js --single-run

.PHONY: testprod
testprod: prd/lib/build.js test/karma-conf-prod.js node_modules
	./node_modules/.bin/karma start test/karma-conf-prod.js --single-run

.PHONY: apache
apache: apache/app.conf

.PHONY: deploydev
deploydev:
	@ if test "$(SNAPSHOT)" = "true"; then \
		./scripts/deploydev.sh -s; \
	else \
		./scripts/deploydev.sh; \
  fi

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
	bash -c "source rc_branch && make all";

.PHONY: deploybranchint
deploybranchint: deploybranch
	cd $(DEPLOY_ROOT_DIR)/$(GIT_BRANCH); \
	sudo -u deploy deploy -r deploy/deploy-branch.cfg int;

.PHONY: preparebranch
preparebranch: rc_branch scripts/00-$(GIT_BRANCH).conf

.PHONY: updateol
updateol: OL_JS = ol.js ol-simple.js ol-whitespace.js
updateol: .build-artefacts/ol3 .build-artefacts/ol-requirements-installation.timestamp
	cd .build-artefacts/ol3; \
	git reset HEAD --hard; \
	git checkout master; \
	git fetch origin; \
	git merge --ff origin/master; \
	git show; \
	cat ../../scripts/ga-ol3-feature.exports >> src/ol/feature.js; \
	cat ../../scripts/ga-ol3-source.exports >> src/ol/source/source.js; \
	npm install; \
	../python-venv/bin/python build.py $(addprefix build/,$(OL_JS)); \
	cd ../../; \
	cp $(addprefix .build-artefacts/ol3/build/,$(OL_JS)) src/lib/; \

.PHONY: fastclick
fastclick: .build-artefacts/fastclick
	cd .build-artefacts/fastclick && git reset --hard && git apply ../../scripts/fastclick.patch;
	cp .build-artefacts/fastclick/lib/fastclick.js src/lib/fastclick.js

.PHONY: translate
translate: .build-artefacts/translate-requirements-installation.timestamp
	.build-artefacts/python-venv/bin/python scripts/translation2js.py src/locales/

.PHONY: fixrights
fixrights:
	chgrp -f -R geodata . || :
	chmod -f -R g+rw . || :

guard-%:
	@ if test "${${*}}" = ""; then \
  	echo "Environment variable $* not set. Add SNAPSHOT=xxx to your command."; \
  	exit 1; \
	fi

prd/robots.txt: scripts/robots.mako-dot-txt .build-artefacts/last-deploy-target
	mkdir -p $(dir $@)
	.build-artefacts/python-venv/bin/mako-render --var "deploy_target=$(DEPLOY_TARGET)" $< > $@

prd/lib/: src/lib/d3-3.3.1.min.js src/lib/angularIE9CorsFix.js src/lib/jQuery.XDomainRequest.js
	mkdir -p $@
	cp $^ $@

prd/lib/build.js: fastclick src/lib/jquery-2.0.3.min.js src/lib/bootstrap-3.0.0.min.js src/lib/typeahead-0.9.3.min.js src/lib/angular-1.2.9.min.js src/lib/proj4js-compressed.js src/lib/EPSG21781.js src/lib/EPSG2056.js src/lib/EPSG32631.js src/lib/EPSG32632.js .build-artefacts/MGRS.min.js src/lib/ol.js src/lib/angular-animate-1.2.9.min.js src/lib/angular-translate-1.1.1.min.js src/lib/angular-translate-loader-static-files-0.1.5.min.js .build-artefacts/fastclick.min.js .build-artefacts/app.js
	mkdir -p $(dir $@)
	cat $^ | sed 's/^\/\/[#,@] sourceMappingURL=.*//' > $@

prd/style/app.css: src/style/app.less src/style/print.less src/style/ga_bootstrap.less src/style/ga_variables.less $(SRC_COMPONENTS_LESS_FILES) node_modules .build-artefacts/bootstrap
	mkdir -p $(dir $@)
	node_modules/.bin/lessc -ru --yui-compress $< $@

prd/index.html: src/index.mako.html prd/lib/build.js prd/style/app.css .build-artefacts/python-venv/bin/mako-render .build-artefacts/python-venv/bin/htmlmin .build-artefacts/last-api-url .build-artefacts/last-apache-base-path
	mkdir -p $(dir $@)
	.build-artefacts/python-venv/bin/mako-render --var "device=desktop" --var "mode=prod" --var "version=$(VERSION)" --var "versionslashed=$(VERSION)/" --var "apache_base_path=$(APACHE_BASE_PATH)" --var "api_url=$(API_URL)" $< > $@
	.build-artefacts/python-venv/bin/htmlmin --remove-comments --keep-optional-attribute-quotes $@ $@

prd/mobile.html: src/index.mako.html .build-artefacts/python-venv/bin/mako-render .build-artefacts/python-venv/bin/htmlmin .build-artefacts/last-api-url .build-artefacts/last-apache-base-path
	mkdir -p $(dir $@)
	.build-artefacts/python-venv/bin/mako-render --var "device=mobile" --var "mode=prod" --var "version=$(VERSION)" --var "versionslashed=$(VERSION)/" --var "apache_base_path=$(APACHE_BASE_PATH)" --var "api_url=$(API_URL)" $< > $@
	.build-artefacts/python-venv/bin/htmlmin --remove-comments --keep-optional-attribute-quotes $@ $@

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
	.build-artefacts/python-venv/bin/python .build-artefacts/closure-library/closure/bin/build/depswriter.py --root_with_prefix="src/components components" --root_with_prefix="src/js js" --output_file=$@

src/style/app.css: src/style/app.less src/style/print.less src/style/ga_bootstrap.less src/style/ga_variables.less $(SRC_COMPONENTS_LESS_FILES) node_modules .build-artefacts/bootstrap
	node_modules/.bin/lessc $(LESS_PARAMETERS) $< $@

src/index.html: src/index.mako.html .build-artefacts/python-venv/bin/mako-render .build-artefacts/last-api-url .build-artefacts/last-apache-base-path
	.build-artefacts/python-venv/bin/mako-render --var "device=desktop" --var "version=" --var "versionslashed=" --var "apache_base_path=$(APACHE_BASE_PATH)" --var "api_url=$(API_URL)" $< > $@

src/mobile.html: src/index.mako.html .build-artefacts/python-venv/bin/mako-render .build-artefacts/last-api-url .build-artefacts/last-apache-base-path
	.build-artefacts/python-venv/bin/mako-render --var "device=mobile" --var "version=" --var "versionslashed=" --var "apache_base_path=$(APACHE_BASE_PATH)" --var "api_url=$(API_URL)" $< > $@

src/TemplateCacheModule.js: src/TemplateCacheModule.mako.js $(SRC_COMPONENTS_PARTIALS_FILES) .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "partials=$(subst src/,,$(SRC_COMPONENTS_PARTIALS_FILES))" --var "basedir=src" $< > $@

apache/app.conf: apache/app.mako-dot-conf prd/lib/build.js prd/style/app.css .build-artefacts/python-venv/bin/mako-render .build-artefacts/last-api-url .build-artefacts/last-apache-base-path .build-artefacts/last-apache-base-directory
	.build-artefacts/python-venv/bin/mako-render --var "apache_base_path=$(APACHE_BASE_PATH)" --var "api_url=$(API_URL)" --var "apache_base_directory=$(APACHE_BASE_DIRECTORY)" --var "version=$(VERSION)" $< > $@

test/karma-conf-dev.js: test/karma-conf.mako.js .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render $< > $@

test/karma-conf-prod.js: test/karma-conf.mako.js .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "mode=prod" $< > $@

node_modules: package.json
	npm install

# There's no distribution of a minified version of fastclick and MGRS so we minify it
# ourselves as part of our build process.
.build-artefacts/fastclick.min.js: src/lib/fastclick.js .build-artefacts/closure-compiler/compiler.jar
	mkdir -p $(dir $@)
	java -jar .build-artefacts/closure-compiler/compiler.jar $< --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file $@

.build-artefacts/MGRS.min.js: src/lib/MGRS.js .build-artefacts/closure-compiler/compiler.jar
	mkdir -p $(dir $@)
	java -jar .build-artefacts/closure-compiler/compiler.jar $< --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file $@

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

.build-artefacts/python-venv/bin/htmlmin: .build-artefacts/python-venv
	.build-artefacts/python-venv/bin/pip install "htmlmin"
	touch $@

.build-artefacts/translate-requirements-installation.timestamp: .build-artefacts/python-venv
	.build-artefacts/python-venv/bin/pip install "PyYAML==3.10"
	.build-artefacts/python-venv/bin/pip install "gspread==0.1.0"
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
	git clone http://github.com/google/closure-library/ $@

.build-artefacts/closure-compiler/compiler.jar: .build-artefacts/closure-compiler/compiler-latest.zip
	unzip $< -d .build-artefacts/closure-compiler
	touch $@

.build-artefacts/closure-compiler/compiler-latest.zip:
	mkdir -p $(dir $@)
	wget -O $@ http://dl.google.com/closure-compiler/compiler-20131014.zip
	touch $@

$(DEPLOY_ROOT_DIR)/$(GIT_BRANCH)/.git/config:
	rm -rf $(DEPLOY_ROOT_DIR)/$(GIT_BRANCH)
	git clone https://github.com/geoadmin/mf-geoadmin3 $(DEPLOY_ROOT_DIR)/$(GIT_BRANCH)

deploy/deploy-branch.cfg: deploy/deploy-branch.mako.cfg .build-artefacts/last-git-branch .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "git_branch=$(GIT_BRANCH)" $< > $@

rc_branch: rc_branch.mako .build-artefacts/last-git-branch .build-artefacts/last-deploy-target .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "deploy_target=$(DEPLOY_TARGET)" --var "apache_base_path=$(GIT_BRANCH)" $< > $@

scripts/00-$(GIT_BRANCH).conf: scripts/00-branch.mako-dot-conf .build-artefacts/last-git-branch .build-artefacts/python-venv/bin/mako-render
	.build-artefacts/python-venv/bin/mako-render --var "git_branch=$(GIT_BRANCH)" $< > $@

.build-artefacts/last-git-branch::
	mkdir -p $(dir $@)
	test $(GIT_BRANCH) != $(GIT_LAST_BRANCH) && echo $(GIT_BRANCH) > .build-artefacts/last-git-branch || :

.build-artefacts/last-api-url::
	mkdir -p $(dir $@)
	test $(API_URL) != $(LAST_API_URL) && echo $(API_URL) > .build-artefacts/last-api-url || :

.build-artefacts/last-apache-base-path::
	mkdir -p $(dir $@)
	test $(APACHE_BASE_PATH) != $(LAST_APACHE_BASE_PATH) && echo $(APACHE_BASE_PATH) > .build-artefacts/last-apache-base-path || :

.build-artefacts/last-apache-base-directory::
	mkdir -p $(dir $@)
	test $(APACHE_BASE_DIRECTORY) != $(LAST_APACHE_BASE_DIRECTORY) && echo $(APACHE_BASE_DIRECTORY) > .build-artefacts/last-apache-base-directory || :

.build-artefacts/last-deploy-target::
	mkdir -p $(dir $@)
	test $(DEPLOY_TARGET) != $(LAST_DEPLOY_TARGET) && echo $(DEPLOY_TARGET) > .build-artefacts/last-deploy-target || :

.build-artefacts/ol3:
	git clone https://github.com/openlayers/ol3.git $@

.build-artefacts/bootstrap:
	git clone https://github.com/twbs/bootstrap.git $@ && cd .build-artefacts/bootstrap && git checkout v3.0.0

.build-artefacts/fastclick:
	git clone https://github.com/ftlabs/fastclick.git $@ && cd .build-artefacts/fastclick && git checkout v1.0.0

.build-artefacts/externs/angular.js:
	mkdir -p $(dir $@)
	wget -O $@ https://raw.github.com/angular/angular.js/v1.2.9/closure/angular.js
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

.PHONY: clean
clean:
	rm -f .build-artefacts/app.js
	rm -f .build-artefacts/fastclick.min.js
	rm -f .build-artefacts/MGRS.min.js
	rm -f .build-artefacts/js-files
	rm -rf .build-artefacts/annotated
	rm -f src/deps.js
	rm -f src/style/app.css
	rm -f src/TemplateCacheModule.js
	rm -f src/lib/fastclick.js
	rm -rf prd


