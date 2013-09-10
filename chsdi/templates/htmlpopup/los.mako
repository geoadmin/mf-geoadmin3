<%inherit file="base.mako"/>

<%def name="preview()">${_('losidentifikator')}: ${c['attributes']['neu_id'] or '-'}</%def>

<%def name="table_body(c,lang)">
    % if c['attributes']['operatsname'] and c['attributes'] :
    <tr><td width="150" valign="top">${_('losentreprise')}</td>    <td>${c['attributes']['operatsname'] or '-'}</td></tr>
    % endif
    % if c['attributes']['losnr'] and c['attributes']:
    <tr><td width="150">${_('losnummer')}</td>    <td>${c['attributes']['losnr'] or '-'}</td></tr>
    % endif
    % if c['attributes']['taetigkeit_d'] and c['attributes']:
    <tr><td width="150">${_('losactivite')}</td>
      % if lang == 'de'or lang == 'rm' or lang == 'en':
           <td>${c['attributes']['taetigkeit_d'] or '-'}</td>
      % elif lang == 'fr':
           <td>${c['attributes']['taetigkeit_f'] or '-'}</td>
      % elif lang == 'it':
           <td>${c['attributes']['taetigkeit_i'] or '-'}</td>
      % endif
    </tr>
    % endif
    % if c['attributes']['quality'] and c['attributes']:
    <tr><td width="150">${_('losquality')}</td>    <td>${c['attributes']['quality'] or '-'}</td></tr>
    % endif
    % if c['attributes']['flaeche_vertrag']:
    <tr><td width="150">${_('losarea')}</td>    <td>${c['attributes']['flaeche_vertrag'] or '-'}</td></tr>
    % endif
    % if c['attributes']['frame']:
        <tr><td width="150">${_('losbezungsramen')}</td>    <td>${c['attributes']['frame'] or '-'}</td></tr>
    % endif
    % if c['value']:
    <tr><td width="150">${_('losidentifikator')}</td>    <td>${c['value'] or '-'}</td></tr>
    % endif
</%def>
