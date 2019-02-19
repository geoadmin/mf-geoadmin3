define applypatches
    git apply --directory=src/lib scripts/fastclick.patch;
	git apply --directory=src/lib scripts/slipjs.patch;
endef


.build-artefacts/openlayers:
	git clone https://github.com/geoblocks/legacylib.git $@

.build-artefacts/olcesium:
	git clone https://github.com/openlayers/ol-cesium.git $@

.build-artefacts/cesium:
	git clone https://github.com/camptocamp/cesium.git $@

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
	curl -q -o $@/polyfill.js 'https://cdn.polyfill.io/v2/polyfill.js?features=URL,Array.isArray,requestAnimationFrame,Element.prototype.classList&flags=always,gated&unknown=polyfill'
	curl -q -o $@/polyfill.min.js 'https://cdn.polyfill.io/v2/polyfill.min.js?features=URL,Array.isArray,requestAnimationFrame,Element.prototype.classList&flags=always,gated&unknown=polyfill'


.PHONY: cesium
cesium: .build-artefacts/cesium
	cd .build-artefacts/cesium; \
	git fetch --all; \
	git checkout $(CESIUM_VERSION); \
	npm install; \
	npm run combineRelease; \
	npm run minifyRelease; \
	rm -r ../../src/lib/Cesium; \
	cp -r Build/CesiumUnminified ../../src/lib/Cesium; \
	cp Build/Cesium/Cesium.js ../../src/lib/Cesium.min.js; \
	$(call moveto,Build/Cesium/Workers/*.js,../../src/lib/Cesium/Workers/,'.js','.min.js') \
	$(call moveto,Build/Cesium/ThirdParty/Workers/*.js,../../src/lib/Cesium/ThirdParty/Workers/,'.js','.min.js')

openlayers: .build-artefacts/openlayers
	cd .build-artefacts/openlayers/; \
	npm i; cd ol5; \
	git fetch; git reset --hard; \
	git checkout $(GEOBLOCKS_LEGACYLIB_VERSION); \
	sed -i 'sY"ol": ".*"Y"ol": "https://api.github.com/repos/openlayers/openlayers/tarball/$(OL_VERSION)"Y' package.json; \
	npm install; \
	npm run build  # having tons of jsdoc parsing errors is normal

.PHONY: olcesium
olcesium:  openlayers .build-artefacts/olcesium
	if ! [ -f ".build-artefacts/cesium/Build/Cesium/Cesium.js" ]; then make cesium; else echo 'Cesium already built'; fi; \
	cd .build-artefacts/olcesium; \
	git fetch --all; git reset --hard; \
	git checkout $(OL_CESIUM_VERSION); \
	cp -r ../../olcesium-plugin/Ga* src/olcs/; \
	cp ../../olcesium-plugin/index.library.js src/; \
	npm install; \
	npm run build-library; \
	cat ../openlayers/ol5/build/ol.js dist/olcesium.js > ../../src/lib/olcesium.js; \
	npm run build-library-debug; \
	cat ../openlayers/ol5/build/ol-debug.js dist/olcesium-debug.js > ../../src/lib/olcesium-debug.js; \


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


.PHONY: libs
libs:
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


