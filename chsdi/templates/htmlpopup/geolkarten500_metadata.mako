<%inherit file="base.mako"/>
<%def name="preview()">${c['value'] or '-'}</%def>

<%def name="table_body(c,lang)">
 % if lang == 'de' or lang == 'rm' or lang == 'en':
       <tr><td width="150" valign="top">Datenbezug</td><td><a href="http://www.toposhop.admin.ch/de/shop/products/maps/geology/gk500/print" target="_blank">Link</a></td></tr>
      % elif lang == 'fr':
       <tr><td width="150" valign="top">Distribution des données</td><td><a href="http://www.toposhop.admin.ch/fr/shop/products/maps/geology/gk500/print" target="_blank">Lien</a></td></tr>
      % elif lang == 'en':
       <tr><td width="150" valign="top">Order data</td><td><a href="http://www.toposhop.admin.ch/en/shop/products/maps/geology/gk500/print" target="_blank">Link</a></td></tr>
      % elif lang == 'it':
       <tr><td width="150" valign="top">Procacciamento dei dati</td><td><a href="http://www.toposhop.admin.ch/it/shop/products/maps/geology/gk500/print" target="_blank">Link</a></td></tr>
 % endif
</%def>
