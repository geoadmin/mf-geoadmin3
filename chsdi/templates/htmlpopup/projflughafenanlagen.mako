<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150" valign="top">${_('kindofzone')}</td>    <td>${c['attributes']['kind'] or '-'}</td></tr>
    <tr><td width="150">${_('name_bazl')}</td>                  <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td width="150">${_('applicant')}</td>                  <td>${c['attributes']['applicant'] or '-'}</td></tr>
    <tr><td width="150">${_('modif_validfrom')}</td>            <td>${c['attributes']['modif_validfrom'] or '-'}</td></tr>
    <tr><td width="150">${_('durationofeffect')}</td>           <td>${c['attributes']['durationofeffect'] or '-'}</td></tr>
    <tr><td width="150">${_('descriptionText')}</td>            <td>${c['attributes']['description'] or '-'}</td></tr>
    <tr><td width="150">${_('legalregulationlink')}</td>        <td><a target="_blank" href="${c['attributes']['legalregulationlink']}">${_('legalregulationlink') or '-'}</a></td></tr>
</%def>
