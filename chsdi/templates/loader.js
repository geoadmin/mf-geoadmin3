# -*- coding: utf-8 -*-

<%
mode = request.params.get('mode')
lang = request.params.get('lang', None)
AVAILABLE_LANGUAGES = request.registry.settings['available_languages']
if lang is None and request.accept_language:
    lang = request.accept_language.best_match(AVAILABLE_LANGUAGES, default_match='de')
else:
    lang = 'de'

appUrl = request.application_url.replace('http:', request.scheme + ":")
layersconfig = appUrl + '/rest/services/all/MapServer/layersconfig?lang=' + lang
import urllib2, json
f = urllib2.urlopen(layersconfig)
conf = """function getConfig(){ return %s } """ %json.dumps(json.loads(f.read())['layers'])
%>

(function() {
// Load css
document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('chsdi:static/css/ga.css'))}" + '" />');
// Load js
document.write('<scr' + 'ipt type="text/javascript">' + ${conf|n} + '</scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/proj4js-compressed.js'))}" + '"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/EPSG21781.js'))}" + '"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/EPSG2056.js'))}" + '"></scr' + 'ipt>');
% if mode == 'debug':
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/ga-whitespace.js'))}" + '"></scr' + 'ipt>');
% else:
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/ga.js'))}" + '"></scr' + 'ipt>')
% endif
})();
