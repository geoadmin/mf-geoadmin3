<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('spectralinfolink')}</td>    <td>${c['attributes']['spectral_4'] or '-'|n}</td></tr>
    <tr><td width="150">${_('spectralzone')}</td>        <td>${c['attributes']['spectral_3'] or '-'|n}</td></tr>
</%def>

