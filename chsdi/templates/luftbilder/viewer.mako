<%namespace name="lubis_map" file="../lubis_map.mako"/>

<%
  from pyramid.url import route_url
  c = context
  request = c.get('request')
  title = c.get('layer') if c.get('datenherr') is None else c.get('layer') + ' (' + c.get('datenherr') + ')'
  pageTitle = c.get('title') + ': ' + c.get('bildnummer')
  title += ': ' + pageTitle
  loaderUrl = h.make_agnostic(route_url('ga_api', request))
%>

<!DOCTYPE html>
<html>
  <head>
    <!--[if !HTML5]>
    <meta http-equiv="X-UA-Compatible" content="IE=9,IE=10,IE=edge,chrome=1"/>
    <![endif]-->
    <title>${pageTitle}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="apple-mobile-web-app-capable" content="yes">
    
    <style>
      body {
        margin: 10px;
      }
      .pull-right {
        float: right;
      }
      .pull-left {
        float: left;
      }
      .header {
        height: 30px;
        margin: 10px 0px;
        font-size: 14px;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-color:#EFEFEF;
      }
      .wrapper {
        position: absolute;
        top: 60px;
        right: 10px;
        bottom: 50px;
        left: 10px;
        border: 1px solid #EFEFEF;
      }
      .footer {
        position: absolute;
        right: 0px;
        bottom: 0px;
        left: 0px;
        height: 30px;
        margin: 10px 0px;
      }
      .footer a {
        padding: 0px 10px;
      }
      #lubismap {
        width: 100%;
        height: 100%;
      }
      @media print { /* Used by Chrome */
        #lubismap, .wrapper {
          width: 650px;
          height: 650px;
        }
        .footer a {
          display: none;
        }
      }

    </style>
    <link rel="shortcut icon" type="image/x-icon" href="${h.versioned(request.static_url('chsdi:static/images/favicon.ico'))}">
  </head>
  <body onload="init()">
    <div class="header">${title}</div>
    <div class="wrapper">
      <div id="lubismap"></div>
    </div>
    <div class="footer">
      <a class="pull-left" href="${_('disclaimer url')}" target="_blank">Copyright</a>
    </div>
    <!-- TODO: LOAD NON DEBUG VERSION -->
    <script type="text/javascript" src="${loaderUrl}?mode=debug"></script>
    <script type="text/javascript">
      function init() {
        ${lubis_map.init_map(c.get('bildnummer'), c.get('width'), c.get('height'), 'lubismap')}
       
        // FF/IE
        if ('onbeforeprint' in window) {
          var element = document.getElementById('lubismap');
          window.onbeforeprint = function() {
            var size = lubisMap.getSize();
            element.style.width = "650px";
            element.style.height = (650 * size[1] / size[0]) + 'px';
          };
          window.onafterprint = function() {
            element.style.width =  '100%';
            element.style.height = '100%';
          };
        }
        // Chrome
        if (window.matchMedia) {
          window.matchMedia('print').addListener(function(mql) {
            if (mql.matches) {
              lubisMap.updateSize(); 
            } else {
              window.setTimeout(function(){lubisMap.updateSize()}, 500);
            }
          });
        }

        //function from here: https://developer.mozilla.org/en-US/docs/Web/API/window.location
        var queryParameter = function(sVar) {
            return decodeURI(window.location.search.replace(new
                                RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") +
                                "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        }

        var view = lubisMap.getView();
        //Establishing view with x/z and zoom from parameters
        var x = parseFloat(queryParameter('x'));
        var y = parseFloat(queryParameter('y'));
        var zoom = parseInt(queryParameter('zoom'), 10);
        if (!isNaN(x) && !isNaN(y)) {
          view.setCenter([x, y]);
        }
        if (!isNaN(zoom)) {
          view.setZoom(zoom);
        }

        //taken from angularj
        var lowercase = function(s) {
          return s.toLowerCase();
        };
        var boxee = /Boxee/i.test((window.navigator || {}).userAgent);
        var android = parseInt((/android (\d+)/.exec(lowercase((window.navigator || {}).userAgent)) || [])[1], 10);
        var hasHistory = !!(window.history && window.history.pushState && !(android < 4) && !boxee);

        //function from here: http://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter
        var updateQueryStringParameter = function(uri, key, value) {
          var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)", "i");
          if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
          } else {
            var hash =  '';
            var separator = uri.indexOf('?') !== -1 ? "&" : "?";
            if( uri.indexOf('#') !== -1 ){
                hash = uri.replace(/.*#/, '#');
                uri = uri.replace(/#.*/, '');
            }
            return uri + separator + key + "=" + value + hash;
          }
        }


        var updateUrl = function() {
          if (!hasHistory || document.fullscreenElement ||
              document.msFullscreenElement ||
              document.mozFullScreen ||
              document.webkitIsFullScreen) {
            return;
          }
          var center = view.getCenter();
          var zoom = view.getZoom();
          if (center && zoom !== undefined &&
              !isNaN(zoom) && !isNaN(center[0]) &&
              !isNaN(center[1])) {
            var x = center[0].toFixed(2);
            var y = center[1].toFixed(2);
            var newHref = updateQueryStringParameter(window.location.href, 'x', x);
            newHref = updateQueryStringParameter(newHref, 'y', y);
            newHref = updateQueryStringParameter(newHref, 'zoom', zoom);
            window.history.replaceState(null, '', newHref);
          }
        };

        var debounce = function(fnc) {
          var debounceTimeout = undefined;
          return function() {
            if (debounceTimeout) {
              clearTimeout(debounceTimeout);
            }
            debounceTimeout = setTimeout(function() {
              fnc();
              debounceTimeout = undefined;
            }, 500);
          };
        };

        view.on('propertychange', debounce(updateUrl));
        updateUrl();

      }
    </script>
  </body>
</html>
