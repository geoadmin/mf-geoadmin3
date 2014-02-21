<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% 
    c['stable_id'] = True
    lang = lang if lang in ('fr','it','en') else 'de'
    description = 'description_%s' % lang
%>
    <tr><td class="cell-left">${_('tt_sachplan-infrastruktur-schiene_aus_anlage')}</td>         <td>${c['attributes']['name']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.energieforschung_beschreibung')}</td>              <td>${c['attributes'][description] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_sachplan-infrastruktur-schiene_aus_anlageart')}</td>      <td>${c['attributes']['facility_kind'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.energieforschung_projektstatus')}</td>             <td>${c['attributes']['facility_status'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_sachplan-infrastruktur-schiene_aus_validform')}</td>      <td>${c['attributes']['valid_from'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_sachplan-infrastruktur-schiene_aus_doc_title')}</td>      <td>${c['attributes']['doc_title'] or '-'}</td></tr>
</%def>
