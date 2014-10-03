# -*- coding: utf-8 -*-

<%
from chsdi.lib.helpers import versioned

lang = pageargs['lang']
mode = pageargs['mode']
data = pageargs['data']

layersconfig = """window.GeoAdmin.getConfig  = function(){ return %s } """ % data
%>
(function() {
if (typeof window['GeoAdmin'] == 'undefined') window.GeoAdmin = {};
window.GeoAdmin.lang = "${lang}";

${layersconfig|n}
// Load js
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/serverconfig.js'))}" +  '"></scr' + 'ipt>');
% if mode == 'preview' or mode == 'previewdebug':
document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('chsdi:static/css/ga.css'))}" + '" />');
document.write('<scr' + 'ipt type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/proj4js/2.2.1/proj4.js"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/EPSG21781.js'))}" + '"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/EPSG2056.js'))}" + '"></scr' + 'ipt>');
% else:
//Once we deprecate the old version, we can remove the old-* files
document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('chsdi:static/css/old-ga.css'))}" + '" />');
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/old-proj4js-compressed.js'))}" + '"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/old-EPSG21781.js'))}" + '"></scr' + 'ipt>');
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/old-EPSG2056.js'))}" + '"></scr' + 'ipt>');
% endif

% if mode == 'debug':
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/old-ga-whitespace.js'))}" + '"></scr' + 'ipt>');
% elif mode == 'waf':
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/old-ga-waf.js'))}" + '"></scr' + 'ipt>');
% elif mode == 'wafint':
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/old-ga-wafint.js'))}" + '"></scr' + 'ipt>');
% elif mode == 'preview':
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/ga.js'))}" + '"></scr' + 'ipt>');
% elif mode == 'previewdebug':
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/ga-debug.js'))}" + '"></scr' + 'ipt>');
% else:
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/old-ga.js'))}" + '"></scr' + 'ipt>');
% endif
})();

