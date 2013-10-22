<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
       <tr><td class="cell-left" valign="top">${_('geol_f')}</td><td>${c['attributes']['t2_id'] or '-'}</td></tr>
 % if lang == 'de' or lang == 'rm' or lang == 'en':
       <tr><td class="cell-left">${_('id_objekt')}</td><td>${c['attributes']['type_de'] or '-'}</td></tr>
      % elif lang == 'fr' or lang == 'it':
       <tr><td class="cell-left">${_('id_objekt')}</td><td>${c['attributes']['type_fr'] or '-'}</td></tr>
 % endif
</%def>

