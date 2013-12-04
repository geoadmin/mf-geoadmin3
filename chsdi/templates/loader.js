<% mode = request.params.get('mode') %>

<script type="text/javascript">
(function() {
// Load css
document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('chsdi:static/js/ol3/css/ga.css'))}" + '" />');
document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('chsdi:static/js/ol3/resources/bootstrap/css/bootstrap.min.css'))}" +'" />');
document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('chsdi:static/js/ol3/resources/layout.css'))}" + '" />');
document.write('<link rel="stylesheet" type="text/css" href="' + "${h.versioned(request.static_url('chsdi:static/js/ol3/resources/bootstrap/css/bootstrap-responsive.min.css'))}" + '" />');
// Load js
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/ol3/build/layersconfig.de.js'))}" + '"></scr' + 'ipt>')
% if mode == 'debug':
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/ol3/build/ga-whitespace.js'))}" + '"></scr' + 'ipt>');
% else:
document.write('<scr' + 'ipt type="text/javascript" src="' + "${h.versioned(request.static_url('chsdi:static/js/ol3/build/ga.js'))}" + '"></scr' + 'ipt>')
% endif
})();
</script>
