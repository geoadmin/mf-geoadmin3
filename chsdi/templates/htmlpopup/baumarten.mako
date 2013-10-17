<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('laubholzanteil')}</td>     <td>${c['attributes']['anteil_lau'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('nadelholzanteil')}</td>    <td>${c['attributes']['anteil_nad'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('holz_region')}</td>        <td>${c['attributes']['wirtschaft'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('holzvorrat')}</td>         <td>${c['attributes']['vorrat'] or '-'}</td></tr>
</%def>

