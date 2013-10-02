<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150" valign="top">${_('tt_ch.bakom.radio-fernsehsender_name')}</td>      <td>${c['attributes']['name']}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bakom.radio-fernsehsender_code')}</td>      <td>${c['attributes']['code'] or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bakom.leistung')}</td>                      <td>${c['attributes']['power'] or '-'}</td></tr>
</%def>
