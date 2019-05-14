define applypatches
    git apply --directory=src/lib scripts/fastclick.patch;
	git apply --directory=src/lib scripts/slipjs.patch;
endef

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
	curl -q -o $@/polyfill.js 'https://cdn.polyfill.io/v2/polyfill.js?features=URL,Array.isArray,requestAnimationFrame,Element.prototype.classList,Object.assign&flags=always,gated&unknown=polyfill'
	curl -q -o $@/polyfill.min.js 'https://cdn.polyfill.io/v2/polyfill.min.js?features=URL,Array.isArray,requestAnimationFrame,Element.prototype.classList,Object.assign&flags=always,gated&unknown=polyfill'

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

# This should be run once when starting working
.PHONY: init-submodules
init-submodules:
	git config --global status.submoduleSummary true
	git config --global submodule.recurse true
	git submodule init
	git submodule update

.PHONY: build-cesium
build-cesium:
	$(MAKE) -C libs build-cesium

.PHONY: install-cesium
install-cesium: build-cesium
	rm -r src/lib/Cesium; \
	cp -r libs/cesium/Build/CesiumUnminified src/lib/Cesium; \
	cp libs/cesium/Build/Cesium/Cesium.js src/lib/Cesium.min.js; \
	$(call moveto,libs/cesium/Build/Cesium/Workers/*.js,src/lib/Cesium/Workers/,'.js','.min.js') \
	$(call moveto,libs/cesium/Build/Cesium/ThirdParty/Workers/*.js,src/lib/Cesium/ThirdParty/Workers/,'.js','.min.js')

.PHONY: build-ol-cesium
build-ol-cesium: build-openlayers
	$(MAKE) -C libs build-ol-cesium

.PHONY: install-ol-cesium
install-ol-cesium: build-ol-cesium
	cp libs/ol-cesium/dist/olcesium.js src/lib/olcesium.js; \
	cp libs/ol-cesium/dist/olcesium-debug.js src/lib/olcesium-debug.js;

.PHONY: build-openlayers
build-openlayers:
	$(MAKE) -C libs build-openlayers

.PHONY: install-openlayers
install-openlayers: build-openlayers
	cp libs/openlayers/build/legacy/ol.js src/lib/ol.js; \
	cp libs/openlayers/build/legacy/ol.js.map src/lib/ol.js.map;

.PHONY: clean-libs
clean-libs:
	$(MAKE) -C libs clean

.PHONY: build-libs
build-libs:
	$(MAKE) -C libs all

.PHONY: install-libs
install-libs: install-cesium \
              install-openlayers \
              install-ol-cesium
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


