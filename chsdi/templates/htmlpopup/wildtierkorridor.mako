<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

<%
    lang = 'fr' if lang in ('fr', 'it') else 'dt'
    zusta = 'zusta_%s' % lang
%>

    <tr><td width="150">${_('tt_ch.bafu.fauna-wildtierkorridor_national_nr')}</td>       <td>${c['attributes']['nr'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bafu.fauna-wildtierkorridor_national_zustand')}</td>  <td>${c['attributes'][zusta] or '-'}</td></tr>
</%def>

