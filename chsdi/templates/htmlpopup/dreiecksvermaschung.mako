<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
   % if "fineltra_LV" in c['attributes']['type']:
    % if lang == 'de' or lang == 'rm' or lang == 'en':
      <tr><td width="150" valign="top">${_('type_dreieck')}</td><td>FINELTRA LV</td></tr>
    % else:
      <tr><td width="150" valign="top">${_('type_dreieck')}</td><td>FINELTRA MN</td></tr>
    % endif
   % else:
      <tr><td width="150" valign="top">${_('type_dreieck')}</td><td>${c['attributes']['type'] or '-'}</td></tr>
   % endif
   <tr><td width="150">${_('num_dreieck')}</td><td>${c['attributes']['num'] or '-'}</td></tr>
   <tr><td width="150">${_('nom_dreieck')}</td><td>${c['value'] or '-'}</td></tr>
</%def>
