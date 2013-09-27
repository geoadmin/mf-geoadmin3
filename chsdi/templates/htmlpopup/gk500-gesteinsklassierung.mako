<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td colspan="3">&nbsp;</tr>
    <tr>
      <td colspan="3">${_('tt_gk500-gesteinsklassierung')}</td>
    </tr>
    <tr><td colspan="3">&nbsp;</tr>
    <tr>
      <td width="30" bgcolor="${c['attributes']['bgdi_tooltip_color']}" style="border-style: solid; border-width: 1px; -webkit-print-color-adjust:exact;">&nbsp;</td>
      <td width="20">&nbsp;</td>
  % if lang == 'de':
      <td>${c['attributes']['gestkl_de'] or '-'}</td>
  % elif lang == 'fr':
      <td>${c['attributes']['gestkl_fr'] or '-'}</td>
  % elif lang == 'en':
      <td>${c['attributes']['gestkl_en'] or '-'}</td>
  % elif lang == 'it':
      <td>${c['attributes']['gestkl_it'] or '-'}</td>
  % elif lang == 'rm':
      <td>${c['attributes']['gestkl_rm'] or '-'}</td>
  % endif
    </tr>
    <tr><td colspan="3">&nbsp;</tr>
</%def>
