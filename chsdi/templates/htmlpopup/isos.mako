# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%!
   from chsdi.lib.helpers import quoting
%>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('kanton')}</td>                     <td>${c['attributes']['kanton'] or '-'}</td></tr>
    <tr><td width="150">${_('ortsbildname')}</td>               <td>${c['attributes']['ortsbildname']}</td></tr>
    <tr><td width="150">${_('kategorie')}</td>                  <td>${c['attributes']['vergleichsrastereinheit'] or '-'}</td></tr>
    <tr><td width="150">${_('lagequalitaeten')}</td>            <td>${c['attributes']['lagequalitaeten'] or '-'}</td></tr>
    <tr><td width="150">${_('raeumliche_qualitaeten')}</td>     <td>${c['attributes']['raeumliche_qualitaeten'] or '-'}</td></tr>
    <tr><td width="150">${_('arch__hist__qualitaeten')}</td>    <td>${c['attributes']['arch__hist__qualitaeten'] or '-'}</td></tr>
    <tr><td width="150">${_('fassung')}</td>                    <td>${c['attributes']['fassungsjahr'] or '-'}</td></tr>
    <tr><td width="150">${_('band_1_2')}</td>                   <td>${c['attributes']['band_1'] or '-'} | ${c['attributes']['band_2'] or '-'}</td></tr>
    <tr><td width="150">${_('publikationsjahr_1_2')}</td>       <td>${c['attributes']['publikationsjahr_1'] or '-'} | ${c['attributes']['publikationsjahr_2'] or '-'}</td></tr>
    <tr>
      <td width="150">${_('pdf_dokument_1_2')}</td>
      <td>
        % if c['attributes']['pdf_dokument_1']:
            <a href="https://dav0.bgdi.admin.ch/isos/${c['attributes']['pdf_dokument_1']|trim,quoting}.pdf" target="_blank">${c['attributes']['pdf_dokument_1']}.pdf</a> |
        % else:
            - | 
        % endif
        % if c['attributes']['pdf_dokument_2']:
            &nbsp;<a href="https://dav0.bgdi.admin.ch/isos/${c['attributes']['pdf_dokument_2']|trim,quoting}.pdf" target="_blank">${c['attributes']['pdf_dokument_2']}.pdf</a>
        % else:
            &nbsp;-
        % endif
      </td>
    </tr>
    <tr><td colspan=2>${_('ch.bak.isos.warning')}</td></td></tr>
</%def>
