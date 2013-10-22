<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>
<%
    lang = lang if lang in ('fr', 'fr') else 'de'
    typ = 'typ_%s' % lang
    desc = 'desc_%s' % lang
%>

    <tr><td class="cell-left">${_('name')}</td>        <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('nabeltyp')}</td>    <td>${c['attributes'][typ] or '-'}</td></tr>
    <tr><td class="cell-left">${_('werte')}</td>       <td>${c['attributes'][desc] or '-'}</td></tr>
    <tr><td class="cell-left">${_('abfrage')}</td>    <td><a href="http://www.bafu.admin.ch/luft/luftbelastung/blick_zurueck/datenabfrage/index.html" target="_blank">Link</a></td></tr>
</%def>

