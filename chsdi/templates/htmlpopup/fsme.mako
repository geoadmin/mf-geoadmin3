# -*- coding: utf-8 -*-                                                                                                                    
<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
<% c['stable_id'] = True %>
    <tr><td width="150">${_('tt_fsme_gemname')}</td>    <td>${c['attributes']['gemname'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_fsme_gemnr')}</td>      <td>${c['attributes']['bfsnr'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_fsme_bezirknr')}</td>   <td>${c['attributes']['bezirksnr'] or '-'}</td></tr>
    <tr><td width="150">${_('tt_fsme_kantonsnr')}</td>  <td>${c['attributes']['kantonsnr'] or '-'}</td></tr>
</%def>
