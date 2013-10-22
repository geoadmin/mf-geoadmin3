<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% 
    c['stable_id'] = True
    lang = lang if lang in ('fr','it','en') else 'de'
    lang = lang if lang != 'it' else 'fr'
    damtype = 'damtype_%s' % lang
%>
    <tr><td class="cell-left">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damname')}</td>           <td>${lang} ${c['attributes']['damname']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td>           <td>${c['attributes'][damtype] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damheight')}</td>         <td>${int(c['attributes']['damheight']) or '-'}&nbsp;m</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlevel')}</td>        <td>${int(c['attributes']['crestlevel']) or '-'}&nbsp;${_('abk_meter_ueber_meer')}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlength')}</td>       <td>${int(c['attributes']['crestlength']) or '-'}&nbsp;m</td></tr>
</%def>

