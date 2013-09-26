# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('tt_kkw_name')}</td>        <td>${c['attributes']['name']}</td></tr>
    <tr><td width="150" valign="top"></td>              <td><a href="${c.path_url}/../${c['attributes']['layer_id']}.html?layer=${c['attributes']['layer_id']}&lang=${lang}" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

