prd/robots.txt: scripts/robots.mako-dot-txt .build-artefacts/last-version
	mkdir -p $(dir $@)
	${PYTHON_CMD} ${MAKO_CMD} \
	    --var "version=$(VERSION)" \
	    --var "deploy_target=dev" $< > $@

prd/robots_prod.txt: scripts/robots.mako-dot-txt .build-artefacts/last-version
	mkdir -p $(dir $@)
	${PYTHON_CMD} ${MAKO_CMD} \
	    --var "version=$(VERSION)" \
	    --var "deploy_target=prod" $< > $@

prd/lib/: src/lib/d3.min.js \
          src/lib/bootstrap-datetimepicker.min.js  \
          src/lib/IE9Fixes.js \
          src/lib/jquery.xdomainrequest.min.js \
          src/lib/Cesium.min.js \
          src/lib/ol.js \
          src/lib/olcesium.js
	mkdir -p $@
	cp -rf  $^ $@

prd/lib/Cesium/: src/lib/Cesium/Assets
	mkdir -p $@
	cp -rf  $^ $@

prd/lib/Cesium/Cesium.js: prd/lib/Cesium/ src/lib/Cesium/Cesium.js
	cp -rf src/lib/Cesium/Cesium.js $@

prd/lib/Cesium/Workers/: src/lib/Cesium/Workers/*.min.js
	mkdir -p $@; \
	$(call moveto,$^,$@,'.min.js','.js')

prd/lib/Cesium/ThirdParty/Workers/: src/lib/Cesium/ThirdParty/Workers/*.min.js
	mkdir -p $@; \
	$(call moveto,$^,$@,'.min.js','.js')

prd/lib/build.js: src/lib/polyfill.min.js \
                  src/lib/jquery.min.js \
                  src/lib/slip.min.js \
                  src/lib/bootstrap.min.js \
                  src/lib/moment-with-customlocales.min.js \
                  src/lib/typeahead.jquery.min.js \
                  src/lib/angular.min.js \
                  src/lib/proj4js-compressed.js \
                  src/lib/EPSG21781.js \
                  src/lib/EPSG2056.js \
                  src/lib/EPSG32631.js \
                  src/lib/EPSG32632.js \
                  src/lib/ol.js \
                  src/lib/olcesium-debug.js \
                  src/lib/angular-translate.min.js \
                  src/lib/angular-translate-loader-static-files.min.js \
                  src/lib/fastclick.min.js \
                  src/lib/localforage.min.js \
                  src/lib/filesaver.min.js \
                  src/lib/gyronorm.complete.min.js \
                  .build-artefacts/app.js
	mkdir -p $(dir $@)
	cat $^ | sed 's/^\/\/[#,@] sourceMappingURL=.*\.map//' > $@

prd/style/app.css: $(SRC_LESS_FILES)
	mkdir -p $(dir $@)
	${LESSC} $(LESS_PARAMETERS) --clean-css src/style/app.less $@
	${POSTCSS} $@ --use autoprefixer --replace --no-map


# We have two versionis of this file
# geoadmin.<version>.appcache for use within the snapshot
# no_snapshot_geoadmin.<version>.appcache which will be renamed into the former when activating
# the snaphot (i.e. copying this file, index.html to the root)
prd/geoadmin.%.appcache: src/geoadmin.mako.appcache \
			${MAKO_CMD} \
			.build-artefacts/last-version
	rm -f prd/*.appcache
	mkdir -p $(dir $@);
	${PYTHON_CMD} ${MAKO_CMD} \
	    --var "version=$(VERSION)" \
	    --var "git_branch=$(GIT_BRANCH)" \
	    --var "git_commit_short=$(GIT_COMMIT_SHORT)" \
	    --var "deploy_target=$(DEPLOY_TARGET)" \
	    --var "apache_base_path=$(APACHE_BASE_PATH)" \
	    --var "languages=$(LANGUAGES)" \
	    --var "s3basepath=$(S3_BASE_PATH)" $< > $@
	sed -e 's/\/$(subst /,\/,$(GIT_BRANCH))\/$(VERSION)//g'  $@ >  prd/no_snapshot_geoadmin.$*.appcache


prd/info.json: src/info.mako.json
	${PYTHON_CMD} ${MAKO_CMD} \
		--var "version=$(VERSION)" \
		--var "user_name=$(USER_NAME)" \
		--var "git_branch=$(DEPLOY_GIT_BRANCH)" \
		--var "git_commit_short=$(GIT_COMMIT_SHORT)" \
		--var "git_commit_date=$(GIT_COMMIT_DATE)" \
		--var "git_commit_hash=$(GIT_COMMIT_HASH)" \
		--var "build_date=$(CURRENT_DATE)"  $< > $@


prd/index.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    ${MAKO_LAST_VARIABLES_PROD}
	mkdir -p $(dir $@)
	$(call buildpage,desktop,prod,$(GIT_COMMIT_SHORT),$(GIT_COMMIT_SHORT)/,$(S3_BASE_PATH))
	${HTMLMIN_CMD} $@ $@

prd/mobile.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    ${MAKO_LAST_VARIABLES_PROD}
	mkdir -p $(dir $@)
	$(call buildpage,mobile,prod,$(GIT_COMMIT_SHORT),$(GIT_COMMIT_SHORT)/,$(S3_BASE_PATH))
	${HTMLMIN_CMD} $@ $@

prd/embed.html: src/index.mako.html \
	    ${MAKO_CMD} \
	    ${MAKO_LAST_VARIABLES_PROD}
	mkdir -p $(dir $@)
	$(call buildpage,embed,prod,$(GIT_COMMIT_SHORT),$(GIT_COMMIT_SHORT)/,$(S3_BASE_PATH))
	${HTMLMIN_CMD} $@ $@

prd/404.html: src/404.html
	mkdir -p $(dir $@)
	${HTMLMIN_CMD} $@ $<

prd/img/: src/img/*
	mkdir -p $@
	cp -R $^ $@
	cp -f $@/favicon.ico $@/../

prd/style/font-awesome-4.5.0/font/: src/style/font-awesome-4.5.0/font/*
	mkdir -p $@
	cp $^ $@

prd/locales/: src/locales/*.json
	mkdir -p $@
	cp $^ $@

prd/checker: src/checker
	mkdir -p $(dir $@)
	cp $< $@


.PHONY: release
release: showVariables \
         .build-artefacts/devlibs \
         prd/lib/ \
         prd/lib/Cesium/ \
         prd/lib/Cesium/Cesium.js \
         prd/lib/Cesium/Workers/ \
         prd/lib/Cesium/ThirdParty/Workers/ \
         prd/lib/build.js \
         prd/style/app.css \
         prd/geoadmin.$(GIT_COMMIT_SHORT).appcache \
         prd/index.html \
         prd/mobile.html \
         prd/embed.html \
         prd/404.html \
         prd/img/ \
         prd/style/font-awesome-4.5.0/font/ \
         prd/locales/ \
         prd/checker \
         configs/ \
         appconfig \
         prd/info.json \
         prd/robots.txt \
         prd/robots_prod.txt
