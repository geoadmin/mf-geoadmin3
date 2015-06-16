<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.titel or '-'}</%def>


<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
<tr><td class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.gewaessertyp')}</td>     <td>${c['attributes']['gewaessertyp']}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.hoehe')}</td>            <td>${c['attributes']['hoehe'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.abfluss')}</td>          <td>${c['attributes']['abfluss'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.gefaelle')}</td>         <td>${c['attributes']['gefaelle'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.geo')}</td>              <td>${c['attributes']['geo'] or '-'}</td></tr>
<%
    from urllib2 import urlopen
    url_pdf = "https://dav0.bgdi.admin.ch/bafu/"+c['attributes']['url_portraits']
    response = None
    try:
        response = urlopen(url_pdf)
        pdf = True
    except:
        pdf = False
    finally:
        if response:
            response.close()
%>
% if pdf:
<tr><td class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.url_portraits')}</td>    <td><a href="${url_pdf}" target="_blank">${c['attributes']['url_portraits'] or '-'}</a></td></tr>
% else:
<tr><td class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.url_portraits')}</td>    <td>-</td></tr>
% endif
</%def>

<%def name="extended_info(c, lang)">
<%
    lang = 'fr' if lang in ('fr', 'it') else 'de'
    url_uebersicht = 'url_uebersicht_%s' % lang

    from urllib2 import urlopen
    url_pdf = "https://dav0.bgdi.admin.ch/bafu/"+c['attributes']['url_portraits']
    url_legend_pdf = "https://dav0.bgdi.admin.ch/bafu/"+c['attributes'][url_uebersicht]
    response = None
    try:
        response = urlopen(url_pdf)
        pdf = True
    except:
        pdf = False
    finally:
        if response:
            response.close()
    response = None
    try:
        response = urlopen(url_legend_pdf)
        legend_pdf = True
    except:
        legend_pdf = False
    finally:
        if response:
            response.close()
%>

<table class="table-with-border kernkraftwerke-extended">
<tr>
<td width="20%">&nbsp;</td>
<td width="30%">&nbsp;</td>
<td width="20%">&nbsp;</td>
<td width="30%" >&nbsp;</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.gewaessertyp')}</th>
<td>${c['attributes']['gewaessertyp'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.grosserfluss')}</th>
<td>${c['attributes']['grosserfluss'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.biogeo')}</th>
<td>${c['attributes']['biogeo'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.hoehe')}</th>
<td>${c['attributes']['hoehe'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.abfluss')}</th>
<td>${c['attributes']['abfluss'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.gefaelle')}</th>
<td>${c['attributes']['gefaelle'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.geo')}</th>
<td>${c['attributes']['geo'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.code')}</th>
<td>${c['attributes']['code'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.objectid_gwn25')}</th>
<td>${c['attributes']['objectid_gwn25'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.aehnlichkeit')}</th>
<td>${c['attributes']['aehnlichkeit'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.shape_length')}</th>
<td>${c['attributes']['shape_length'] or '-'}</td>
<th class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.url_portraits')}</th>
% if pdf:
<td><a href="${url_pdf}" target="_blank">${c['attributes']['url_portraits'] or '-'}</a></td>
% else:
<td>-</td>
% endif
</tr>
<tr>
<th class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.url_uebersicht')}</th>
% if legend_pdf:
<td><a href="https://dav0.bgdi.admin.ch/bafu/${c['attributes'][url_uebersicht] or '-'}" target="_blank">${c['attributes'][url_uebersicht] or '-'}</a></td>
% else:
<td>-</td>
% endif
<th class="cell-left">${_('ch_bafu_typisierung_fliessgewaesser.name')}</th>
<td>${c['attributes']['name'] or '-'}</td>
</tr>
</table>
</%def>
