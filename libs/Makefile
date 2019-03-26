###################################################
#                 OL-Mapbox style
###################################################

# This has just to be done if the submodule
# has never been checked out before
ol-mapbox-style/.git:
	git submodule init && git submodule update

# Steps to build olms.js and olms-debug.js
ol-mapbox-style/node_modules/: ol-mapbox-style/.git
	cd ol-mapbox-style && npm install;

ol-mapbox-style/dist/olms.js: ol-mapbox-style/node_modules/
	cd ol-mapbox-style && npm run build

ol-mapbox-style/dist/olms-debug.js: ol-mapbox-style/node_modules/
	cd ol-mapbox-style && webpack-cli --mode=development --config ./webpack.config.olms.js --output-filename olms-debug.js

.PHONY: build-ol-mapbox-style
build-ol-mapbox-style: ol-mapbox-style/dist/olms.js \
	ol-mapbox-style/dist/olms-debug.js

.PHONY: clean-ol-mapbox-style
clean-ol-mapbox-style:
	@echo "Cleaning ol-mapbox-style..."
	rm -rf ol-mapbox-style/node_modules/ && \
	rm -rf ol-mapbox-style/dist/ 


###################################################
#                CesiumJS
###################################################

# This has just to be done if the submodule
# has never been checked out before
cesium/.git:
	git submodule init && git submodule update

.PHONY: build-cesium
build-cesium: cesium/.git
	cd cesium; \
	npm install; \
	npm run combineRelease; \
	npm run minifyRelease; \
	rm -r ../../src/lib/Cesium; \
	cp -r Build/CesiumUnminified ../../src/lib/Cesium; \
	cp Build/Cesium/Cesium.js ../../src/lib/Cesium.min.js; \
	$(call moveto,Build/Cesium/Workers/*.js,../../src/lib/Cesium/Workers/,'.js','.min.js') \
	$(call moveto,Build/Cesium/ThirdParty/Workers/*.js,../../src/lib/Cesium/ThirdParty/Workers/,'.js','.min.js')

###################################################
#                OpenLayers
###################################################

# This has just to be done if the submodule
# has never been checked out before
openlayers/.git:
	git submodule init && git submodule update

build-openlayers: openlayers/.git
	cd openlayers/; \
	npm install; \
	npm run build-legacy # having tons of jsdoc parsing errors is normal
	webpack --mode=development --config config/webpack-config-legacy-build.js -o build/legacy/ol-debug.js


###################################################
#                 OL-Cesium
###################################################

# This has just to be done if the submodule
# has never been checked out before
ol-cesium/.git:
	git submodule init && git submodule update

# Steps to build olcesium.js and olcesium-debug.js
ol-cesium/node_modules/: ol-cesium/.git
	cd ol-cesium && npm install;

ol-cesium/dist/olcesium.js: ol-cesium/node_modules/
	cd ol-cesium && npm run build-library

ol-cesium/dist/olcesium-debug.js: ol-cesium/node_modules/
	cd ol-cesium && npm run build-library-debug

.PHONY: build-ol-cesium
build-ol-cesium: ol-cesium/dist/olcesium.js \
                 ol-cesium/dist/olcesium-debug.js
olcesium:  openlayers libs/olcesium/dist/
	if ! [ -f "cesium/Build/Cesium/Cesium.js" ]; then $(MAKE) build-cesium; else echo 'Cesium already built'; fi; \
	cd ol-cesium/; \
	cp -r ../../olcesium-plugin/Ga* src/olcs/; \
	cp ../../olcesium-plugin/index.library.js src/; \
	npm install; \
	npm run build-library; \
	cat ../openlayers/build/legacy/ol.js dist/olcesium.js > ../../src/lib/olcesium.js; \
	npm run build-library-debug; \
	cat ../openlayers/build/legacy/ol-debug.js dist/olcesium-debug.js > ../../src/lib/olcesium-debug.js; \



.PHONY: clean-ol-cesium
clean-ol-cesium:
	@echo "Cleaning ol-cesium..."
	rm -rf ol-cesium/node_modules/ && \
	rm -rf ol-cesium/dist/ 


# Build all libraries
.PHONY: all
all: ol-mapbox-style/dist/olms.js \
	ol-mapbox-style/dist/olms-debug.js \
	ol-cesium/dist/olcesium.js \
	ol-cesium/dist/olcesium-debug.js


clean: clean-ol-mapbox-style \
	clean-ol-cesium
	@echo "Cleanup finished!"


