<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>
<%
    lang = lang if lang != 'rm' else 'de'
%>

    <tr><td class="cell-left">${_('betrieb')}</td>                     <td>${c['attributes']['betrieb'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_swissprtr_ort')}</td>            <td>${c['attributes']['ort'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_swissprtr_detaildaten')}</td>    <td><a href="http://www.prtr.admin.ch/prtrPublicwebsite/CompanyDetails.aspx?IDCompany=${c['featureId']}&Year=${c['attributes']['jahr'] or '-'}&lng=${lang}" target="_blank">${_('linkzurbeschreibung')}</a></td></tr>
</%def>

