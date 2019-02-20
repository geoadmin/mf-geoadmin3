BUILD_BASE_DIR = dist
BUILD_DIR = $(BUILD_BASE_DIR)
RELEASE_DIR = prd
COPY_FILES = $(BUILD_DIR)/index.html $(BUILD_DIR)/info.json $(BUILD_DIR)/checker $(BUILD_DIR)/favicon.ico \
						 $(BUILD_DIR)/robots.txt $(BUILD_DIR)/robots_prod.txt $(BUILD_DIR)/404.html $(BUILD_DIR)/embed.html \
						 $(BUILD_DIR)/geoadmin.$(GIT_COMMIT_SHORT).appcache $(BUILD_DIR)/mobile.html 

CACHES = $(wildcard $(RELEASE_DIR)/*.appcache)
COPY_FILES += $(patsubst $(RELEASE_DIR)/%.appcache,$(BUILD_DIR)/%.appcache,$(CACHES))

$(BUILD_DIR)/:
	    mkdir -p $@

$(BUILD_DIR)/index.html: prd/index.html
$(BUILD_DIR)/info.json: prd/info.json
$(BUILD_DIR)/checker: prd/checker
$(BUILD_DIR)/favicon.ico: prd/favicon.ico
$(BUILD_DIR)/robots.txt: prd/robots.txt
$(BUILD_DIR)/robots_prod.txt: prd/robots_prod.txt
$(BUILD_DIR)/404.html: prd/404.html
$(BUILD_DIR)/embed.html: prd/embed.html
$(BUILD_DIR)/mobile.html: prd/mobile.html
$(BUILD_DIR)/geoadmin.%.appcache:  prd/geoadmin.%.appcache
		cp -f $< $@

$(BUILD_DIR)/src: $(BUILD_DIR)/
	@echo "Sync src/ dir to dist/"
	rsync -rupE src $(BUILD_DIR)/
	rsync -rupE prd/locales $(BUILD_DIR)/src/$(GIT_COMMIT_SHORT)

$(BUILD_DIR)/$(GIT_COMMIT_SHORT): $(BUILD_DIR)/
	@echo "Sync prd/ dir to dist/$(GIT_COMMIT_SHORT)"
	#rsync -rupE prd/lib prd/img prd/locales prd/style prd/cache/   $(BUILD_DIR)/$(GIT_COMMIT_SHORT)/
	rsync -rupE prd/lib prd/img prd/locales prd/style   $(BUILD_DIR)/$(GIT_COMMIT_SHORT)/

# Or simply symlink?
#$(BUILD_DIR)/src: $(BUILD_DIR)
#	ln -s  $@  src

$(BUILD_DIR)/%: $(BUILD_DIR)
		cp -f $< $@

.PHONY: dist
dist: distclean $(BUILD_DIR)/ $(COPY_FILES) $(BUILD_DIR)/$(GIT_COMMIT_SHORT) $(BUILD_DIR)/src

.PHONY: serve
serve: $(PYTHON_CMD)
		$(PYTHON_CMD) scripts/server.py -p $(PORT) -d dist

distclean:
	@echo "remove $(BUILD_DIR)"
	rm -rf $(BUILD_DIR)


