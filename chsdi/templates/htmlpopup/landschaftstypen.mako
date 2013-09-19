<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
    <tr><td width="150">${_('nummer')}</td>    <td>${c['attributes']['typ_nr']}</td></tr>
    <tr><td width="150">${_('typnummer')}</td>    <td>${c['attributes']['typ_nr']}</td></tr>
    <tr><td width="150">${_('typ')}</td>
      % if lang in ('de', 'rm', 'en'):
           <td>${c['attributes']['typname_de'] or '-'}</td>
      % else:
           <td>${c['attributes']['typname_fr'] or '-'}</td>
      % endif
    </tr>
    <tr><td width="150">${_('regname')}</td>
      % if lang in ('de', 'rm', 'en'):
           <td>${c['attributes']['regname_de'] or '-'}</td>
      % else:
           <td>${c['attributes']['regname_fr'] or '-'}</td>
      % endif
    </tr>
    <tr><td width="150">${_('flaeche_ha')}</td>    <td>${int(round(c['attributes']['object_are'])) or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>    <td>${int(round(c['attributes']['typ_area'])) or '-'}</td></tr>
    <tr><td width="150">${_('stand')}</td>    <td>${c['attributes']['stand'] or '-'}</td></tr>
</%def>
