
.PHONY: cleanall
cleanall: clean
	rm -rf node_modules
	rm -rf .build-artefacts
	rm -rf ${CLONEDIR}

.PHONY: clean
clean:
	rm -f .build-artefacts/app.js
	rm -f .build-artefacts/js-files
	rm -rf .build-artefacts/annotated
	rm -f externs/angular.js
	rm -f externs/jquery.js
	rm -f test/lib/*.js
	rm -f src/deps.js
	rm -f src/style/app.css
	rm -f src/TemplateCacheModule.js
	rm -f src/index.html
	rm -f src/mobile.html
	rm -f src/embed.html
	rm -f src/config.dev.mako
	rm -f src/config.int.mako
	rm -f src/config.prod.mako
	rm -f src/config.infra.mako
	rm -rf prd
	rm -rf configs
	rm -rf dist
