<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

<%
    lang = lang if lang in ('fr','it','en') else 'de'
    typ_text = 'typ_%s' % lang
    status_text = 'status_%s' % lang
%>

    <tr><td class="cell-left">${_('typ')}</td>                                                  <td>${c['attributes'][typ_text] or '-'}</td></tr>
    <tr><td class="cell-left">${_('status')}</td>                                               <td>${c['attributes'][status_text] or '-'}</td></tr>
    <tr><td class="cell-left">${_('gemkanton')}</td>                                            <td>${c['attributes']['kanton'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('name')}</td>                                                 <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_source')}</td>                                            <td>${c['attributes']['source'] or '-'}</td></tr>

</%def>

