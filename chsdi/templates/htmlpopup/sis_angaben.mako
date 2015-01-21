<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    import datetime
    beschreibung = c['layerBodId'] + '.' + 'description_%s' % lang
    name = c['layerBodId'] + '.' + 'name'
    lang = lang if lang in ('fr','it','de') else 'de'
    description = 'description_%s' % lang
    facility_kind = 'fackind_text_%s' % lang
    facility_status = 'facstatus_text_%s' % lang
    datefrom = datetime.datetime.strptime(c['attributes']['valid_from'].strip(), "%Y%m%d").strftime("%d.%m.%Y")

%>
    <tr><td class="cell-left">${_(name)}</td>         <td>${c['attributes']['name']}</td></tr>
    <tr><td class="cell-left">${_(beschreibung)}</td>              <td>${c['attributes'][description] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_sachplan-infrastruktur-schiene_aus_anlageart')}</td>      <td>${c['attributes'][facility_kind] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bfe.energieforschung_projektstatus')}</td>             <td>${c['attributes'][facility_status] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_sachplan-infrastruktur-schiene_aus_validform')}</td>      <td>${datefrom or '-'}</td></tr>
</%def>
