<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('holzvorrat')}</td>    <td>${c['attributes']['vorrat'] or '-'}</td></tr>
    <tr><td width="150">${_('holz_region')}</td>    <td>${c['attributes']['wireg_'] or '-'}</td></tr>
</%def>

