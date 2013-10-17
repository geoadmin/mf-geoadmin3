<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('kanton')}</td>          <td>${c['attributes']['kanton'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('kantoncode')}</td>         <td>${c['attributes']['kantoncode'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('rwknr')}</td>          <td>${c['attributes']['rwknr'] or '-'}</td></tr>
</%def>

