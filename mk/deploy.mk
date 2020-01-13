
# S3 deploy variables
S3_OPTS =  --dryrun
ifeq ($(DRYRUN), false)
	S3_OPTS =
endif
TARGETS = DEV INT PROD
DEPLOY_TARGET ?= int
DEPLOY_GIT_BRANCH ?= $(shell git rev-parse --symbolic-full-name --abbrev-ref HEAD)
CLONEDIR = /home/$(USER_NAME)/tmp/branches/${DEPLOY_GIT_BRANCH}
CODE_DIR ?= .
S3_BASE_PATH ?=
S3_SRC_BASE_PATH ?=

IS_MASTER_BRANCH = $(shell if [ ${DEPLOY_GIT_BRANCH} = "master" ] || [ ${DEPLOY_GIT_BRANCH} = "mvt_clean"]; then echo "true"; else echo "false"; fi)
ifeq (IS_MASTER_BRANCH, true)
	SHA := $(shell git rev-parse HEAD | cut -c1-7)
	S3_BASE = /$(DEPLOY_GIT_BRANCH)/$(SHA)/$(VERSION)
	S3_BASE_PATH = $(S3_BASE)/
	S3_SRC_BASE_PATH = $(S3_BASE)/src/
endif

# S3 activation variables
S3_VERSION_PATH ?=


# S3 delete variables
BRANCH_TO_DELETE ?=

# Bucket name
ifeq ($(PROJECT),mf-geoadmin3)
	S3_BUCKET_PROD  := mf-geoadmin3-prod-dublin
	S3_BUCKET_INT   := mf-geoadmin3-int-dublin
	S3_BUCKET_DEV   := mf-geoadmin3-dev-dublin
	S3_BUCKET_PROD_URL   := https://map.geo.admin.ch
	S3_BUCKET_INT_URL    := https://mf-geoadmin3.int.bgdi.ch
	S3_BUCKET_DEV_URL    := https://mf-geoadmin3.dev.bgdi.ch
else
	S3_BUCKET_PROD  := mf-geoadmin4-prod-dublin
	S3_BUCKET_INT   := mf-geoadmin4-int-dublin
	S3_BUCKET_INT_URL   := https://mf-geoadmin4.int.bgdi.ch
	S3_BUCKET_PROD_URL  := https://test.map.geo.admin.ch
endif
# Bucket url (base url for automatic tests and provinding links, Jenkins stuff)
ifeq ($(DEPLOY_TARGET),dev)
	S3_BUCKET := $(S3_BUCKET_DEV)
	S3_BUCKET_URL := $(S3_BUCKET_DEV_URL)
endif
ifeq ($(DEPLOY_TARGET),int)
	S3_BUCKET := $(S3_BUCKET_INT)
	S3_BUCKET_URL := $(S3_BUCKET_INT_URL)
endif
ifeq ($(DEPLOY_TARGET),prod)
	S3_BUCKET := $(S3_BUCKET_PROD)
	S3_BUCKET_URL := $(S3_BUCKET_PROD_URL)
endif

.PHONY: s3deploydev
s3deploydev:
	$(MAKE) s3deploy DEPLOY_TARGET=dev

.PHONY: s3deployint
s3deployint:
	$(MAKE) s3deploy DEPLOY_TARGET=int

.PHONY: s3deployprod
s3deployprod:
	$(MAKE) s3deploy DEPLOY_TARGET=prod

PHONY: s3deploy
s3deploy: guard-CLONEDIR \
          guard-DEPLOY_TARGET \
          guard-DEPLOY_GIT_BRANCH \
          guard-DEEP_CLEAN \
          guard-IS_MASTER_BRANCH \
          .build-artefacts/requirements.timestamp \
          showVariables
	./scripts/clonebuild.sh ${CLONEDIR} ${DEPLOY_TARGET} ${DEPLOY_GIT_BRANCH} ${DEEP_CLEAN} ${IS_MASTER_BRANCH};
	$(MAKE) s3copybranch CODE_DIR=${CLONEDIR}/mf-geoadmin3 \
	                         DEPLOY_TARGET=${DEPLOY_TARGET} \
	                         DEPLOY_GIT_BRANCH=${DEPLOY_GIT_BRANCH}
	                         PROJECT=${PROJECT}

