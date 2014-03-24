<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

    <tr><td class="cell-left">${_('nummer')}</td>    <td>${c['attributes']['typ_nr']}</td></tr>
    <tr><td class="cell-left">${_('typnummer')}</td>    <td>${c['attributes']['typ_nr']}</td></tr>
    <tr><td class="cell-left">${_('typ')}</td>
      % if lang in ('de', 'rm', 'en'):
           <td>${c['attributes']['typname_de'] or '-'}</td>
      % else:
           <td>${c['attributes']['typname_fr'] or '-'}</td>
      % endif
    </tr>
    <tr><td class="cell-left">${_('regname')}</td>
      % if lang in ('de', 'rm', 'en'):
           <td>${c['attributes']['regname_de'] or '-'}</td>
      % else:
           <td>${c['attributes']['regname_fr'] or '-'}</td>
      % endif
    </tr>
    <tr><td class="cell-left">${_('flaeche_ha')}</td>    <td>${int(round(c['attributes']['object_are'])) or '-'}</td></tr>
    <tr><td class="cell-left">${_('gesamtflaeche_ha')}</td>    <td>${int(round(c['attributes']['typ_area'])) or '-'}</td></tr>
    <tr><td class="cell-left">${_('stand')}</td>    <td>${c['attributes']['stand'] or '-'}</td></tr>
</%def>
