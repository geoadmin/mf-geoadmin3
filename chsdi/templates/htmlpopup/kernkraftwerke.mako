# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('tt_kkw_name')}</td>        <td>${c['attributes']['name']}</td></tr>
</%def>

