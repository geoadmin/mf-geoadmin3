<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<%
    lang = lang if lang in ('fr','it') else 'de'
    zonekind_text = 'zonekind_text_%s' % lang
    legalstatus_text = 'legalstatus_text_%s' % lang

%>
    <tr><td width="150" valign="top">${_('kindofzone')}</td>    <td>${c['attributes'][zonekind_text] or '-'}</td></tr>
    <tr><td width="150">${_('applicant')}</td>                  <td>${c['attributes']['applicant'] or '-'}</td></tr>
    <tr><td width="150">${_('gemkanton')}</td>                  <td>${c['attributes']['canton'] or '-'}</td></tr>
    <tr><td width="150">${_('betrgemeinde')}</td>               <td>${c['attributes']['municipality'] or '-'}</td></tr> 
    <tr><td width="150">${_('bazlrechtstatus')}</td>            <td>${c['attributes'][legalstatus_text] or '-'}</td></tr>
    <tr><td width="150">${_('modif_validfrom')}</td>            <td>${c['attributes']['validfrom'] or '-'}</td></tr>
    <tr><td width="150">${_('durationofeffect')}</td>           <td>${c['attributes']['durationofeffect'] or '-'}</td></tr>
    <tr><td width="150">${_('descriptionText')}</td>            <td>${c['attributes']['description'] or '-'}</td></tr>
    <tr><td width="150">${_('legalregulationlink')}</td>        <td><a target="_blank" href="${c['attributes']['weblink_ref']}">${_('legalregulationlink') or '-'}</a></td></tr>
</%def>
