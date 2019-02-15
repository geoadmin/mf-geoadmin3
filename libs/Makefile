# Steps to build olms.js and olms-debug.js
ol-mapbox-style/node_modules/:
	cd ol-mapbox-style && npm install;

ol-mapbox-style/dist/olms.js: ol-mapbox-style/node_modules/
	cd ol-mapbox-style && npm run build

ol-mapbox-style/dist/olms-debug.js: ol-mapbox-style/node_modules/
	cd ol-mapbox-style && npm run build-debug

.PHONY: build-ol-mapbox-style
build-ol-mapbox-style: ol-mapbox-style/dist/olms.js \
	ol-mapbox-style/dist/olms-debug.js

.PHONY: clean-ol-mapbox-style
clean-ol-mapbox-style:
	@echo "Cleaning ol-mapbox-style..."
	rm -rf ol-mapbox-style/node_modules/ && \
	rm -rf ol-mapbox-style/dist/ 


# Steps to build olcesium.js and olcesium-debug.js
ol-cesium/node_modules/:
	cd ol-cesium && npm install;

ol-cesium/dist/olcesium.js: ol-cesium/node_modules/
	cd ol-cesium && npm run build-library

ol-cesium/dist/olcesium-debug.js: ol-cesium/node_modules/
	cd ol-cesium && npm run build-library-debug

.PHONY: build-ol-cesium
build-ol-cesium: ol-cesium/dist/olcesium.js \
	ol-cesium/dist/olcesium-debug.js

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


