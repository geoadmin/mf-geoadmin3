<%inherit file="base.mako"/>

<%def name="table_body(c, land)">
    <tr><td class="cell-left">${_('gewaessername')}</td>    <td>${c['attributes']['gewaesser'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('krebsart')}</td>    <td>${c['attributes']['art_lat'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('nachweisjahr')}</td>    <td>${c['attributes']['jahr'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('nachweisnummer')}</td>    <td>${c['attributes']['kennummer'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('nachweisort')}</td>    <td>${c['attributes']['ort'] or '-'}</td></tr>
</%def>

