
.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo
	@echo "Possible targets:"
	@echo
	@echo "----------------------------------------------------------------------------------------------------------"
	@echo "|                     LOCAL DEVELOPMENT                                                                   |"
	@echo "----------------------------------------------------------------------------------------------------------"
	@echo
	@echo "- user                Build the app using user specific environment variables (see $(USER_SOURCE) file)"
	@echo "- env                 Install NVM and set the correct node version to build the application"
	@echo "- all                 Build the app using current environment variables"
	@echo "- build               Build the app using current environment variables. No linting and testing."
	@echo "- dev                 Build the app using dev environment variables (see rc_dev file). No linting and testing."
	@echo "- int                 Build the app using int environment variables (see rc_int file). No linting and testing."
	@echo "- prod                Build the app using prod environment variables (see rc_prod file). No linting and testing."
	@echo "- release             Build app for release (/prd)"
	@echo "- debug               Build app for debug (/src)"
	@echo "- lint                Run the linter on src/components, src/js folders, test/specs and python files"
	@echo "- testdebug           Run the JavaScript tests in debug mode"
	@echo "- testrelease         Run the JavaScript tests in release mode"
	@echo "- teste2e             Run saucelabs tests"
	@echo "- saucelabssingle     Run saucelabs tests but only with single platform/browser"
	@echo "- apache              Configure Apache (restart required)"
	@echo "- fixrights           Fix rights in common folder"
	@echo "- clean               Remove generated files"
	@echo "- cleanall            Remove all the build artefacts"
	@echo "- cesium              Update Cesium.min.js and Cesium folder. Needs Node js version >= 6."
	@echo "- olcesium            Update olcesium.js, olcesium-debug.js. Needs Node js version >= 6 and java >=8."
	@echo "- install-libs        Update js librairies used in index.html, see npm packages defined in section 'dependencies' of package.json and git submodules"
	@echo "- translate           Generate the translation files (requires db user pwd in ~/.pgpass: dbServer:dbPort:*:dbUser:dbUserPwd)"
	@echo "- help                Display this help"
	@echo
	@echo "----------------------------------------------------------------------------------------------------------"
	@echo "|                     DEPLOYMENT                                                                         |"
	@echo "----------------------------------------------------------------------------------------------------------"
	@echo
	@echo "- deploydev           Deploys current github master to dev. Specify SNAPSHOT=true to create snapshot as well."
	@echo "- s3deploybranchint   Build a branch and deploy it to S3 int. Defaults to the current branch name."
	@echo "- s3deploybranchinfra Build a branch and deploy it to S3 infra. Defaults to the current branch name."
	@echo "- s3copybranch        Copy the current directory content to S3. Defaults to the current branch name. WARNING: your code must have been compiled with 'make <user|int|prod>' first."
	@echo "                      Usage: make s3copybranch DEPLOY_TARGET=<int|prod>"
	@echo "                                               NAMED_BRANCH=<true|false>"
	@echo "                                               CODE_DIR=<Path to the folder, default to current folder> (optional)"
	@echo "                                               DEPLOY_GIT_BRANCH=<Name of the branch to deploy, default to current branch> (optional)"
	@echo "- s3deploydistdev     Copy the CI generated <dist> to dev (DRYRUN=<true|false> SNAPSHOT=<snapshot> DEPLOY_GIT_BRANCH=<branch>)"
	@echo "- s3deploydistprod    Copy the CI generated <dist> to prod (DRYRUN=<true|false> SNAPSHOT=<snapshot> DEPLOY_GIT_BRANCH=<branch>)"
	@echo "                      Usage: make SNAPSHOT=<snapshot> DEPLOY_GIT_BRANCH=<branch> s3deploydistprod"
	@echo "- s3listint           List availables branches, revision and build on int bucket."
	@echo "- s3listprod          List availables branches, revision and build on prod bucket."
	@echo "- s3infoint           Get version info on remote int bucket. (usage only: make s3infoint S3_VERSION_PATH=<branch>/<sha>/<version>)"
	@echo "- s3infoprod          Get version info on remote prod bucket. (usage only: make s3infoprod S3_VERSION_PATH=<branch>/<sha>/<version>)"
	@echo "- s3activateint       Activate a version at the root of '${S3_BUCKET_INT}' bucket. (usage only: make s3activateint DRYRUN=<true|false>"
	@echo "                                                                                         SNAPSHOT=<snapshot> DEPLOY_GIT_BRANCH=<branch>"
	@echo "- s3activateprod      Activate a version at the root of '${S3_BUCKET_PROD}' bucket. (usage only: make s3activateint DRYRUN=<true|false>)"
	@echo "                                                                                         SNAPSHOT=<snapshot> DEPLOY_GIT_BRANCH=<branch>)"
	@echo "- s3deleteint         Delete a project version in a remote int bucket. (usage: make s3deleteint S3_VERSION_PATH=<branch> or <branch>/<sha>/<version>)"
	@echo "- s3deleteprod        Delete a project version in a remote prod bucket. (usage: make s3deleteprod S3_VERSION_PATH=<branch> or <branch>/<sha>/<version>)"
	@echo
	@echo "----------------------------------------------------------------------------------------------------------"
	@echo "|                     LAYERS CONFIG                                                                      |"
	@echo "----------------------------------------------------------------------------------------------------------"
	@echo
	@echo "- configs/              Generate layersconfig from API_URL=${API_URL} (current value)                            "
	@echo "- s3uploadconfigint     Upload current config as $(LAYERSCONFIG_VERSION) to int bucket (as defined by S3_MF_GEOADMIN3_INT=$(S3_MF_GEOADMIN3_INT))"
	@echo "- s3uploadconfigprod    Upload current config as $(LAYERSCONFIG_VERSION) to prod bucket (as defined by S3_MF_GEOADMIN3_PROD=$(S3_MF_GEOADMIN3_PROD))"
	@echo "- s3listconfigint       List all available configs from int bucket (as defined by S3_MF_GEOADMIN3_INT=$(S3_MF_GEOADMIN3_INT))"
	@echo "- s3listconfigprod      List all available configs from prod bucket (as defined by S3_MF_GEOADMIN3_PROD=$(S3_MF_GEOADMIN3_PROD))"
	@echo "- s3currentconfigint    Show current active version on int bucket (as defined by S3_MF_GEOADMIN3_INT=$(S3_MF_GEOADMIN3_INT))"
	@echo "- s3currentconfigprod   Show current active version on prod bucket (as defined by S3_MF_GEOADMIN3_PROD=$(S3_MF_GEOADMIN3_PROD))"
	@echo "- s3activateconfigint   Activate config on int bucket (as defined by S3_MF_GEOADMIN3_INT=$(S3_MF_GEOADMIN3_INT))"
	@echo "                        Usage: make s3activateconfigint LAYERSCONFIG_VERSION=$(LAYER_LAYERSCONFIG_VERSION)"
	@echo "- s3activateconfigprod  Activate config on to prod bucket (as defined by S3_MF_GEOADMIN3_PROD=$(S3_MF_GEOADMIN3_PROD))"
	@echo "                        Usage: make s3activateconfigprod LAYERSCONFIG_VERSION=$(LAYER_LAYERSCONFIG_VERSION)"
	@echo "- s3deleteconfigint     Delete config=$(LAYERSCONFIG_VERSION) from int bucket (as defined by S3_MF_GEOADMIN3_INT=$(S3_MF_GEOADMIN3_INT))"
	@echo "                        Usage: make s3deleteconfigint LAYERSCONFIG_VERSION=$(LAYER_LAYERSCONFIG_VERSION)"
	@echo "- s3deleteconfigprod    Delete config=$(LAYERSCONFIG_VERSION) from prod bucket (as defined by S3_MF_GEOADMIN3_PROD=$(S3_MF_GEOADMIN3_PROD))"
	@echo "                        Usage: make s3deleteconfigprod LAYERSCONFIG_VERSION=$(LAYER_LAYERSCONFIG_VERSION)"
	@echo
	@echo "----------------------------------------------------------------------------------------------------------"
	@echo "|                     VARNISH/CLOUDFRONT                                                                 |"
	@echo "----------------------------------------------------------------------------------------------------------"
	@echo "- flushvarnish        Flush varnish instances. (usage: make flushvarnish DEPLOY_TARGET=<int|prod|infra>)"
	@echo
	@echo
	@echo "----------------------------------------------------------------------------------------------------------"
	@echo "|                     DEPRECATED                                                                         |"
	@echo "----------------------------------------------------------------------------------------------------------"
	@echo
	@echo "- s3deployint         Deploys a snapshot specified with SNAPSHOT=xxx to s3 int."
	@echo "- s3deployprod        Deploys a snapshot specified with SNAPSHOT=xxx to s3 prod."
	@echo
	@echo "Variables:"
	@echo
	@echo "- PROJECT                     (current value: ${PROJECT})"
	@echo "- USER_NAME                   (current value: ${USER_NAME})"
	@echo "- API_URL Service URL         (build with: $(LAST_API_URL), current value: $(API_URL))"
	@echo "- CONFIG_URL Service URL      (build with: $(LAST_CONFIG_URL), current value: $(CONFIG_URL))"
	@echo "- ALTI_URL Alti service URL   (build with: $(LAST_ALTI_URL), current value: $(ALTI_URL))"
	@echo "- PRINT_URL Print service URL (build with: $(LAST_PRINT_URL), current value: $(PRINT_URL))"
	@echo "- SHOP_URL Service URL        (build with: $(LAST_SHOP_URL), current value: $(SHOP_URL))"
	@echo "- WMS_URL Service URL         (build with  $(LAST_WMS_URL), current value: $(WMS_URL))"
	@echo "- WMTS_URL Service URL        (build with  $(LAST_WMTS_URL), current value: $(WMTS_URL))"
	@echo "- TERRAIN_URL Service URL     (build with: $(LAST_TERRAIN_URL), current value: $(TERRAIN_URL))"
	@echo "- VECTORTILES_URL Service URL (build with: $(LAST_VECTORTILES_URL), current value: $(VECTORTILES_URL))"
	@echo "- APACHE_BASE_PATH Base path  (build with: $(LAST_APACHE_BASE_PATH), current value: $(APACHE_BASE_PATH))"
	@echo "- APACHE_BASE_DIRECTORY       (build with: $(LAST_APACHE_BASE_DIRECTORY), current value: $(APACHE_BASE_DIRECTORY))"
	@echo "- VERSION                     (build with: $(LAST_VERSION), current value: $(VERSION))"
	@echo "- NVM_VERSION                 (build with: $(LAST_NVM_VERSION), current value: $(NVM_VERSION))"
	@echo "- NODE_VERSION                (build with: $(LAST_NODE_VERSION), current value: $(NODE_VERSION))"
	@echo "- LAYERSCONFIG_VERSION        (build with: $(LAST_LAYERSCONFIG_VERSION), current value: $(LAYERSCONFIG_VERSION))"
	@echo "- SNAPSHOT                    (current value: $(SNAPSHOT))"
	@echo "- DEPLOY_GIT_BRANCH           (current value: $(DEPLOY_GIT_BRANCH))"
	@echo "- GIT_COMMIT_HASH             (current value: $(GIT_COMMIT_HASH))"
	@echo "- VARNISH_HOSTS               (current value: ${VARNISH_HOSTS})"
	@echo "- DEPLOY_TARGET               (current value: ${DEPLOY_TARGET})"
	@echo "- S3_BUCKET_PROD              (current value: ${S3_BUCKET_PROD})"
	@echo "- S3_BUCKET_INT               (current value: ${S3_BUCKET_INT})"
	@echo "- S3_BUCKET_DEV               (current value: ${S3_BUCKET_DEV})"
	@echo "- S3_BUCKET_INFRA             (current value: ${S3_BUCKET_INFRA})"
	@echo "- S3_BUCKET_PROD_URL          (current value: ${S3_BUCKET_PROD_URL})"
	@echo "- S3_BUCKET_INT_URL           (current value: ${S3_BUCKET_INT_URL})"
	@echo "- S3_BUCKET_DEV_URL           (current value: ${S3_BUCKET_DEV_URL})"
	@echo "- S3_BUCKET_INFRA_URL         (current value: ${S3_BUCKET_INFRA_URL})"
	@echo "- S3_BUCKET_URL               (current value: ${S3_BUCKET_URL})"
	@echo

showVariables:
	@echo "DEPLOY_TARGET = $(DEPLOY_TARGET)"
	@echo "VERSION = $(VERSION)"
	@echo "S3_BASE_PATH = $(S3_BASE_PATH)"
	@echo "S3_SRC_BASE_PATH = $(S3_SRC_BASE_PATH)"
	@echo "S3_BUCKET_PROD   = $(S3_BUCKET_PROD)"
	@echo "S3_BUCKET_INT    = $(S3_BUCKET_INT)"
	@echo "S3_BUCKET_DEV    = $(S3_BUCKET_DEV)"

