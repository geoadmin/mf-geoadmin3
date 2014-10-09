# -*- coding: utf-8 -*-

<%
  c = feature['feature']
  protocol = request.scheme
  c['bbox'] = feature.get('bbox')
  c['scale'] = feature.get('scale')
  c['stable_id'] = False
  c['baseUrl'] = h.make_agnostic(''.join((protocol, '://', request.registry.settings['geoadminhost'])))
  c['attribution'] = feature['attribution']
  c['fullName'] = feature['fullName']
  extended = feature['extended']
  lang = request.lang
  topic = request.matchdict.get('map')
%>

% if extended:
  <head>
  <link rel="apple-touch-icon" sizes="76x76" href="${h.versioned(request.static_url('chsdi:static/images/touch-icon-bund-76x76.png'))}"/>
  <link rel="apple-touch-icon" sizes="120x120" href="${h.versioned(request.static_url('chsdi:static/images/touch-icon-bund-120x120.png'))}"/>
  <link rel="apple-touch-icon" sizes="152x152" href="${h.versioned(request.static_url('chsdi:static/images/touch-icon-bund-152x152.png'))}"/>
  <!--[if !HTML5]>
  <meta http-equiv="X-UA-Compatible" content="IE=9,IE=10,IE=edge,chrome=1"/>
  <![endif]-->
  <title>${c['fullName']}</title> 
  <meta name="viewport" content="initial-scale=1.0"/>
  <link rel="stylesheet" type="text/css" href="${h.versioned(request.static_url('chsdi:static/css/extended.min.css'))}"/>
  <link rel="stylesheet" type="text/css" href="${h.versioned(request.static_url('chsdi:static/css/blueimp-gallery-2.11.0.min.css'))}"/>
  <script src="${h.versioned(request.static_url('chsdi:static/js/jquery-2.0.3.min.js'))}"></script>
  <script src="${h.versioned(request.static_url('chsdi:static/js/blueimp-gallery-2.11.5.min.js'))}"></script>
  <link rel="shortcut icon" type="image/x-icon" href="${h.versioned(request.static_url('chsdi:static/images/favicon.ico'))}">
  </head>
% endif

% if extended:
<div class="chsdi-htmlpopup-container">
% else:
<div class="htmlpopup-container">
% endif
  <div class="htmlpopup-header">
    <span>${c['fullName']}</span> (${c['attribution']})
  </div>
  <div class="htmlpopup-content">
    % if extended:
      ${self.extended_info(c, lang)}
    % else:
      <span>${_('Information')}</span>
      <br>
      <table>
        ${self.table_body(c, lang)}
        % if hasExtendedInfo:
        <tr>
          <td class="cell-left"></td>
          <td>
            <a href="${h.make_agnostic(request.route_url('extendedHtmlPopup', map=topic, layerId=c['layerBodId'], featureId=str(c['featureId'])))}?lang=${lang}" target="_blank">${_('zusatzinfo')}<img src="${h.versioned(request.static_url('chsdi:static/images/ico_extern.gif'))}" /></a>
          </td>
        </tr>
        % endif
        % if c['stable_id'] is True:
          <tr>
            <td class="cell-left"></td>
            <td>
              <a href="${''.join((c['baseUrl'], '?', c['layerBodId'], '=', str(c['featureId']), '&lang=', lang, '&topic=', topic))}" target="new">
                ${_('Link to object')}
              </a>
            </td>
          </tr>
        %endif
      </table>
    % endif
  </div>
  % if extended:
  <div class="htmlpopup-footer">
    <a href="${_('disclaimer url')}" target="_blank">
      ${_('disclaimer title')}
    </a>
    <div class="float-right">
      % if c['stable_id'] is True:
      <a class="link-red" href="${''.join((c['baseUrl'], '?', c['layerBodId'], '=', str(c['featureId']), '&lang=', lang, '&topic=', topic))}" target="new">
        ${_('Link to object')}
      </a>
      &nbsp;|&nbsp;
      % endif
      <a href="javascript:window.print();">
        ${_('print')}
      </a>
    </div>
    </div>
  </div>
  % endif
</div>
