<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

    <tr><td class="cell-left">${_('ch.bafu.strukturguete-hochrhein_linkesufer.datenherkunft')}</td>
    <td>${c['attributes']['datenherkunft'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.strukturguete-hochrhein_linkesufer.lumfeld')}</td>
    <td>${c['attributes']['lumfeld'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.strukturguete-hochrhein_linkesufer.lufer')}</td>
    <td>${c['attributes']['lufer'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.strukturguete-hochrhein_linkesufer.sohle')}</td>
    <td>${c['attributes']['sohle'] or '-'}</td></tr> 
    <tr><td class="cell-left">${_('ch.bafu.strukturguete-hochrhein_linkesufer.rufer')}</td>
    <td>${c['attributes']['rufer'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('ch.bafu.strukturguete-hochrhein_linkesufer.rumfeld')}</td>
    <td>${c['attributes']['rumfeld'] or '-'}</td></tr>
</%def>

