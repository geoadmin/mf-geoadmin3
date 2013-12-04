<%
mode = request.params.get('mode')
lang = request.lang
layersconfig = 'chsdi:static/js/ol3/build/layersconfig.' + lang + '.js'
%>

<script type="text/javascript">
(function() {
// Load css
document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('chsdi:static/js/ol3/css/ga.css'))}" + '" />');
document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('chsdi:static/js/ol3/resources/bootstrap/css/bootstrap.min.css'))}" +'" />');
document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('chsdi:static/js/ol3/resources/layout.css'))}" + '" />');
document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('chsdi:static/js/ol3/resources/bootstrap/css/bootstrap-responsive.min.css'))}" + '" />');
// Load js
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url(layersconfig))}" + '"></scr' + 'ipt>')
% if mode == 'debug':
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/ol3/build/ga-whitespace.js'))}" + '"></scr' + 'ipt>');
% else:
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/ol3/build/ga.js'))}" + '"></scr' + 'ipt>')
% endif
})();
</script>
