<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
   <tr><td width="150" valign="top">${_('bearbeitungsjahr')}</td><td>${c['attributes']['weg_wrz_jb_version'] or '-'}</td></tr>
   <tr><td width="150" valign="top">${_('jb_obj')}</td><td>${c['attributes']['jb_obj'] or '-'}</td></tr>
   <tr><td width="150" valign="top">${_('wrz_obj')}</td><td>${c['attributes']['wrz_obj'] or '-'}</td></tr>
   <tr><td width="150" valign="top">${_('length_km')}</td><td>${int(round(c['attributes']['length_km'])) or '-'}</td></tr>
</%def>

