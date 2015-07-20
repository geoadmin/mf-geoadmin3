<%inherit file="base.mako"/> 

<%def name="table_body(c, lang)">
<% 
    c['stable_id'] = True
    lang = lang if lang != 'rm' else 'de'
    projektstatus = 'projektstatus_%s' % lang
%>
 <colgroup>
  <col width=30%>
  <col width=70%>
 </colgroup>
<tr>
  <td class="cell-left">${_('ch.bfe.energieforschung.titel')}</td>
  <td>${c['attributes']['titel'] or '-'}</td>
</tr>
<tr>
  <td class="cell-left">${_('ch.bfe.energieforschung.beschreibung')}</td>
  <td>${c['attributes']['beschreibung'] or '-'}</td>
</tr>
<tr>
  <td class="cell-left">${_('ch.bfe.energieforschung.leuchtturm')}</td>
% if c['attributes']['leuchtturm']==0:
      <td class="cell-left">${_('leuchtturm_0')}</td>
% else:
      <td class="cell-left">${_('leuchtturm_1')}</td>
%endif
</tr>
<tr>
  <td class="cell-left">${_('ch.bfe.energieforschung.projektstatus')}</td>
  <td>${c['attributes'][projektstatus] or '-'}</td>
</tr>
</%def>

<%def name="extended_info(c, lang)">
<%
import datetime
c['stable_id'] = True
lang = 'de' if lang == 'rm' else lang
projektstatus = 'projektstatus_%s' %lang
oberthema = 'oberthema_%s' %lang
unterthema = 'unterthema_%s' %lang
date_beginn = datetime.datetime.strptime(c['attributes']['projektbeginn'].strip(), "%Y-%m-%d").strftime("%d.%m.%Y")
date_ende = datetime.datetime.strptime(c['attributes']['projektende'].strip(), "%Y-%m-%d").strftime("%d.%m.%Y")
%>

<table>
 <colgroup>
  <col width=40%>
  <col width=60%>
 </colgroup>
  <tr>
    <td class="cell-meta-one" colspan="2">
      <h1>${c['attributes']['titel'] or '-'}</h1>
    </td>
  </tr>
  <tr>
    <td class="cell-meta-one" colspan="2">
      ${c['attributes']['beschreibung'] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta-one" colspan="2">&nbsp;</td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('ch.bfe.energieforschung.projektnummer')}
    </td>
    <td class="cell-meta">
      ${c['attributes']['projektnummer'] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bfe.energieforschung.leuchtturm')}</td>
    % if c['attributes']['leuchtturm']==0:
    <td class="cell-meta">${_('leuchtturm_0')}</td>
    % else:
    <td class="cell-meta">${_('leuchtturm_1')}</td>
    %endif
  </tr>
  <tr>
    <td class="cell-meta-one" colspan="2">&nbsp;</td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('ch.bfe.energieforschung.projektstatus')}
    </td>
    <td class="cell-meta">
      ${c['attributes'][projektstatus] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('ch.bfe.energieforschung.projektdauer')}
    </td>
    <td class="cell-meta">
      ${date_beginn or '-'}  -  ${date_ende or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('ch.bfe.energieforschung.thema')}
    </td>
    <td class="cell-meta">
      ${c['attributes'][oberthema] or '-'}:<br/>
      ${c['attributes'][unterthema] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('ch.bfe.energieforschung.bericht')}
    </td>
    % if c['attributes']['bericht'] == "":
       <td class="cell-meta">-</td>
    % else:
     <td class="cell-meta"> <a target="_blank" href="${c['attributes']['bericht']}">Link</a></td>
    % endif
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('ch.bfe.energieforschung.fachartikel')}
    </td>
    % if c['attributes']['fachartikel'] == "":
       <td class="cell-meta">-</td>
    % else:
       <td class="cell-meta"> <a target="_blank" href="${c['attributes']['fachartikel']}">Link</a></td>
    % endif
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('ch.bfe.energieforschung.infoclip')}
    </td>
    % if c['attributes']['infoclip'] == "":
       <td class="cell-meta">-</td>
    % else:
       <td class="cell-meta"> <a target="_blank" href="${c['attributes']['infoclip'] or '-'}">Link</a></td>
    % endif
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('ch.bfe.energieforschung.projektpartner')}
    </td>
    <td class="cell-meta">
      ${c['attributes']['projektpartner'] or '-'}
    </td>
  </tr> 
  <tr>
    <td class="cell-meta">
      ${_('ch.bfe.energieforschung.kontakt')}
    </td>
    <td class="cell-meta">
      ${c['attributes']['kontakt'] or '-'}
    </td>
  </tr>
  <tr>
    <td class="cell-meta">
      ${_('ch.bfe.energieforschung.projektstandort')}
    </td>
    <td class="cell-meta">
      ${c['attributes']['plz'] or '-'} ${c['attributes']['ort'] or '-'} (${c['attributes']['kanton'] or '-'})
    </td>
  </tr>
  <tr>
    <td class="cell-meta-one" colspan="2">&nbsp;</td>
  </tr>
</table>
</br>
<div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls">
  <div class="slides"></div>
  <div class="title">${c['attributes']['titel'] or ''}</div>
  <a class="prev">&lsaquo;</a>
  <a class="next">&rsaquo;</a>
  <a class="close">x</a>
  <a class="play-pause"></a>
  <ol class="indicator"></ol>
</div>
<div class="thumbnail-container">
% if c['attributes']['bild0']:
  <div class="thumbnail">
    <a href="http://www.bfe-gis.admin.ch/bilder/ch.bfe.energieforschung/${c['attributes']['bild0']}.jpeg">
      <img class="image" src="http://www.bfe-gis.admin.ch/bilder/ch.bfe.energieforschung/${c['attributes']['bild0']}.jpeg" alt=""/>
    </a>
  </div>
% endif
% if c['attributes']['bild1']:
  <div class="thumbnail">
    <a href="http://www.bfe-gis.admin.ch/bilder/ch.bfe.energieforschung/${c['attributes']['bild1']}.jpeg">
      <img class="image" src="http://www.bfe-gis.admin.ch/bilder/ch.bfe.energieforschung/${c['attributes']['bild1']}.jpeg" alt=""/>
    </a>
  </div>
% endif
% if c['attributes']['bild2']:
  <div class="thumbnail">
    <a href="http://www.bfe-gis.admin.ch/bilder/ch.bfe.energieforschung/${c['attributes']['bild2']}.jpeg">
      <img class="image" src="http://www.bfe-gis.admin.ch/bilder/ch.bfe.energieforschung/${c['attributes']['bild2']}.jpeg" alt=""/>
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
