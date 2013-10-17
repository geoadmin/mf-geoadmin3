<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('datumactu')}</td>    <td>${c['attributes']['biogreg_ve'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('bioregname')}</td>    <td>${c['attributes']['biogreg_r6'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('biounterregname')}</td>    <td>${c['attributes']['biogreg_r1'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('bioregnummer')}</td>    <td>${c['attributes']['biogreg_c6'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('biounterregnummer')}</td>    <td>${c['attributes']['biogreg_c1'] or '-'}</td></tr>
</%def>

