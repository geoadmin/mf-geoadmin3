<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.name')}</td>
      <td>${c['attributes']['name'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.einzugsgebietsflaeche')}</td>
% if c['attributes']['einzugsgebietsflaeche']:
      <td>${round(c['attributes']['einzugsgebietsflaeche'],2) or '-'}</td>
% else:
    <td>-</td>
% endif
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.fluss')}</td>
      <td>${c['attributes']['fluss'] or '-'}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.m_beginn')}</td>
      <td>${c['attributes']['m_beginn']}</td>
    </tr>
    <tr>
      <td class="cell-left">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.m_ende')}</td>
      <td>${c['attributes']['m_ende']}</td>
    </tr>
</%def>


<%def name="extended_info(c, lang)">

<table>
  <tr>
      <td class="cell-meta">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.datenherkunft')}</td>
      <td class="cell-meta">${c['attributes']['datenherkunft'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.nummer')}</td>
    <td class="cell-meta">${c['attributes']['nummer'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.name')}</td>
    <td class="cell-meta">${c['attributes']['name'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.rechtswert')}</td>
% if c['attributes']['rechtswert']:    
    <td class="cell-meta">${round(c['attributes']['rechtswert'],2) or '-'}</td>
% else:
    <td>-</td>
% endif
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.hochwert')}</td>
% if c['attributes']['hochwert']:
    <td class="cell-meta">${round(c['attributes']['hochwert'],2) or '-'}</td>
% else:
    <td>-</td>
% endif
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.hoehe')}</td>
% if c['attributes']['hoehe']:
    <td class="cell-meta">${round(c['attributes']['hoehe'],2) or '-'}</td>
% else:
    <td>-</td>
% endif
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.einzugsgebietsflaeche')}</td>
% if c['attributes']['einzugsgebietsflaeche']:    
    <td class="cell-meta">${round(c['attributes']['einzugsgebietsflaeche'],2) or '-'}</td>
% else:
    <td>-</td>
% endif
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.fluss')}</td>
    <td class="cell-meta">${c['attributes']['fluss'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.m_beginn')}</td>
    <td class="cell-meta">${c['attributes']['m_beginn']}</td>
  </tr>
  <tr>
    <td class="cell-meta">${_('ch.bafu.hydrologie-hochwassergrenzwertpegel.m_ende')}</td>
    <td class="cell-meta">${c['attributes']['m_ende']}</td>
  </tr>
</table>
</%def>
