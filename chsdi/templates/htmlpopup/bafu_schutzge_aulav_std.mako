<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('name')}</td>                 <td>${c['attributes']['key_name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_wrz_select_obj')}</td>    <td>${c['attributes']['key_obj'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('typ')}</td>                  <td>${c['attributes']['typ'] or '-'}</td></tr>
</%def>

