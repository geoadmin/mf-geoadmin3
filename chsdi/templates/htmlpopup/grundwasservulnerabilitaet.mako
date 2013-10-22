<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
 % if lang == 'de' or lang == 'rm' or lang == 'en':
   <tr>
     <td class="cell-left">${_('tt_kbs_objektart')}</td>
     <td>${c['attributes']['type_de'] or '-'}</td>
   </tr>
 % elif lang == 'fr' or lang == 'it':
   <tr>
     <td class="cell-left">${_('tt_kbs_objektart')}</td>
     <td>${c['attributes']['type_fr'] or '-'}</td>
   </tr>
 % endif
</%def>
