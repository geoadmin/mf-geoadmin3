<%
mode = request.params.get('mode')
lang = request.lang
layersconfig = 'chsdi:static/js/layersconfig.' + lang + '.js'
%>

<script type="text/javascript">
(function() {
// Load css
document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('chsdi:static/css/ga.css'))}" + '" />');
// Load js
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url(layersconfig))}" + '"></scr' + 'ipt>')
% if mode == 'debug':
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/ga-whitespace.js'))}" + '"></scr' + 'ipt>');
% else:
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/ga.js'))}" + '"></scr' + 'ipt>')
% endif
})();
</script>
