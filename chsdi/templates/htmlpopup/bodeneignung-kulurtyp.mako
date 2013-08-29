# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

<%
  Key_To_Translate = 'blw_farbe_' + c[farbe]
%>

<tr><td colspan="3">&nbsp;</tr>
<tr><td width="30" bgcolor="${c[symb_color]" style="border-style: solid; border-width: 1px; -webkit-print-color-adjust:exact;">&nbsp;</td><td width="20">&nbsp;</td>    <td>${Key_To_Translate}</td></tr>
<tr><td colspan="3">&nbsp;</tr>
</%def>
