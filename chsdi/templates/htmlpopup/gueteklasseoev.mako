<%inherit file="base.mako"/>

<%def name="preview()">   
      % if lang == 'de' or lang == 'en' or lang == 'rm':
           ${c['value'] or '-'}
      % elif lang == 'fr' or lang == 'it':
           ${c['attributes']['klasse_fr'] or '-'}
      % endif
</%def>

<%def name="table_body(c, lang)">
     <tr><td width="150">${_('klasse')}</td><td>${c['value']}</td></tr>
</%def>
