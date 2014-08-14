<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    lang = lang if lang in ('fr', 'it') else 'de'
    title = 'title_%s' % lang
    link = 'link_%s' % lang
    information = 'info_%s' % lang

%>
    <tr><td class="cell-left">${_('title')}</td><td>${c['attributes'][title] or '-'|n}</td></tr>

% if c['attributes']['type_coord'] =='info':
    <tr>
    <td class="cell-left">${_('information')}</td><td>${c['attributes'][information] or '-'|n}</td>
    </tr>
% else:    
    <tr>
    <td class="cell-left">${_('link')}<td>
    <a href="${c['attributes'][link] or '-'|n}" target="_parent">${_('treasure_hunt')}</a></td>
    </tr>
% endif



</%def>



        
