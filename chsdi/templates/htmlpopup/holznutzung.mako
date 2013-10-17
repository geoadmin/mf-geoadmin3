<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('holznuztung')}</td>    <td>${c['attributes']['nutzung'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('holz_region')}</td>    <td>${c['attributes']['wireg_'] or '-'}</td></tr>
</%def>

