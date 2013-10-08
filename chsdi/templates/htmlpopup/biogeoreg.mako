<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('datumactu')}</td>    <td>${c['attributes']['biogreg_ve'] or '-'}</td></tr>
    <tr><td width="150">${_('bioregname')}</td>    <td>${c['attributes']['biogreg_r6'] or '-'}</td></tr>
    <tr><td width="150">${_('biounterregname')}</td>    <td>${c['attributes']['biogreg_r1'] or '-'}</td></tr>
    <tr><td width="150">${_('bioregnummer')}</td>    <td>${c['attributes']['biogreg_c6'] or '-'}</td></tr>
    <tr><td width="150">${_('biounterregnummer')}</td>    <td>${c['attributes']['biogreg_c1'] or '-'}</td></tr>
</%def>

