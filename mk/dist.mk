# ==================================================================
# This Makefile contains all targets that are necessary to create
# a bundle with a minified build (from prd/) and the corresponding
# source (from src/). Those parts from the build that should be under
# cache control are copied to a subdirectory named with the git commit
# hash, the rest is copied to the root of dist/

BUILD_DIR = dist
RELEASE_DIR = prd

# Make sure dist dir exists
$(BUILD_DIR)/:
	    mkdir -p $@

# Copy non cache-controlled files from build to dist
NON_CACHE_FILES = $(BUILD_DIR)/index.html \
			 $(BUILD_DIR)/info.json \
			 $(BUILD_DIR)/checker \
			 $(BUILD_DIR)/robots.txt \
			 $(BUILD_DIR)/robots_prod.txt \
			 $(BUILD_DIR)/404.html \
			 $(BUILD_DIR)/embed.html \
			 $(BUILD_DIR)/geoadmin.$(GIT_COMMIT_SHORT).appcache \
			 $(BUILD_DIR)/mobile.html \
			 $(BUILD_DIR)/manifest.json

$(BUILD_DIR)/%: $(RELEASE_DIR)/%
	@echo "Copying $< to $@ (matched file: $*)"
	cp -f $< $@

# For some reason, it's doesn't work if favicon.ico is added
# to the list above, therefore separate rule
$(BUILD_DIR)/favicon.ico: prd/favicon.ico
	@echo "Copying $< to $@"
	cp -f $< $@

# Copy current status from source to dist
$(BUILD_DIR)/src: $(BUILD_DIR)/
	@echo "Sync src/ dir to dist/"
	rsync -rupE src $(BUILD_DIR)/
	rsync -rupE prd/locales $(BUILD_DIR)/src/$(GIT_COMMIT_SHORT)

# Copy cache-controlled files from build to dist/<sha>/
$(BUILD_DIR)/$(GIT_COMMIT_SHORT): $(BUILD_DIR)/
	@echo "Sync prd/ dir to dist/$(GIT_COMMIT_SHORT)"
	rsync -rupE prd/lib prd/img prd/locales prd/style   $(BUILD_DIR)/$(GIT_COMMIT_SHORT)/

.PHONY: dist
dist: distclean $(BUILD_DIR)/ $(NON_CACHE_FILES) $(BUILD_DIR)/$(GIT_COMMIT_SHORT) $(BUILD_DIR)/src

.PHONY: serve
serve: $(PYTHON_CMD)
		$(PYTHON_CMD) scripts/server.py -p $(PORT) -d dist

distclean:
	@echo "remove $(BUILD_DIR)"
	rm -rf $(BUILD_DIR)


