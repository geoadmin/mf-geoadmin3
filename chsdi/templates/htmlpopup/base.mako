# -*- coding: utf-8 -*-

<% 
  c = pageargs['feature']
  c['bbox'] = pageargs.get('bbox')
  c['scale'] = pageargs.get('scale')
  c['stable_id'] = False
  extended = pageargs.get('extended')
  protocol = request.scheme
  baseUrl = protocol + '://' + request.registry.settings['geoadminhost']
  bbox = c['bbox']
  lang = request.lang
  attribution = pageargs.get('attribution')
  fullName = pageargs.get('fullName')
%>

% if extended:
  <link rel="stylesheet" type="text/css" href="../../../../../../css/extended.min.css"/>
  <link rel="stylesheet" type="text/css" href="../../../../../../css/blueimp-gallery-2.11.0.min.css"/>
  <script src="../../../../../../js/jquery-2.0.3.min.js"></script>
  <script src="../../../../../../js/blueimp-gallery-2.11.5.min.js"></script>
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
              <a href="${baseUrl}?${c['layerBodId']}=${c['featureId']}&lang=${lang}" target="new">${_('Link to object')}</a>
            </td>
          </tr>
        %endif
      </table>
    % endif
  </div>
</div>
