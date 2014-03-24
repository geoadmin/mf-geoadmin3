<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

   <tr><td class="cell-left">${_('bearbeitungsjahr')}</td><td>${c['attributes']['weg_wrz_jb_version'] or '-'}</td></tr>
   <tr><td class="cell-left">${_('jb_obj')}</td><td>${c['attributes']['jb_obj'] or '-'}</td></tr>
   <tr><td class="cell-left">${_('wrz_obj')}</td><td>${c['attributes']['wrz_obj'] or '-'}</td></tr>
   <tr><td class="cell-left">${_('length_km')}</td><td>${int(round(c['attributes']['length_km'])) or '-'}</td></tr>
</%def>

