

define cachelastvariable
	mkdir -p $(dir $1)
	test "$2" != "$3" && \
	    echo "$2" > .build-artefacts/last-$4 || :
endef

 
${PYTHON_VENV}: .build-artefacts/last-pypi-url
	mkdir -p .build-artefacts
	virtualenv --no-site-packages $@
	${PIP_CMD} install --index-url ${PYPI_URL} -U pip setuptools


.build-artefacts/last-version::
	$(call cachelastvariable,$@,$(VERSION),$(LAST_VERSION),version)

.build-artefacts/last-git-commit-hash::
	$(call cachelastvariable,$@,$(GIT_COMMIT_HASH),$(LAST_GIT_COMMIT_HASH),git-commit-hash)

.build-artefacts/last-git-commit-short::
	$(call cachelastvariable,$@,$(GIT_COMMIT_SHORT),$(LAST_GIT_COMMIT_SHORT),git-commit-hash)

.build-artefacts/last-api-url::
	$(call cachelastvariable,$@,$(API_URL),$(LAST_API_URL),api-url)

.build-artefacts/last-config-url::
	$(call cachelastvariable,$@,$(CONFIG_URL),$(LAST_CONFIG_URL),config-url)

.build-artefacts/last-alti-url::
	$(call cachelastvariable,$@,$(ALTI_URL),$(LAST_ALTI_URL),alti-url)

.build-artefacts/last-shop-url::
	$(call cachelastvariable,$@,$(SHOP_URL),$(LAST_SHOP_URL),shop-url)

.build-artefacts/last-wms-url::
	$(call cachelastvariable,$@,$(WMS_URL),$(LAST_WMS_URL),wms-url)

.build-artefacts/last-public-url::
	$(call cachelastvariable,$@,$(PUBLIC_URL),$(LAST_PUBLIC_URL),public-url)

.build-artefacts/last-print-url::
	$(call cachelastvariable,$@,$(PRINT_URL),$(LAST_PRINT_URL),print-url)

.build-artefacts/last-proxy-url::
	$(call cachelastvariable,$@,$(PROXY_URL),$(LAST_PROXY_URL),proxy-url)

.build-artefacts/last-apache-base-path::
	$(call cachelastvariable,$@,$(APACHE_BASE_PATH),$(LAST_APACHE_BASE_PATH),apache-base-path)

.build-artefacts/last-deploy-target::
	$(call cachelastvariable,$@,$(DEPLOY_TARGET),$(LAST_DEPLOY_TARGET),deploy-target)

.build-artefacts/last-apache-base-directory::
	$(call cachelastvariable,$@,$(APACHE_BASE_DIRECTORY),$(LAST_APACHE_BASE_DIRECTORY),apache-base-directory)

.build-artefacts/last-wms-url::
	$(call cachelastvariable,$@,$(WMS_URL),$(LAST_WMS_URL),wms-url)

.build-artefacts/last-wmts-url::
	$(call cachelastvariable,$@,$(WMTS_URL),$(LAST_WMTS_URL),wmts-url)

.build-artefacts/last-terrain-url::
	$(call cachelastvariable,$@,$(TERRAIN_URL),$(LAST_TERRAIN_URL),terrain-url)

.build-artefacts/last-vectortiles-url::
	$(call cachelastvariable,$@,$(VECTORTILES_URL),$(LAST_VECTORTILES_URL),vectortiles-url)

.build-artefacts/last-pypi-url::
	$(call cachelastvariable,$@,$(PYPI_URL),$(LAST_PYPI_URL),pypi-url)

.build-artefacts/last-nvm-version::
	$(call cachelastvariable,$@,$(NVM_VERSION),$(LAST_NVM_VERSION),nvm-version)

.build-artefacts/last-node-version::
	$(call cachelastvariable,$@,$(NODE_VERSION),$(LAST_NODE_VERSION),node-version)

.build-artefacts/last-layersconfig-version::
	$(call cachelastvariable,$@,$(LAYERSCONFIG_VERSION),$(LAST_LAYERSCONFIG_VERSION),layersconfig-version)

#.build-artefacts/last-GIT_COMMIT_HASH.$(GIT_COMMIT_HASH):
#	@rm -f .build-artefacts/last-GIT_COMMIT_HASH.*
#	touch $@
 
#.build-artefacts/last-GIT_COMMIT_SHORT.$(GIT_COMMIT_SHORT):
#	@rm -f .build-artefacts/last-GIT_COMMIT_SHORT.*
#	touch $@

