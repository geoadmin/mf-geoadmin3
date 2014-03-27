<%inherit file="base.mako"/> 

<%def name="table_body(c, lang)">
<% 
    c['stable_id'] = True
    lang = lang if lang != 'rm' else 'de'
    title = 'titel_%s' % lang
    beschreibung = 'beschreibung_%s' % lang
    projektstatus = 'projektstatus_%s' % lang
%>
<tr>
  <td class="cell-left">${_('tt_ch.bfe.energieforschung_projekttitel')}</td>
  <td>${c['attributes'][title] or '-'}</td>
</tr>
<tr>
  <td class="cell-left">${_('tt_ch.bfe.energieforschung_beschreibung')}</td>
  <td>${c['attributes'][beschreibung] or '-'}</td>
</tr>
<tr>
  <td class="cell-left">${_('tt_ch.bfe.energieforschung_projektstatus')}</td>
  <td>${c['attributes'][projektstatus] or '-'}</td>
</tr>

% if 'schlussbericht' in c['attributes']:
<tr>
  <td class="cell-left">${_('tt_ch.bfe.energieforschung_schlussbericht')}</td>
  <td><a href="${c['attributes']['schlussbericht']}" target="_blank">${_('tt_ch.bfe.energieforschung_schlussbericht')}</a></td>
</tr>
% endif

<tr>
  <td class="cell-left">${_('tt_ch.bfe.energieforschung_kontaktperson')}</td>
  <td>${c['attributes']['kontaktperson_bfe'] or '-'}</td>
</tr>
</%def>

<%def name="extended_info(c, lang)">
<%
c['stable_id'] = True
lang = 'de' if lang == 'rm' else lang
title = 'titel_%s' %lang
beschreibung = 'beschreibung_%s' %lang
projektstatus = 'projektstatus_%s' %lang
ch_hauptbereich = 'ch_hauptbereich_%s' %lang
ch_unterbereich = 'ch_unterbereich_%s' %lang
iea_hauptbereich = 'iea_hauptbereich_%s' %lang
iea_unterbereich = 'iea_unterbereich_%s' %lang
sprachregion = 'sprachregion_%s' %lang
ort = 'ort_%s' %lang
%>

<table>
  <tr>
    <td class="cell-meta-one" colspan="2">
      <h1>${c['attributes'][title] or '-'}</h1>
    </td>
  </tr>
  <tr>
    <td class="cell-meta-one" colspan="2">
      ${c['attributes'][beschreibung] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta-one" colspan="2">&nbsp;</td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_projekt_nr')}
    </td>
    <td class="cell-meta">
      ${c['attributes']['projektnummer'] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_projektstatus')}
    </td>
    <td class="cell-meta">
      ${c['attributes'][projektstatus] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_projektanfang')}
    </td>
    <td class="cell-meta">
      ${c['attributes']['anfang'] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_projektende')}
    </td>
    <td class="cell-meta">
      ${c['attributes']['ende'] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta-one" colspan="2">&nbsp;</td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_ch_hauptbereich')}
    </td>
    <td class="cell-meta">
      ${c['attributes'][ch_hauptbereich] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_ch_unterbereich')}
    </td>
    <td class="cell-meta">
      ${c['attributes'][ch_unterbereich] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_iea_hauptbereich')}
    </td>
    <td class="cell-meta">
      ${c['attributes'][iea_hauptbereich] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_iea_unterbereich')}
    </td>
    <td class="cell-meta">
      ${c['attributes'][iea_unterbereich] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta-one" colspan="2">&nbsp;</td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_schluesselwoerter')}
    </td>
    <td class="cell-meta">
      ${c['attributes']['schluesselwoerter'] or '-'}
    </td>
  </tr>
% if c['attributes']['schlussbericht']:
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_schlussbericht')}
    </td>
    <td class="cell-meta">
      <a class="link-red" href="${c['attributes']['schlussbericht']}">Link</a>
    </td>
  </tr>
% endif
  <tr>
    <td class="cell-meta-one" colspan="2">&nbsp;</td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_beauftragter')}
    </td>
    <td class="cell-meta">
      ${c['attributes']['beauftragter_1'] or '-'} 
% if c['attributes']['beauftragter_2']:
      , ${c['attributes']['beauftragter_2']}
% endif
% if c['attributes']['beauftragter_3']:
      , ${c['attributes']['beauftragter_3']}
% endif
    </td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_kontaktperson')}
    </td>
    <td class="cell-meta">
      ${c['attributes']['kontaktperson_bfe'] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta-one" colspan="2">&nbsp;</td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_sprachregion')}
    </td>
    <td class="cell-meta">
      ${c['attributes'][sprachregion] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_installationsort')}
    </td>
    <td class="cell-meta">
      ${c['attributes']['plz'] or '-'}&nbsp;${c['attributes'][ort] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('kanton')}
    </td>
    <td class="cell-meta">
      ${c['attributes']['kanton'] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('tt_ch.bfe.energieforschung_land')}
    </td>
    <td class="cell-meta">
      CH
    </td>
  </tr>
</table>
</br>
<div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls">
  <div class="slides"></div>
  <div class="title">${c['attributes'][title] or ''}</div>
  <a class="prev">&lsaquo;</a>
  <a class="next">&rsaquo;</a>
  <a class="close">x</a>
  <a class="play-pause"></a>
  <ol class="indicator"></ol>
</div>
<div class="thumbnail-container">
% if c['attributes']['bild_1']:
  <div class="thumbnail">
    <a href="https://dav0.bgdi.admin.ch/bfe_pub/images_energieforschung/${c['attributes']['bild_1']}.jpg">
      <img class="image" src="https://dav0.bgdi.admin.ch/bfe_pub/images_energieforschung/${c['attributes']['bild_1']}.jpg" alt=""/>
    </a>
  </div>
% endif
% if c['attributes']['bild_2']:
  <div class="thumbnail">
    <a href="https://dav0.bgdi.admin.ch/bfe_pub/images_energieforschung/${c['attributes']['bild_2']}.jpg">
      <img class="image" src="https://dav0.bgdi.admin.ch/bfe_pub/images_energieforschung/${c['attributes']['bild_2']}.jpg" alt=""/>
    </a>
  </div>
% endif
% if c['attributes']['bild_3']:
  <div class="thumbnail">
    <a href="https://dav0.bgdi.admin.ch/bfe_pub/images_energieforschung/${c['attributes']['bild_3']}.jpg">
      <img class="image" src="https://dav0.bgdi.admin.ch/bfe_pub/images_energieforschung/${c['attributes']['bild_3']}.jpg" alt=""/>
    </a>
  </div>
% endif
</div>
</br>
<script>
$('.thumbnail-container').on('click', function (event) {
  event = event || window.event;
  var target = event.target || event.srcElement,
    link = target.src ? target.parentNode : target,
    options = {index: link, event: event},
    links = this.getElementsByTagName('a');
  blueimp.Gallery(links, options);
});
</script>

</%def>
