<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

<%
    lang = 'fr' if lang in ('fr', 'it') else 'de'
    typ_text = 'typ_%s' % lang
    status_text = 'status_%s' % lang
%>

    <tr><td class="cell-left">${_('typ')}</td>  <td>${c['attributes'][typ_text] or '-'}</td></tr>
    <tr><td class="cell-left">${_('gemkanton')}</td>       <td>${c['attributes']['kanton'] or '-'}</td></tr>

</%def>

