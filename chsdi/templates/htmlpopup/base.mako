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

<div class="htmlpopup-content">
  <span style="font-weight:bold;">${fullName}</span> (${attribution})
</div>
<div class="htmlpopup-content">
  <span style="font-weight:bold;">${_('Information')}</span>
  <br>
  <table border="0" cellspacing="0" cellpadding="1" width="400px" style="font-size: 100%;" padding="1 1 1 1">
    ${self.table_body(c, lang)}
    % if c['stable_id'] is True:
      <tr><td width="150"></td><td><a href="${baseUrl}?${c['layerBodId']}=${c['id']}&lang=${lang}" target="new">${_('Link to object')}</a></td></tr>
    %endif
  </table>
</div>
