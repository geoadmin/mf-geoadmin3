<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('spectralinfolink')}</td>    <td>${c['attributes']['spectral_4'] or '-'}</td></tr>
    <tr><td width="150">${_('spectralzone')}</td>        <td>${c['attributes']['spectral_3'] or '-'}</td></tr>
</%def>

