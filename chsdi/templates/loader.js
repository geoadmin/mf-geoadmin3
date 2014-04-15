# -*- coding: utf-8 -*-

<%
import urllib2
import simplejson
from chsdi.lib.helpers import versioned
mode = request.params.get('mode')
lang = request.lang
appUrl = request.application_url.replace('http:', request.scheme + ':')
layersconfig = appUrl + versioned( '/rest/services/all/MapServer/layersConfig?lang=' + lang)
f = None
try:
    f = urllib2.urlopen(layersconfig)
    data = simplejson.loads(f.read())
finally:
    if f:
        f.close()
layersconfig = """if (typeof window['GeoAdmin'] == 'undefined') window['GeoAdmin'] =  {}; window.GeoAdmin.getConfig  = function(){ return %s } """ % simplejson.dumps(data,separators=(',',':'))
defaultLang = """function getDefaultLang() { return "%s" } """ % request.lang
%>
(function() {
var load = function() {
if (typeof window['GeoAdmin'] == 'undefined') window.GeoAdmin = {};
window.GeoAdmin.lang = "${lang}";
}
window.addEventListener ? 
window.addEventListener("load", load, false) :
window.attachEvent && window.attachEvent("onload", load);

${layersconfig|n}
// Load css
document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('chsdi:static/css/ga.css'))}" + '" />');
// Load js
document.write('<scr' + 'ipt type="text/javascript">' + ${defaultLang|n} + '</scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/serverconfig.js'))}" +  '"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/proj4js-compressed.js'))}" + '"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/EPSG21781.js'))}" + '"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/EPSG2056.js'))}" + '"></scr' + 'ipt>');
% if mode == 'debug':
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/ga-whitespace.js'))}" + '"></scr' + 'ipt>');
% else:
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/ga.js'))}" + '"></scr' + 'ipt>');
% endif
})();

