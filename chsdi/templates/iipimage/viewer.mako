<%namespace name="iipimage" file="../iipimage.mako"/>

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
      #zoomify {
        width: 100%;
        height: 100%;
      }
    </style>
    <link rel="shortcut icon" type="image/x-icon" href="${h.versioned(request.static_url('chsdi:static/images/favicon.ico'))}">
  </head>
  <body onload="init()">
    <div class="header">${title}</div>
    <div class="wrapper">
      <div id="zoomify"></div>
    </div>
    <div class="footer">
      <a class="pull-left" href="${_('disclaimer url')}" target="_blank">Copyright</a>
    </div>
    <script type="text/javascript" src="${loaderUrl}"></script>
    <script type="text/javascript">
      function init() {
        ${iipimage.init_map(c.get('image'), c.get('width'), c.get('height'), 'zoomify')}
      }
    </script>
  </body>
</html>
