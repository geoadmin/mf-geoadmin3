<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

    <tr><td class="cell-left">${_('ch.vbs.armeelogistikcenter.name')}</td>
    <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.vbs.armeelogistikcenter.abkuerzung')}</td>
    <td>${c['attributes']['abkuerzung'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.vbs.armeelogistikcenter.mail')}</td>
    <td><a href="mailto:${c['attributes']['mail'] or '-'}">${_('ch.vbs.armeelogistikcenter.mail')}</a></td>
    <tr><td class="cell-left">${_('ch.vbs.armeelogistikcenter.url')}</td>
    <td><a href="http://${c['attributes']['url'] or '-'}" target="_blank">${_('ch.vbs.armeelogistikcenter.url')}</a></td></tr>
</%def>

