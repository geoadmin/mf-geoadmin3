<%inherit file="base.mako"/>

#<%def name="preview()">${c['attributes']['name'] or '-'}</%def>

<%def name="table_body(c, lang)">
<tr><td width="150" valign="top">${_('tt_ch.bakom.radio-fernsehsender_name')}</td><td>${c['value']}</td></tr>
<tr><td width="150" valign="top">${_('tt_ch.bakom.radio-fernsehsender_code')}</td><td>${c['attributes']['code'] or '-'}</td></tr>
<tr><td width="150" valign="top">${_('tt_ch.bakom.leistung')}</td><td>${c['attributes']['power'] or '-'}</td></tr>
<tr><td width="150" valign="top"></td><td><a href="${c.path_url}/../${c['featureId']}.html?layer=${c['attributes']['layer_id']}&lang=${lang}" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

<%def name="body(c, lang)">

<table border="0" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
<tr><td width="100%" valign="middle" colspan="2"><h1 class="tooltip_large_titel">${c['value']}</h1></tr>
<!-- -------------------------- -->
<tr><td width="100%" valign="middle" colspan="2">&nbsp;</td></tr>
<tr><td width="150" valign="middle">${_('tt_ch.bakom.radio-fernsehsender_code')}</td><td>${c['attributes']['code'] or '-'}</td></tr>
<tr><td width="150" valign="middle">${_('tt_ch.bakom.leistung')}</td><td>${c['attributes']['power'] or '-'}</td></tr>
<!-- -------------------------- -->
</table>
<% 
service = c['attributes']['service'].split(',')
program = c['attributes']['program'].split(',')
freqchan = c['attributes']['freqchan'].split(',')
i = 0 
%>

<table border="1" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
<tr>
<th width="50" valign="middle" style="background-color: #EFEFEF; font-weight: bold; text-align: center;">${_('tt_service')}</th>
<th width="50" valign="middle" style="background-color: #EFEFEF; font-weight: bold; text-align: center;">${_('tt_program')}</th>
<th width="50" valign="middle" style="background-color: #EFEFEF; font-weight: bold; text-align: center;">${_('tt_freqchan')}</th>
</tr>
</br>
% while i < len(service):
<tr>
<td width="50" valign="middle" style="text-align: center;">${service[i] or '-'}</td>
<td width="50" valign="middle" style="text-align: center;">${program[i] or '-'}</td>
<td width="50" valign="middle" style="text-align: center;">${freqchan[i] or '-'}</td>
</tr>
<% 
i = i + 1
%>
% endwhile
</table>
<br/>
</%def>
