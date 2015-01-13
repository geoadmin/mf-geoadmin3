<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

<%
   lang = lang if lang in ('fr','it','en') else 'de'
%>
    <tr><td class="cell-left">${_('kbnum')}</td><td>${c['featureId']}</td></tr> 
    <tr><td class="cell-left">${_('kbbez')}</td><td>${c['attributes']['name']}</td></tr>
    <tr><td class="cell-left">${_('Datenstand')}</td><td>${c['attributes']['legendecms2007']}</td></tr>
    <tr><td class="cell-left">${_('kartenbezug')}</td>
        <td><a href="http://www.toposhop.admin.ch/${lang}/shop/products/maps/leisure/ski" target="_blank">Toposhop</a></td>
    </tr>
</%def>
