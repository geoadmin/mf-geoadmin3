<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

    <tr><td class="cell-left">${_('ch.bafu.hydrologie-gewaesserzustandsmessstationen.name')}</td>    <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td>${_('ch.bafu.hydrologie-gewaesserzustandsmessstationen.gewaesser')}</td>   <td>${c['attributes']['gewaesser'] or '-'}</td></tr>
    <tr><td>${_('ch.bafu.hydrologie-gewaesserzustandsmessstationen.nr')}</td>   <td>${c['attributes']['nr'] or '-'()}</td></tr>

</%def>

