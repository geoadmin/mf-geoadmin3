<%inherit file="base.mako"/>

#<%def name="preview()">${c['value'] or '-'}</%def>

<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damname')}</td><td>${c['value']}</td></tr>
% if lang == 'fr' or lang == 'it':
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td><td>${c['attributes']['damtype_fr'] or '-'}</td></tr>
% elif lang == 'en':
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td><td>${c['attributes']['damtype_en'] or '-'}</td></tr>
% else:
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td><td>${c['attributes']['damtype_de'] or '-'}</td></tr>
% endif
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damheight')}</td><td>${int(c['attributes']['damheight']) or '-'}&nbsp;m</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlevel')}</td><td>${int(c['attributes']['crestlevel']) or '-'}&nbsp;${_('abk_meter_ueber_meer')}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlength')}</td><td>${int(c['attributes']['crestlength']) or '-'}&nbsp;m</td></tr>

##<tr><td width="150" valign="top"></td><td><a href="${c.path_url}/../${c['featureId']}.html?layer=${c['attributes']['layer_id']}&lang=${lang}&baseUrl=${c.baseUrl}" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
##</%def>

##<%def name="body(c, lang)">
##<% c[stable_id] = True %>
<table border="0" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
% if lang =='fr':
    <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauanlage')} ${c['attributes']['facilityname'] or '-'}</h1></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauanlage')}</td"><td width="70">${c['attributes']['facilityname'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_inbetriebabnahme')}</td><td>${c['attributes']['beginningofoperation'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_zweck')}</td><td>${c['attributes']['facaim_fr'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_aufsichtstart')}</td><td>${c['attributes']['startsupervision'] or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraum')}</td"><td width="70">${c['attributes']['reservoirname'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraumvolume')}</td><td>${c['attributes']['impoundmentvolume'] or '-'}&nbsp;Mio. m<sup>3</sup></td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauzielskote')}</td><td>${int(c['attributes']['impoundmentlevel']) or '-'}&nbsp;${_('abk_meter_ueber_meer')}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauhoehe')}</td><td>${int(c['attributes']['storagelevel']) or '-'}&nbsp;m</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_sperre')}</td"><td width="70">${c['value'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damheight')}</td><td>${int(c['attributes']['damheight']) or '-'}&nbsp;m</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlevel')}</td><td>${int(c['attributes']['crestlevel']) or '-'}&nbsp;${_('abk_meter_ueber_meer')}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlength')}</td><td>${int(c['attributes']['crestlength']) or '-'}&nbsp;m</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td><td>${c['attributes']['damtype_fr'] or '-'}</td></tr>
    <!-- -------------------------- -->

% elif lang == 'it':
    <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauanlage')} ${c['attributes']['facilityname'] or '-'}</h1></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauanlage')}</td"><td width="70">${c['attributes']['facilityname'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_inbetriebabnahme')}</td><td>${c['attributes']['beginningofoperation'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_zweck')}</td><td>${c['attributes']['facaim_fr'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_aufsichtstart')}</td><td>${c['attributes']['startsupervision'] or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraum')}</td"><td width="70">${c['attributes']['reservoirname'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraumvolume')}</td><td>${c['attributes']['impoundmentvolume'] or '-'}&nbsp;Mio. m<sup>3</sup></td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauzielskote')}</td><td>${int(c['attributes']['impoundmentlevel']) or '-'}&nbsp;${_('abk_meter_ueber_meer')}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauhoehe')}</td><td>${int(c['attributes']['storagelevel']) or '-'}&nbsp;m</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_sperre')}</td"><td width="70">${c['value'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damheight')}</td><td>${int(c['attributes']['damheight']) or '-'}&nbsp;m</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlevel')}</td><td>${int(c['attributes']['crestlevel']) or '-'}&nbsp;${_('abk_meter_ueber_meer')}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlength')}</td><td>${int(c['attributes']['crestlength']) or '-'}&nbsp;m</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td><td>${c['attributes']['damtype_fr'] or '-'}</td></tr>
    <!-- -------------------------- -->

% elif lang == 'en':
    <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauanlage')} ${c['attributes']['facilityname'] or '-'}</h1></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauanlage')}</td"><td width="70">${c['attributes']['facilityname'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_inbetriebabnahme')}</td><td>${c['attributes']['beginningofoperation'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_zweck')}</td><td>${c['attributes']['facaim_en'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_aufsichtstart')}</td><td>${c['attributes']['startsupervision'] or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraum')}</td"><td width="70">${c['attributes']['reservoirname'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraumvolume')}</td><td>${c['attributes']['impoundmentvolume'] or '-'}&nbsp;Mio. m<sup>3</sup></td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauzielskote')}</td><td>${int(c['attributes']['impoundmentlevel']) or '-'}&nbsp;${_('abk_meter_ueber_meer')}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauhoehe')}</td><td>${int(c['attributes']['storagelevel']) or '-'}&nbsp;m</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_sperre')}</td"><td width="70">${c['value'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damheight')}</td><td>${int(c['attributes']['damheight']) or '-'}&nbsp;m</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlevel')}</td><td>${int(c['attributes']['crestlevel']) or '-'}&nbsp;${_('abk_meter_ueber_meer')}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlength')}</td><td>${int(c['attributes']['crestlength']) or '-'}&nbsp;m</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td><td>${c['attributes']['damtype_en'] or '-'}</td></tr>

% else:
    <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauanlage')} ${c['attributes']['facilityname'] or '-'}</h1></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauanlage')}</td"><td width="70">${c['attributes']['facilityname'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_inbetriebabnahme')}</td><td>${c['attributes']['beginningofoperation'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_zweck')}</td><td>${c['attributes']['facaim_de'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_aufsichtstart')}</td><td>${c['attributes']['startsupervision'] or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraum')}</td"><td width="70">${c['attributes']['reservoirname'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraumvolume')}</td><td>${c['attributes']['impoundmentvolume'] or '-'}&nbsp;Mio. m<sup>3</sup></td></tr>
    <tr><td valign="botton">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauzielskote')}</td><td>${int(c['attributes']['impoundmentlevel']) or '-'}&nbsp;${_('abk_meter_ueber_meer')}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauhoehe')}</td><td>${int(c['attributes']['storagelevel']) or '-'}&nbsp;m</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td valign="bottom" width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_sperre')}</td"><td width="70">${c['value'] or '-'}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damheight')}</td><td>${int(c['attributes']['damheight']) or '-'}&nbsp;m</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlevel')}</td><td>${int(c['attributes']['crestlevel']) or '-'}&nbsp;${_('abk_meter_ueber_meer')}</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlength')}</td><td>${int(c['attributes']['crestlength']) or '-'}&nbsp;m</td></tr>
    <tr><td valign="bottom">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td><td>${c['attributes']['damtype_de'] or '-'}</td></tr>

% endif
</table>
<br/>

% if c['attributes']['has_picture'] == 200:
    <table border="0" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
        <tr><td valign="top">
        <img src="https://dav0.bgdi.admin.ch/bfe_pub/images_stauanlagen/${c['attributes']['facility_stabil_id']}.jpg"/>
        </td><td>&nbsp;</td></tr>
    </table>
% endif 
</%def>
