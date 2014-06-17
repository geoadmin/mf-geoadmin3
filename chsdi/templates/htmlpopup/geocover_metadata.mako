<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('lab')}</td><td>${c['attributes']['nr']} -  ${c['attributes']['titel']}</td></tr> 
    <tr><td class="cell-left">${_('vektorisierung_jahr')}</td><td>${int(c['attributes']['vektorisierung_jahr'])}</td></tr>
    <tr><td class="cell-left">${_('basis')}</td>    <td>${c['attributes']['basis']}</td></tr>
    <tr><td class="cell-left">${_('grat25')}</td>          <td>${c['attributes']['grat25']}</td></tr>
</%def>
