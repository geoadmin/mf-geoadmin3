# -*- coding: utf-8 -*-

<% 
  c = pageargs['feature']
  c['bbox'] = pageargs.get('bbox')
  c['scale'] = pageargs.get('scale')
  c['stable_id'] = False
  extended = pageargs.get('extended')
  protocol = request.scheme
  instanceId = request.registry.settings['instanceid'] + '/' if request.registry.settings['instanceid'] != 'main' else ''
  c['baseUrl'] = protocol + '://' + request.registry.settings['geoadminhost'] + '/' + instanceId
  bbox = c['bbox']
  lang = request.lang
  attribution = pageargs.get('attribution')
  fullName = pageargs.get('fullName')
  topic = request.matchdict.get('map')
%>

% if extended:
  <meta name="viewport" content="initial-scale=1.0"/>
  <link rel="stylesheet" type="text/css" href="${h.versioned(request.static_url('chsdi:static/css/extended.min.css'))}"/>
  <link rel="stylesheet" type="text/css" href="../../../../../../static/css/blueimp-gallery-2.11.0.min.css"/>
  <script src="../../../../../../static/js/jquery-2.0.3.min.js"></script>
  <script src="../../../../../../static/js/blueimp-gallery-2.11.5.min.js"></script>
% endif

<div class="htmlpopup-container">
  <div class="htmlpopup-header">
    <span>${fullName}</span> (${attribution})
  </div>
  <div class="htmlpopup-content">
    % if extended:
      ${self.extended_info(c, lang)}
    % else:
      <span>${_('Information')}</span>
      <br>
      <table>
        ${self.table_body(c, lang)}
        % if c['stable_id'] is True:
          <tr>
            <td class="cell-left"></td>
            <td>
              <a href="${c['baseUrl']}?${c['layerBodId']}=${c['featureId']}&lang=${lang}&topic=${topic}" target="new">${_('Link to object')}</a>
            </td>
          </tr>
        %endif
      </table>
    % endif
  </div>
</div>
