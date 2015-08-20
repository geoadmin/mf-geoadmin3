<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.titel or '-'}</%def>


<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
<tr><td class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.gewaessertyp')}</td>     <td>${c['attributes']['gewaessertyp']}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.hoehe')}</td>            <td>${c['attributes']['hoehe'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.abfluss')}</td>          <td>${c['attributes']['abfluss'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.gefaelle')}</td>         <td>${c['attributes']['gefaelle'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.geo')}</td>              <td>${c['attributes']['geo'] or '-'}</td></tr>
<%
    from chsdi.lib.helpers import resource_exists
    pdf = None
    if c['attributes']['url_portraits'] is not None:
        webDavHost = request.registry.settings['webdav_host']
        url_pdf = webDavHost + '/bafu/' + c['attributes']['url_portraits']
        pdf = resource_exists(url_pdf)
%>
<tr>
  <td class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.url_portraits')}</td>
  <td>
% if pdf:
    <a href="${url_pdf}" target="_blank">${c['attributes']['url_portraits']}</a></td>
% else:
    -
% endif
</td>
</tr>
</%def>

<%def name="extended_info(c, lang)">
<%
    from chsdi.lib.helpers import resource_exists
    lang = 'fr' if lang in ('fr', 'it') else 'de'
    url_uebersicht = 'url_uebersicht_%s' % lang
    webDavHost = request.registry.settings['webdav_host']
    pdf = None
    pdf_legend = None

    if c['attributes']['url_portraits'] is not None:
        url_pdf = webDavHost + '/bafu/' + c['attributes']['url_portraits']
        pdf = resource_exists(url_pdf)
    if c['attributes'][url_uebersicht] is not None:
        url_legend_pdf = webDavHost + '/bafu/' +c['attributes'][url_uebersicht]
        pdf_legend = resource_exists(url_legend_pdf)
%>

<table class="table-with-border kernkraftwerke-extended">
<tr>
<td width="20%">&nbsp;</td>
<td width="30%">&nbsp;</td>
<td width="20%">&nbsp;</td>
<td width="30%" >&nbsp;</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.gewaessertyp')}</th>
<td>${c['attributes']['gewaessertyp'] or '-'}</td>
<th class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.grosserfluss')}</th>
<td>${c['attributes']['grosserfluss'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.biogeo')}</th>
<td>${c['attributes']['biogeo'] or '-'}</td>
<th class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.hoehe')}</th>
<td>${c['attributes']['hoehe'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.abfluss')}</th>
<td>${c['attributes']['abfluss'] or '-'}</td>
<th class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.gefaelle')}</th>
<td>${c['attributes']['gefaelle'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.geo')}</th>
<td>${c['attributes']['geo'] or '-'}</td>
<th class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.code')}</th>
<td>${c['attributes']['code'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.objectid_gwn25')}</th>
<td>${c['attributes']['objectid_gwn25'] or '-'}</td>
<th class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.aehnlichkeit')}</th>
<td>${c['attributes']['aehnlichkeit'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.shape_length')}</th>
% if c['attributes']['shape_length']:
    <td>${round(c['attributes']['shape_length'],3) or '-'}</td>
% else:
    <td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.url_portraits')}</th>
% if pdf:
<td><a href="${url_pdf}" target="_blank">${c['attributes']['url_portraits'] or '-'}</a></td>
% else:
<td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.url_uebersicht')}</th>
% if legend_pdf:
<td><a href="${url_pdf_legend}" target="_blank">${c['attributes'][url_uebersicht] or '-'}</a></td>
% else:
<td>-</td>
% endif
<th class="cell-left">${_('ch.bafu.typisierung-fliessgewaesser.name')}</th>
<td>${c['attributes']['name'] or '-'}</td>
</tr>
</table>
</%def>
