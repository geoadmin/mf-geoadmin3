<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('holzvorrat')}</td>    <td>${c['attributes']['vorrat'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('holz_region')}</td>    <td>${c['attributes']['wireg_'] or '-'}</td></tr>
</%def>

