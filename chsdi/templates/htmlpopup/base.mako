# -*- coding: utf-8 -*-

<% 
  c = pageargs['feature']
  c['bbox'] = pageargs.get('bbox')
  c['scale'] = pageargs.get('scale')
  c['stable_id'] = False
  protocol = request.scheme
  baseUrl = protocol + '://' + request.registry.settings['geoadminhost']
  bbox = c['bbox']
  lang = request.lang
  attribution = pageargs.get('attribution')
  fullName = pageargs.get('fullName')
%>

<div class="htmlpopup-container">
  <div class="htmlpopup-header">
    <span>${fullName}</span> (${attribution})
  </div>
  <div class="htmlpopup-content">
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
  </div>
</div>
