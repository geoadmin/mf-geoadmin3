<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    % if c['attributes']['quality'] and c['attributes']:
        <tr><td class="cell-left">${_('quality')}</td>    <td>${c['attributes']['quality'] or '-'}</td></tr>
    % endif
    % if c['attributes']['frame'] and c['attributes']:
    	tr><td class="cell-left">${_('frame')}</td>    <td>${c['attributes']['frame'] or '-'}</td></tr>
    % endif
</%def>
