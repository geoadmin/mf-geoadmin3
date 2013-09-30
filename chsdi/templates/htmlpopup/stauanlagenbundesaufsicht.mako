<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damname')}</td>           <td>${c['attributes']['damname']}</td></tr>
    % if lang == 'fr' or lang == 'it':
        <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td>       <td>${c['attributes']['damtype_fr'] or '-'}</td></tr>
    % elif lang == 'en':
        <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td>       <td>${c['attributes']['damtype_en'] or '-'}</td></tr>
    % else:
        <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td>       <td>${c['attributes']['damtype_de'] or '-'}</td></tr>
    % endif
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damheight')}</td>         <td>${int(c['attributes']['damheight']) or '-'}&nbsp;m</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlevel')}</td>        <td>${int(c['attributes']['crestlevel']) or '-'}&nbsp;${_('abk_meter_ueber_meer')}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlength')}</td>       <td>${int(c['attributes']['crestlength']) or '-'}&nbsp;m</td></tr>
</%def>

