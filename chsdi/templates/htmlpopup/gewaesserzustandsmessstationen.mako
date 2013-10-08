<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

    <tr><td width="150">${_('messstandort_name')}</td>    <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td>${_('gewaesser')}</td>   <td>${c['attributes']['gewaesser'] or '-'}</td></tr>
    <tr><td>${_('wassertemp_nr')}</td>   <td>${c['attributes']['nr'] or '-'()}</td></tr>

</%def>

