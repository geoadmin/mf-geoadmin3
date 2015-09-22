<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

<%
    lang = lang if lang in ('fr','it','en') else 'de'
%>

    <tr><td class="cell-left">${_('ch.swisstopo.geologie-geowege')}</td>                              <td>${c['attributes']['titel_1'] or '-'}<br /><br />${c['attributes']['titel_2'] or ''}</td></tr>
    <tr><td class="cell-left">${_('link')}</td>                                                       <td><a href = "${c['attributes']['link']}"} target = "_blank">${c['attributes']['link']}</a></td></tr>
</%def>

