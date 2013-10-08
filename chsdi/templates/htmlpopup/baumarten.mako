<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('laubholzanteil')}</td>     <td>${c['attributes']['anteil_lau'] or '-'}</td></tr>
    <tr><td width="150">${_('nadelholzanteil')}</td>    <td>${c['attributes']['anteil_nad'] or '-'}</td></tr>
    <tr><td width="150">${_('holz_region')}</td>        <td>${c['attributes']['wirtschaft'] or '-'}</td></tr>
    <tr><td width="150">${_('holzvorrat')}</td>         <td>${c['attributes']['vorrat'] or '-'}</td></tr>
</%def>

