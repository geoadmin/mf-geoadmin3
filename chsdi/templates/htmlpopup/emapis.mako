<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    lang = lang if lang in ('fr','it') else 'de'
    status = 'status_%s' % lang
    typ = 'typ_%s' % lang
%>
    <tr><td class="cell-left">${_('ch.blw.emapis.typ')}</td>               <td>${c['attributes'][typ]}</td></tr>
    <tr><td class="cell-left">${_('ch.blw.emapis.status')}</td>            <td>${c['attributes'][status] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.blw.emapis.geschaeftsnummer')}</td>  <td>${c['attributes']['geschaeftsnummer'] or '-'}</td></tr>
</%def>