.PHONY: s3copybranch
s3copybranch: guard-S3_BUCKET \
              guard-CODE_DIR \
              guard-DEPLOY_GIT_BRANCH \
              .build-artefacts/requirements.timestamp
	PROJECT=${PROJECT} ${PYTHON_CMD} ./scripts/s3manage.py upload \
	                                                       --force \
	                                                       --url $(S3_BUCKET_URL) \
	                                                       ${CODE_DIR} \
	                                                       ${S3_BUCKET} \
	                                                       ${DEPLOY_GIT_BRANCH}

s3list := $(patsubst %,s3list%,dev,int,prod)
PHONY: $(s3list)
s3list%: .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py list $(S3_BUCKET_$(shell echo $*| tr a-z A-Z))

s3info := $(patsubst %,s3info%,dev,int,prod)
PHONY: $(s3info)
s3info%: guard-S3_VERSION_PATH .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py info ${S3_VERSION_PATH} $(S3_BUCKET_$(shell echo $*| tr a-z A-Z));

s3activate := $(patsubst %,s3activate%,dev,int,prod)
PHONY: $(s3activate)
s3activate%: guard-DEPLOY_GIT_BRANCH \
             guard-VERSION \
             .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py activate \
	                                    --branch ${DEPLOY_GIT_BRANCH} \
	                                    --version ${VERSION} \
	                                    $(shell if [ ${FORCE} = "true" ]; then echo "--force"; fi) \
	                                    --url $(S3_BUCKET_$(shell echo $*| tr a-z A-Z)_URL) \
	                                    $(S3_BUCKET_$(shell echo $*| tr a-z A-Z));

s3delete := $(patsubst %,s3delete%,dev,int,prod)
PHONY: $(s3delete)
s3delete%: guard-S3_VERSION_PATH .build-artefacts/requirements.timestamp
	${PYTHON_CMD} ./scripts/s3manage.py delete ${S3_VERSION_PATH} $(S3_BUCKET_$(shell echo $*| tr a-z A-Z));

.PHONY: flushvarnish
flushvarnish: guard-DEPLOY_TARGET
	source rc_${DEPLOY_TARGET} && make flushvarnishinternal

# This internal target has been created to have the good global variable values
# from rc_XXX file.
flushvarnishinternal: guard-API_URL guard-E2E_TARGETURL
	@if [ ! $(VARNISH_HOSTS) ] ; then \
		echo 'The VARNISH_HOSTS variable in rc_${DEPLOY_TARGET} is empty.';\
		echo 'Nothing to be done.'; \
	fi; \
	for VARNISHHOST in $(VARNISH_HOSTS) ; do \
		./scripts/flushvarnish.sh $$VARNISHHOST "$(subst //,,$(API_URL))" ;\
		./scripts/flushvarnish.sh $$VARNISHHOST "$(subst https://,,$(E2E_TARGETURL))" ;\
		echo "Flushed varnish at: $$VARNISHHOST" ;\
	done;

apache/app.conf: apache/app.mako-dot-conf \
                 ${MAKO_CMD} \
                 .build-artefacts/last-apache-base-path \
                 .build-artefacts/last-apache-base-directory \
                 .build-artefacts/last-api-url \
                 .build-artefacts/last-config-url \
                 .build-artefacts/last-version
	${PYTHON_CMD} ${MAKO_CMD} \
	              --var "apache_base_path=$(APACHE_BASE_PATH)" \
	              --var "apache_base_directory=$(APACHE_BASE_DIRECTORY)" \
	              --var "api_url=$(API_URL)" \
	              --var "s3_bucket_dev=$(S3_BUCKET_DEV)" \
	              --var "version=$(VERSION)" $< > $@

.PHONY: apache
apache: apache/app.conf
