<%inherit file="base.mako"/> 

<%def name="preview()">
   % if lang =='fr':
   ${c['attributes']['titel_fr'] or '-'}
   % elif lang == 'it':
   ${c['attributes']['titel_it'] or '-'}
   % elif lang =='en':
   ${c['attributes']['titel_en'] or '-'}
  % else:
  ${c['attributes']['titel_de'] or '-'}
  % endif
</%def>


<%def name="table_body(c, lang)">
<% c[stable_id] = True %>
% if lang =='fr':
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projekttitel')}</td><td>${c['value']}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_beschreibung')}</td><td>${c['attributes']['beschreibung_fr'] or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td><td>${c['attributes']['projektstatus_fr'] or '-'}</td></tr>

% elif c.lang == 'it':
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projekttitel')}</td><td>${c['value']}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_beschreibung')}</td><td>${c['attributes']['beschreibung_it'] or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td><td>${c['attributes']['projektstatus_it'] or '-'}</td></tr>

% elif c.lang =='en':
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projekttitel')}</td><td>${c['value']}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_beschreibung')}</td><td>${c['attributes']['beschreibung_en'] or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td><td>${c['attributes']['projektstatus_en'] or '-'}</td></tr>

% else:
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projekttitel')}</td><td>${c['value']}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_beschreibung')}</td><td>${c['attributes']['beschreibung_de'] or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td><td>${c['attributes']['projektstatus_de'] or '-'}</td></tr>
% endif

% if c['attributes']['schlussbericht']:
    <tr><td width="150">${_('tt_ch.bfe.energieforschung_schlussbericht')}</td><td><a href="${c['attributes']['schlussbericht']}" target="_blank">${_('tt_ch.bfe.energieforschung_schlussbericht')}</a></td></tr>
% endif

<tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_kontaktperson')}</td><td>${c['attributes']['kontaktperson_bfe'] or '-'}</td></tr>
<tr><td width="150" valign="top"></td><td><a href="${path_url}/../${c['attributes']['id']}.html?layer=${c['attributes']['layer_id']}&lang=${lang}&baseUrl=${baseUrl}" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>


</%def>


<%def name="body()">
<% c.stable_id = True %>
<table border="0" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
% if c.lang =='fr':
    <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">${c.feature.titel_fr or '-'}</h1></tr>
    <tr><td width="100%" valign="top" colspan="2">${c.feature.beschreibung_fr or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top" width="30%">${_('tt_ch.bfe.energieforschung_projekt_nr')}</td"><td width="70">${c.feature.projektnummer or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td><td>${c.feature.projektstatus_fr or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_projektanfang')}</td><td>${c.feature.anfang or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_projektende')}</td><td>${c.feature.ende or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_ch_hauptbereich')}</td><td>${c.feature.ch_hauptbereich_fr or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_ch_unterbereich')}</td><td>${c.feature.ch_unterbereich_fr or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_iea_hauptbereich')}</td><td>${c.feature.iea_hauptbereich_fr or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_iea_unterbereich')}</td><td>${c.feature.iea_unterbereich_fr or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_schluesselwoerter')}</td><td>${c.feature.schluesselwoerter or '-'}</td></tr>
    % if c.feature.schlussbericht:
    <tr><td>${_('tt_ch.bfe.energieforschung_schlussbericht')}</td><td><a href="${c.feature.schlussbericht}" class="tooltip_red_link" target="_blank">Link</a></td></tr>
    % endif
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_beauftragter')}</td><td>${c.feature.beauftragter_1}
    % if c.feature.beauftragter_2:
    , ${c.feature.beauftragter_2}
    % endif
    % if c.feature.beauftragter_3:
    , ${c.feature.beauftragter_3}
    % endif
    </td></tr><tr><td valign="top">${_('tt_ch.bfe.energieforschung_kontaktperson')}</td><td>${c.feature.kontaktperson_bfe or '-'}</td></tr>
     <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_sprachregion')}</td><td>${c.feature.sprachregion_fr or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_installationsort')}</td><td>${c.feature.plz or '-'}&nbsp;${c.feature.ort_fr or '-'}</td></tr>
    <tr><td valign="top">${_('kanton')}</td><td>${c.feature.kanton or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_land')}</td><td>CH</td></tr>
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>

% elif c.lang == 'it':
    <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">${c.feature.titel_it or '-'}</h1></tr>
    <tr><td width="100%" valign="top" colspan="2">${c.feature.beschreibung_it or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top" width="30%">${_('tt_ch.bfe.energieforschung_projekt_nr')}</td"><td width="70">${c.feature.projektnummer or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td><td>${c.feature.projektstatus_it or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_projektanfang')}</td><td>${c.feature.anfang or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_projektende')}</td><td>${c.feature.ende or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_ch_hauptbereich')}</td><td>${c.feature.ch_hauptbereich_it or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_ch_unterbereich')}</td><td>${c.feature.ch_unterbereich_it or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_iea_hauptbereich')}</td><td>${c.feature.iea_hauptbereich_it or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_iea_unterbereich')}</td><td>${c.feature.iea_unterbereich_it or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_schluesselwoerter')}</td><td>${c.feature.schluesselwoerter or '-'}</td></tr>
    % if c.feature.schlussbericht:
    <tr><td>${_('tt_ch.bfe.energieforschung_schlussbericht')}</td><td><a href="${c.feature.schlussbericht}" class="tooltip_red_link" target="_blank">Link</a></td></tr>
    % endif
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_beauftragter')}</td><td>${c.feature.beauftragter_1}
    % if c.feature.beauftragter_2:
    , ${c.feature.beauftragter_2}
    % endif
    % if c.feature.beauftragter_3:
    , ${c.feature.beauftragter_3}
    % endif
    </td></tr><tr><td valign="top">${_('tt_ch.bfe.energieforschung_kontaktperson')}</td><td>${c.feature.kontaktperson_bfe or '-'}</td></tr>
     <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_sprachregion')}</td><td>${c.feature.sprachregion_it or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_installationsort')}</td><td>${c.feature.plz or '-'}&nbsp;${c.feature.ort_it or '-'}</td></tr>
    <tr><td valign="top">${_('kanton')}</td><td>${c.feature.kanton or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_land')}</td><td>CH</td></tr>
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>

% elif c.lang =='en':
    <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">${c.feature.titel_en or '-'}</h1></tr>
    <tr><td width="100%" valign="top" colspan="2">${c.feature.beschreibung_en or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top" width="30%">${_('tt_ch.bfe.energieforschung_projekt_nr')}</td"><td width="70">${c.feature.projektnummer or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td><td>${c.feature.projektstatus_en or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_projektanfang')}</td><td>${c.feature.anfang or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_projektende')}</td><td>${c.feature.ende or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_ch_hauptbereich')}</td><td>${c.feature.ch_hauptbereich_en or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_ch_unterbereich')}</td><td>${c.feature.ch_unterbereich_en or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_iea_hauptbereich')}</td><td>${c.feature.iea_hauptbereich_en or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_iea_unterbereich')}</td><td>${c.feature.iea_unterbereich_en or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_schluesselwoerter')}</td><td>${c.feature.schluesselwoerter or '-'}</td></tr>
    % if c.feature.schlussbericht:
    <tr><td>${_('tt_ch.bfe.energieforschung_schlussbericht')}</td><td><a href="${c.feature.schlussbericht}" class="tooltip_red_link" target="_blank">Link</a></td></tr>
    % endif
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_beauftragter')}</td><td>${c.feature.beauftragter_1}
    % if c.feature.beauftragter_2:
    , ${c.feature.beauftragter_2}
    % endif
    % if c.feature.beauftragter_3:
    , ${c.feature.beauftragter_3}
    % endif
    </td></tr><tr><td valign="top">${_('tt_ch.bfe.energieforschung_kontaktperson')}</td><td>${c.feature.kontaktperson_bfe or '-'}</td></tr>
     <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_sprachregion')}</td><td>${c.feature.sprachregion_en or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_installationsort')}</td><td>${c.feature.plz or '-'}&nbsp;${c.feature.ort_en or '-'}</td></tr>
    <tr><td valign="top">${_('kanton')}</td><td>${c.feature.kanton or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_land')}</td><td>CH</td></tr>
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>

% else:
    <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">${c.feature.titel_de or '-'}</h1></tr>
    <tr><td width="100%" valign="top" colspan="2">${c.feature.beschreibung_de or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top" width="30%">${_('tt_ch.bfe.energieforschung_projekt_nr')}</td"><td width="70">${c.feature.projektnummer or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td><td>${c.feature.projektstatus_de or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_projektanfang')}</td><td>${c.feature.anfang or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_projektende')}</td><td>${c.feature.ende or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_ch_hauptbereich')}</td><td>${c.feature.ch_hauptbereich_de or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_ch_unterbereich')}</td><td>${c.feature.ch_unterbereich_de or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_iea_hauptbereich')}</td><td>${c.feature.iea_hauptbereich_de or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_iea_unterbereich')}</td><td>${c.feature.iea_unterbereich_de or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_schluesselwoerter')}</td><td>${c.feature.schluesselwoerter or '-'}</td></tr>
    % if c.feature.schlussbericht:
    <tr><td>${_('tt_ch.bfe.energieforschung_schlussbericht')}</td><td><a href="${c.feature.schlussbericht}" class="tooltip_red_link" target="_blank">Link</a></td></tr>
    % endif
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_beauftragter')}</td><td>${c.feature.beauftragter_1}    
    % if c.feature.beauftragter_2:
    , ${c.feature.beauftragter_2} 
    % endif
    % if c.feature.beauftragter_3:
    , ${c.feature.beauftragter_3}
    % endif
    </td></tr><tr><td valign="top">${_('tt_ch.bfe.energieforschung_kontaktperson')}</td><td>${c.feature.kontaktperson_bfe or '-'}</td></tr>
     <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_sprachregion')}</td><td>${c.feature.sprachregion_de or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_installationsort')}</td><td>${c.feature.plz or '-'}&nbsp;${c.feature.ort_de or '-'}</td></tr>
    <tr><td valign="top">${_('kanton')}</td><td>${c.feature.kanton or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.energieforschung_land')}</td><td>CH</td></tr>
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>


% endif
</table>
<br/>
<table border="0" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
     <tr><td width="48%" valign="top">
% if c.feature.bild_1:
     <img src="https://dav0.bgdi.admin.ch/bfe_pub/images_energieforschung/${c.feature.bild_1}.jpg" alt="" width="300px" />
% endif 
     </td><td width="48%" valign="top">
% if c.feature.bild_2:     
     <img src="https://dav0.bgdi.admin.ch/bfe_pub/images_energieforschung/${c.feature.bild_2}.jpg" alt="" width="300px" />
% endif     
     </td></tr><tr><td width="48%" valign="top">
% if c.feature.bild_3:     
     <img src="https://dav0.bgdi.admin.ch/bfe_pub/images_energieforschung/${c.feature.bild_3}.jpg" alt="" width="300px" />
% endif     
     </td><td>&nbsp;</td></tr>
</table>

</%def>
