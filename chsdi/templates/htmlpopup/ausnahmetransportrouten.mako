# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
    <tr><td width="100">${_('richtungsgetrennt')}</td><td>${c['attributes']['ri_getrenn'] or ''}</td></tr>
    <tr><td width="100">${_('anzahlspuren')}</td><td>${c['attributes']['anz_spuren'] or ''}</td></tr>
    <tr><td width="100">${_('strassentyp')}</td><td>${c['attributes']['strassen_typ'] or ''}</td></tr>
    <tr><td width="100">${_('routentypid')}</td><td valign="top">${c['attributes']['routentyp_id'] or ''}</td></tr>
</%def>
