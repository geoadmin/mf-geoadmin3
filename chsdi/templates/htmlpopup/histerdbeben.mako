<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('abgintens')}</td>    <td>${c['attributes']['intensity'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('abgmagn')}</td>    <td>${c['attributes']['magnitude'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('datumzeit')}</td>    <td>${c['attributes']['date_time'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('epizentralzone')}</td>    <td>${c['attributes']['epicentral'] or '-'}</td></tr>
</%def>

