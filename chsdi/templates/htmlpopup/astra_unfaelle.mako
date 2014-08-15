<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    lang = lang if lang not in ('rm', 'en') else 'de'
    accidenttype = 'accidenttype_%s' % lang
    accidentday = 'accidentday_%s' % lang
    severitycategory = 'severitycategory_%s' % lang
    roadtype = 'roadtype_%s' % lang
%>

    <tr><td class="cell-left">${_('astra_unf_acctype')}</td>          <td>${c['attributes'][accidenttype] or '-'}</td></tr>
    <tr><td class="cell-left">${_('astra_unf_accday')}</td>           <td>${c['attributes'][accidentday] or '-'}</td></tr>
    <tr><td class="cell-left">${_('astra_unf_severity')}</td>         <td>${c['attributes'][severitycategory] or '-'}</td></tr>
    <tr><td class="cell-left">${_('astra_unf_roadtype')}</td>         <td>${c['attributes'][roadtype] or '-'}</td></tr>
    <tr><td class="cell-left">${_('kanton')}</td>                     <td>${c['attributes']['canton'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('astra_unf_fsocommunecode')}</td>   <td>${c['attributes']['fsocommunecode'] or '-'}</td></tr>
</%def>

