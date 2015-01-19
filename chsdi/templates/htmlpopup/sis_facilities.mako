<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    doc_title = c['layerBodId'] + '.' + 'doc_title'
    name = c['layerBodId'] + '.' + 'facname_%s' % lang
%>
<% 
    import datetime
    lang = lang if lang in ('fr','it') else 'de'
    facname = 'facname_%s' % lang
    fackind_text = 'fackind_text_%s' % lang
    facstatus_text = 'facstatus_text_%s' % lang
    description_text = 'description_%s' % lang
    objectname = 'objname_%s' % lang
    datefrom = datetime.datetime.strptime(c['attributes']['validfrom'].strip(), "%Y-%m-%d").strftime("%d.%m.%Y")
%>
    <tr><td class="cell-left">${_(name)}</td>                  <td>${c['attributes'][facname]}</td></tr>
    <tr><td class="cell-left">${_('tt_sachplan_facility_anlageart')}</td>             <td>${c['attributes'][fackind_text] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_sachplan_facility_anlagestatus')}</td>          <td>${c['attributes'][facstatus_text] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_sachplan_facility_beschlussdatum')}</td>        <td>${datefrom or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_sachplan_beschreibung')}</td>                   <td>${c['attributes'][description_text] or '-'}</td></tr>
% if 'doc_web' in c['attributes']:
    <tr><td class="cell-left">${_(doc_title)}</td>                    <td><a href="${c['attributes']['doc_web'] or '-'}" target="_blank">${c['attributes']['doc_title'] or '-'}</a></td></tr>
% else:
    <tr><td class="cell-left">${_('tt_sachplan_weitereinfo')}</td>                    <td> - </td></tr>
%endif
</%def>
