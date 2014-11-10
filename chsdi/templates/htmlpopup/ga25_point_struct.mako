<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td class="cell-left">${_('geocover_basisdatensatz')}</td><td>${c['attributes']['basisdatensatz'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('geocover_description')}</td><td>${c['attributes']['description'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('geocover_spec_description')}</td><td>${c['attributes']['spec_description'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('geocover_azimut')}</td><td>${c['attributes']['azimut'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('geocover_dip')}</td><td>${c['attributes']['dip'] or '-'}</td></tr>
    <tr><td class="cell-left"></td><td><a href="${c['attributes']['url_legend']}" target="_blank">${_('linkzurlegende')}</a></td></tr>
</%def>
