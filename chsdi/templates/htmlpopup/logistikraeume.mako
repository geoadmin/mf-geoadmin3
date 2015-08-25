<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

    <tr><td class="cell-left">${_('ch.vbs.logistikraeume-armeelogistikcenter.kanton')}</td>        
    <td>${c['attributes']['kanton'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.vbs.logistikraeume-armeelogistikcenter.region')}</td>
    <td>${c['attributes']['region'] or '-'}</td></tr>
</%def>

