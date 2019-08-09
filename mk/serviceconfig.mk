# This file contains the targets to create a set of configuration files
# that describe the current state of the backend services, a.k.a the layerConfig
# 

# Configs
CONFIG_FILES := $(wildcard configs/**/*.json)
CONFIG_FILES += configs/services.json configs/layersconfiginfo.json
S3_UPLOAD_HEADERS = --content-encoding gzip --acl public-read --cache-control 'max-age=60' --content-type 'application/json'

configs/layersconfiginfo.json: src/layersconfiginfo.mako.json \
                               guard-LAYERSCONFIG_VERSION
	@mkdir -p $(@D)
	${PYTHON_CMD} ${MAKO_CMD} --var "version=$(VERSION)" \
	                          --var "api_url=$(API_URL)" \
	                          --var "layersconfig_version=$(LAYERSCONFIG_VERSION)" \
	                          --var "build_date=$(CURRENT_DATE)"  $< > $@


configs/: .build-artefacts/last-version \
          .build-artefacts/last-api-url \
          .build-artefacts/last-layersconfig-version \
          configs/layersconfiginfo.json \
          .build-artefacts/last-config-url \
          guard-LAYERSCONFIG_VERSION
	mkdir -p $@
	curl -s -q -o configs/services.json http:$(API_URL)/rest/services
	$(foreach lang, $(LANGS), mkdir -p $@$(lang) && curl -s --retry 3 -o configs/$(lang)/layersConfig.json http:$(API_URL)/rest/services/all/MapServer/layersConfig?lang=$(lang);)
	$(foreach topic, $(TOPICS), $(foreach lang, $(LANGS),curl -s --retry 3 -o configs/${lang}/catalog.${topic}.json http:$(API_URL)/rest/services/$(topic)/CatalogServer?lang=$(lang); ))


# Variables for the different staging.
appconfig: src/config.dev.mako src/config.int.mako src/config.prod.mako
	$(foreach target, $(TARGETS), source rc_$(shell echo $(target) | tr A-Z a-z) && make src/config.$(shell echo $(target) | tr A-Z a-z).mako ;)

src/config.%.mako: src/config.mako \
                   ${MAKO_CMD} \
                   ${MAKO_LAST_VARIABLES_PROD}
	mkdir -p $(dir $@)
	$(call buildpage,desktop,$*,$(VERSION),$(VERSION)/,$(S3_BASE_PATH))

# Upload configs to :
# - s3://mf-geoadmin3-int-dublin/configs_archive/
# - s3://mf-geoadmin3-prod-dublin/configs_archive/
PHONY: s3uploadconfigint
s3uploadconfigint: ${PYTHON_VENV}
	@echo "generating config for int..."
	source rc_int && $(MAKE) clean configs/ LAYERSCONFIG_VERSION=$(LAYERSCONFIG_VERSION)
	@echo  
	@echo "generating config for int done"
	@echo  
	@echo "uploading config to int..."
	$(foreach json, $(CONFIG_FILES), gzip -c $(json) | ${AWS_CMD} s3 cp $(S3_UPLOAD_HEADERS) - s3://$(S3_MF_GEOADMIN3_INT)/configs_archive/$(LAYERSCONFIG_VERSION)/$(json);)
	@echo  
	@echo "uploading to int done"
	@echo  
	@echo "Layers config version for int : $(LAYERSCONFIG_VERSION)"

PHONY: s3uploadconfigprod
s3uploadconfigprod: ${PYTHON_VENV}
	@echo "generating config for prod..."
	source rc_prod && $(MAKE) clean configs/ LAYERSCONFIG_VERSION=$(LAYERSCONFIG_VERSION)
	@echo  
	@echo "generating config for prod done"
	@echo  
	@echo "uploading config to prod..."
	$(foreach json, $(CONFIG_FILES), gzip -c $(json) | ${AWS_CMD} s3 cp $(S3_UPLOAD_HEADERS) - s3://$(S3_MF_GEOADMIN3_PROD)/configs_archive/$(LAYERSCONFIG_VERSION)/$(json);)
	@echo  
	@echo "uploading to prod done"
	@echo  
	@echo "Layers config version for prod : $(LAYERSCONFIG_VERSION)"

# Display current version number
s3currentconfig := $(patsubst %,s3currentconfig%,int,prod)
PHONY: $(s3currentconfig)
s3currentconfig%:
	@${AWS_CMD} s3 cp s3://$(S3_MF_GEOADMIN3_$(shell echo $(*)| tr a-z A-Z))/configs/layersconfiginfo.json - | gunzip | jq -r '"LAYERSCONFIG_VERSION=" + .layersconfig_version'

# List the various layersconfig on s3://mf-geoadmin3-(dev|int|prod)-dublin/configs_archive/<YYYYMMDDHHmmSS>/configs/
s3listconfig := $(patsubst %,s3listconfig%,dev,int,prod)
PHONY: $(s3listconfig)
s3listconfig%:
	$(eval CURRENT_VERSION = $(shell ${AWS_CMD} s3 cp s3://$(S3_MF_GEOADMIN3_$(shell echo $(*)| tr a-z A-Z))/configs/layersconfiginfo.json - | gunzip | jq -r '.layersconfig_version'))
	@echo  
	@${AWS_CMD} s3 ls s3://$(S3_MF_GEOADMIN3_$(shell echo $(*)| tr a-z A-Z))/configs_archive/ | grep -o -E '[0-9]{14}' | while read -r line; do \
		if [[ "$$line" = $(CURRENT_VERSION) ]]; then echo "$$line <== current"; else echo "$$line"; fi; \
	done

# Activate, i.e. copy the layersconfig from it timestamped configs directory to the 'active' one
s3activateconfig := $(patsubst %,s3activateconfig%,dev,int,prod)
PHONY: $(s3activateconfig)
s3activateconfig%: guard-LAYERSCONFIG_VERSION
	${AWS_CMD} s3 cp --recursive s3://$(S3_BUCKET_$(shell echo $*| tr a-z A-Z))/configs_archive/$(LAYERSCONFIG_VERSION)/configs/ s3://$(S3_BUCKET_$(shell echo $*| tr a-z A-Z))/configs/

# Delete a previous layersconfig
s3deleteconfig := $(patsubst %,s3deleteconfig%,int,prod)
PHONY: $(s3deleteconfig)
s3deleteconfig%: guard-LAYERSCONFIG_VERSION
	${AWS_CMD} s3 rm --recursive s3://$(S3_BUCKET_$(shell echo $*| tr a-z A-Z))/configs_archive/$(LAYERSCONFIG_VERSION);
