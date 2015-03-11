<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    name = c['layerBodId'] + '.' + 'plname_%s' % lang
    doc_title = c['layerBodId'] + '.' + 'doc_title'
%>

<%
import datetime
lang = lang if lang in ('fr','it') else 'de'
plname = 'plname_%s' % lang
facname = 'facname_%s' % lang
measuretype_text = 'meastype_text_%s' % lang
coordinationlevel_text = 'coordlevel_text_%s' % lang
planningstatus_text = 'plstatus_text_%s' % lang
description_text = 'description_%s' % lang
dateto = '-'
datefrom = datetime.datetime.strptime(c['attributes']['validfrom'].strip(), "%Y-%m-%d").strftime("%d.%m.%Y")
if c['attributes']['validuntil']:
    dateto = datetime.datetime.strptime(c['attributes']['validuntil'].strip(), "%Y-%m-%d").strftime("%d.%m.%Y")
endif
%>
    <tr>
      <td class="cell-left">${_('ch.bav.sachplan-infrastruktur-schiene_anhorung.plname_de')}</td>
      <td>${c['attributes'][plname]}</td>
    </tr>
	  <tr>
      <td class="cell-left">${_('tt_sachplan_facility_beschlussdatum')}</td>
      <td>${datefrom or '-'}</td>
    </tr>
% if 'doc_web' in c['attributes']:
    <tr>
      <td class="cell-left">${_('ch.bav.sachplan-infrastruktur-schiene_anhorung.doc_title')}</td>
      <td><a href="${c['attributes']['doc_web'] or '-'}" target="_blank">${c['attributes']['doc_title'] or '-'}</a></td></tr>
% else:
    <tr>
      <td class="cell-left">${_('tt_sachplan_weitereinfo')}</td>
      <td> - </td>
    </tr>
%endif
</%def>
