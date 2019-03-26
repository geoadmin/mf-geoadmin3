# Include definition of variables that configure
# build and deploy
-include mk/config.mk

# Include the help target (what's printed when you type just
# make on command line)
-include mk/help.mk

.PHONY: all
all: showVariables lint debug release dist apache testdebug testrelease fixrights

.PHONY: user
user: env .build-artefacts/requirements.timestamp
	make appconfig && source $(USER_SOURCE) && make src/config.dev.mako all

.PHONY: build
build: showVariables .build-artefacts/devlibs .build-artefacts/requirements.timestamp $(SRC_JS_FILES) appconfig apache debug release dist


.PHONY: .build-artefacts/nvm-version
.build-artefacts/nvm-version: .build-artefacts/last-nvm-version
ifneq ($(LAST_NVM_VERSION),$(NVM_VERSION))
	curl -o- https://raw.githubusercontent.com/creationix/nvm/$(NVM_VERSION)/install.sh | bash
endif

.PHONY: .build-artefacts/node-version
.build-artefacts/node-version: .build-artefacts/last-node-version
ifneq ($(LAST_NODE_VERSION),$(NODE_VERSION))
	source $(HOME)/.bashrc && source $(NVM_DIR)/nvm.sh && nvm install $(NODE_VERSION)
endif

.PHONY: env
env: .build-artefacts/nvm-version .build-artefacts/node-version
	source $(HOME)/.bashrc && source ${NVM_DIR}/nvm.sh && nvm use $(NODE_VERSION)

.PHONY: dev
dev:
	make build

.PHONY: int
int:
	make build

.PHONY: prod
prod:
	make build

# Include the handling of last values for specific variables
# (everything like .build-artefacts/last-VARNAME
-include mk/last.mk

# Include targets to create configuration files of the
# backend services (aka layerConfig)
-include mk/serviceconfig.mk

# Include targets used to get a working application in 
# src/
-include mk/debug.mk

# Include targets that create a compiled and minified
# build of the application, ready to deploy
-include mk/release.mk

# Include the targets that bundle prd/ and src/ to dist/...
# in way that can be copy-pasted to and moved around in s3
# without requiring to modify files
-include mk/dist.mk

# Include targets that handle deploying (i.e. copying to
# and moving around stuff in s3, with the help of s3manage.py)
-include mk/deploy.mk

# Everything concerning installation and update of 
# external libraries
-include mk/libs.mk

# Include the cleanup stuff
-include mk/clean.mk

.PHONY: lint
lint: .build-artefacts/devlibs .build-artefacts/requirements.timestamp $(SRC_JS_FILES) linttest lintpy
	${ES_LINT} $(SRC_JS_FILES) --fix

linttest: .build-artefacts/devlibs .build-artefacts/requirements.timestamp
	${ES_LINT} test/specs/ --fix

lintpy: .build-artefacts/requirements.timestamp ${FLAKE8_CMD} ${PYTHON_FILES}
	${AUTOPEP8_CMD} --in-place --aggressive --aggressive --verbose --max-line-lengt=110 $(PYTHON_FILES)

.PHONY: testdebug
testdebug: .build-artefacts/app-whitespace.js test/karma-conf-debug.js
	PHANTOMJS_BIN="$(subst ",\",${PHANTOMJS})" ${KARMA} start test/karma-conf-debug.js;
	cat .build-artefacts/coverage/coverage.txt; echo;
	echo "A complete report is available at ${E2E_TARGETURL}${APACHE_BASE_PATH}/src/coverage/index.html"

.PHONY: testrelease
testrelease: prd/lib/build.js test/karma-conf-release.js .build-artefacts/devlibs
	PHANTOMJS_BIN="$(subst ",\",${PHANTOMJS})" ${KARMA} start test/karma-conf-release.js;

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


define compilejs
	java -jar ${CLOSURE_COMPILER} \
		src/lib/$1.js \
		--compilation_level SIMPLE_OPTIMIZATIONS \
		--js_output_file  src/lib/$1.min.js;
endef


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

# This should be run once when starting to work on mvt_clean
# or any descendant branch
.PHONY: init-submodules
init-submodules:
	git config --global status.submoduleSummary true
	git config --global submodule.recurse true
	git submodule init
	git submodule update

.PHONY: build-cesium
build-cesium:
	$(MAKE) -C libs build-cesium;

.PHONY: build-olcesium
build-olcesiums: build-openlayers
	$(MAKE) -C libs build-ol-cesium; \

.PHONY: build-olms
build-olms:
	$(MAKE) -C libs build-ol-mapbox-style; \

.PHONY: build-openlayers
build-openlayers:
	$(MAKE) -C libs build-openlayers

.PHONY: clean-libs
clean-libs:
	$(MAKE) -C libs clean

.PHONY: build-libs
build-libs:
	$(MAKE) -C libs all

.PHONY: install-libs
install-libs: build-libs
	# Cesium
	rm -r src/lib/Cesium; \
	cp -r libs/cesium/Build/CesiumUnminified src/lib/Cesium; \
	cp libs/cesium/Build/Cesium/Cesium.js src/lib/Cesium.min.js; \
	$(call moveto,libs/cesium/Build/Cesium/Workers/*.js,src/lib/Cesium/Workers/,'.js','.min.js') \
	$(call moveto,libs/cesium/Build/Cesium/ThirdParty/Workers/*.js,src/lib/Cesium/ThirdParty/Workers/,'.js','.min.js') \
	# OL-Cesium (incorporate OpenLayers)
	cat libs/openlayers/build/legacy/ol.js libs/ol-cesium/dist/olcesium.js > src/lib/olcesium.js; \
	cat libs/openlayers/build/legacy/ol.js libs/ol-cesium/dist/olcesium-debug.js > src/lib/olcesium-debug.js; \
	# OL-mapbox-style
	cp libs/ol-mapbox-style/dist/olms-debug.js src/lib/olms.js

.build-artefacts/app.js: .build-artefacts/js-files
	mkdir -p $(dir $@)
	java -jar ${CLOSURE_COMPILER} $(SRC_JS_FILES_FOR_COMPILER) \
	    --compilation_level SIMPLE_OPTIMIZATIONS \
	    --jscomp_error checkVars \
	    --externs externs/ol.js \
	    --externs externs/olcesium.js \
	    --externs externs/olms.js \
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
	    --js_output_file tmp
	cat node_modules/google-closure-library/closure/goog/base.js tmp > $@
	rm -f tmp

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

