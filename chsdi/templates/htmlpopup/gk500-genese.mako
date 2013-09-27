<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td colspan="3">&nbsp;</tr>
    <tr>
      <td colspan="3">${_('tt_gk500-genese')}</td>
    </tr>
    <tr><td colspan="3">&nbsp;</tr>
    <tr>
      <td width="30" bgcolor="${c['attributes']['bgdi_tooltip_color']}" style="border-style: solid; border-width: 1px; -webkit-print-color-adjust:exact;">&nbsp;</td>
      <td width="20">&nbsp;</td>
% if lang == 'de':
      <td>${c['attributes']['genese_de'] or '-'}</td>
  % elif lang == 'fr':
      <td>${c['attributes']['genese_fr'] or '-'}</td>
  % elif lang == 'en':
      <td>${c['attributes']['genese_en'] or '-'}</td>
  % elif lang == 'it':
      <td>${c['attributes']['genese_it'] or '-'}</td>
  % elif lang == 'rm':
      <td>${c['attributes']['genese_rm'] or '-'}</td>
  % endif
    </tr>
    <tr><td colspan="3">&nbsp;</tr>
</%def>
