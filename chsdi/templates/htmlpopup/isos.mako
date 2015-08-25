# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%!
   from chsdi.lib.helpers import quoting
%>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('kanton')}</td>                     <td>${c['attributes']['kanton'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ortsbildname')}</td>               <td>${c['attributes']['ortsbildname']}</td></tr>
    <tr><td class="cell-left">${_('kategorie')}</td>                  <td>${c['attributes']['vergleichsrastereinheit'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('lagequalitaeten')}</td>            <td>${c['attributes']['lagequalitaeten'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('raeumliche_qualitaeten')}</td>     <td>${c['attributes']['raeumliche_qualitaeten'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('arch__hist__qualitaeten')}</td>    <td>${c['attributes']['arch__hist__qualitaeten'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('fassung')}</td>                    <td>${c['attributes']['fassungsjahr'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('band_1_2')}</td>                   <td>${c['attributes']['band_1'] or '-'} | ${c['attributes']['band_2'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('publikationsjahr_1_2')}</td>       <td>${c['attributes']['publikationsjahr_1'] or '-'} | ${c['attributes']['publikationsjahr_2'] or '-'}</td></tr>
<%
    webDavHost = request.registry.settings['webdav_host']
    if c['attributes']['pdf_dokument_1'] is not None:
        url_pdf = webDavHost + '/isos/' + c['attributes']['pdf_dokument_1'] + '.pdf'
    if c['attributes']['pdf_dokument_2'] is not None:
        url_pdf2 = webDavHost + '/isos/' + c['attributes']['pdf_dokument_2'] + '.pdf'
%>

    <tr>
      <td class="cell-left">${_('pdf_dokument_1_2')}</td>
      <td>
        % if c['attributes']['pdf_dokument_1']:
            <a href="${url_pdf}" target="_blank">${c['attributes']['pdf_dokument_1']}.pdf</a> |
        % else:
            - | 
        % endif
        % if c['attributes']['pdf_dokument_2']:
            &nbsp;<a href="${url_pdf2}" target="_blank">${c['attributes']['pdf_dokument_2']}.pdf</a>
        % else:
            &nbsp;-
        % endif
      </td>
    </tr>
    <tr><td colspan=2>${_('ch.bak.isos.warning')}</td></td></tr>
</%def>
