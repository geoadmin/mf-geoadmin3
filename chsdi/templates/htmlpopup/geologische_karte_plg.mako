<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
 % if lang == 'de' or lang == 'rm' or lang == 'en':
       <tr><td class="cell-left">${_('geol_f')}</td><td>${c['attributes']['leg_geol_d'] or '-'}</td></tr>
      % elif lang == 'fr' or lang == 'it':
       <tr><td class="cell-left">${_('geol_f')}</td><td>${c['attributes']['leg_geol_f'] or '-'}</td></tr>
 % endif
</%def>
