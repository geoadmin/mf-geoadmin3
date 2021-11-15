.PHONY: debug
debug: showVariables \
	.build-artefacts/devlibs \
	src/deps.js \
	src/style/app.css \
	src/index.html \
	appconfig \
	src/mobile.html \
	src/embed.html \
	src/404.html \
	src/manifest.json



.PHONY: translate
translate:
	${PYTHON_CMD} scripts/translation2json.py \
            --files $(TRANSLATE_CSV_FILES) \
            --languages "$(LANGUAGES)" \
            --empty-json-file $(TRANSLATE_EMPTY_JSON) \
            --output-folder $(TRANSLATE_OUTPUT)

define buildpage
	${PYTHON_CMD} ${MAKO_CMD} \
		--var "device=$1" \
		--var "mode=$2" \
		--var "version=$3" \
		--var "versionslashed=$4" \
		--var "s3basepath"="$5" \
		--var "git_commit_short=$(GIT_COMMIT_SHORT)" \
		--var "apache_base_path=$(APACHE_BASE_PATH)" \
		--var "tech_suffix=$(TECH_SUFFIX)" \
		--var "api_url=$(API_URL)" \
		--var "config_url=$(CONFIG_URL)" \
		--var "config_tech_url=$(CONFIG_TECH_URL)" \
		--var "api_tech_url=$(API_TECH_URL)" \
		--var "alti_url=$(ALTI_URL)" \
		--var "alti_tech_url=$(ALTI_TECH_URL)" \
		--var "feedback_url=$(FEEDBACK_URL)" \
		--var "feedback_tech_url=$(FEEDBACK_TECH_URL)" \
		--var "print_url=$(PRINT_URL)" \
		--var "print_tech_url=$(PRINT_TECH_URL)" \
		--var "proxy_url=$(PROXY_URL)" \
		--var "public_url=$(PUBLIC_URL)" \
		--var "public_tech_url=$(PUBLIC_TECH_URL)" \
		--var "qrcode_url=$(QRCODE_URL)" \
		--var "qrcode_tech_url=$(QRCODE_TECH_URL)" \
		--var "qrcode_path=$(QRCODE_PATH)" \
		--var "shop_url=$(SHOP_URL)" \
		--var "shop_tech_url=$(SHOP_TECH_URL)" \
		--var "wms_url=$(WMS_URL)" \
		--var "wms_tech_url=$(WMS_TECH_URL)" \
		--var "wmts_url=$(WMTS_URL)" \
		--var "wmts_tech_url=$(WMTS_TECH_URL)" \
		--var "terrain_url=$(TERRAIN_URL)" \
		--var "terrain_tech_url=$(TERRAIN_TECH_URL)" \
		--var "vectortiles_url=$(VECTORTILES_URL)" \
		--var "vectortiles_tech_url=$(VECTORTILES_TECH_URL)" \
		--var "default_topic_id=$(DEFAULT_TOPIC_ID)" \
		--var "translation_fallback_code=$(TRANSLATION_FALLBACK_CODE)" \
		--var "languages=$(LANGUAGES)" \
		--var "default_extent"="$(DEFAULT_EXTENT)" \
		--var "default_resolution"="$(DEFAULT_RESOLUTION)" \
		--var "default_level_of_detail"="$(DEFAULT_LEVEL_OF_DETAIL)" \
		--var "resolutions"="$(RESOLUTIONS)" \
		--var "level_of_details"="$(LEVEL_OF_DETAILS)" \
		--var "default_elevation_model=${DEFAULT_ELEVATION_MODEL}" \
		--var "default_terrain=$(DEFAULT_TERRAIN)" \
		--var "admin_url_regexp=$(ADMIN_URL_REGEXP)" \
		--var "public_url_regexp=$(PUBLIC_URL_REGEXP)" \
		--var "href_regexp=$(HREF_REGEXP)" \
		--var "default_epsg"="$(DEFAULT_EPSG)" \
		--var "default_epsg_extend"="$(DEFAULT_EPSG_EXTEND)" \
		--var "tilegrid_origin"="$(TILEGRID_ORIGIN)" \
		--var "tilegrid_resolutions"="$(TILEGRID_RESOLUTIONS)" \
		--var "tilegrid_wmts_dflt_min_res"="$(TILEGRID_WMTS_DFLT_MIN_RES)" \
		--var "staging"="$(STAGING)" $< > $@
endef

src/deps.js: $(SRC_JS_FILES) ${PYTHON_VENV}
	${PYTHON_CMD} node_modules/google-closure-library/closure/bin/build/depswriter.py \
	    --root_with_prefix="src/components components" \
	    --root_with_prefix="src/js js" \
	    --output_file=tmp
	cat node_modules/google-closure-library/closure/goog/base.js tmp > $@
	rm -f tmp

src/style/app.css: $(SRC_LESS_FILES)
	${LESSC} $(LESS_PARAMETERS) src/style/app.less $@
	${POSTCSS} $@ --use autoprefixer --replace --no-map

src/index.html: src/index.mako.html appconfig \
	    ${MAKO_CMD} \
	    ${MAKO_LAST_VARIABLES}
	$(call buildpage,desktop,dev,,,$(S3_SRC_BASE_PATH))

src/manifest.json: src/manifest.mako.json
	${PYTHON_CMD} ${MAKO_CMD} \
	    --var "s3basepath"="$(S3_SRC_BASE_PATH)" $< > $@

src/mobile.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    ${MAKO_LAST_VARIABLES}
	$(call buildpage,mobile,dev,,,$(S3_SRC_BASE_PATH),)

src/embed.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    ${MAKO_LAST_VARIABLES}
	$(call buildpage,embed,dev,,,$(S3_SRC_BASE_PATH))

src/TemplateCacheModule.js: src/TemplateCacheModule.mako.js \
	    ${SRC_COMPONENTS_PARTIALS_FILES} \
	    ${MAKO_CMD}
	${PYTHON_CMD} ${MAKO_CMD} \
	    --var "partials=$(shell echo "${SRC_COMPONENTS_PARTIALS_FILES}" | sed 's/^src\///' | sed 's/ src\// /g')" \
	    --var "basedir=src" $< > $@

