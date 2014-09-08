<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td class="cell-left">${_('geocover_basisdatensatz')}</td><td>${c['attributes']['basisdatensatz'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('geocover_description')}</td><td>${c['attributes']['description'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('geocover_spec_description')}</td><td>${c['attributes']['spec_description'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('geocover_azimut')}</td><td>${c['attributes']['azimut'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('geocover_depth_1')}</td><td>${c['attributes']['depth_1'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('geocover_description_1')}</td><td>${c['attributes']['description_1'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('geocover_depth_2')}</td><td>${c['attributes']['depth_2'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('geocover_description_2')}</td><td>${c['attributes']['description_2'] or '-'}</td></tr>
</%def>
