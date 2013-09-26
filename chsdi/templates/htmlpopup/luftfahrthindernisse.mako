<%inherit file="base.mako"/>

<%def name="table_body()">

% if c['attributes']['sanctiontext'] == 'VOID':
    <% sanctiontext = '-' %>
% else:
    <% sanctiontext = c['attributes']['sanctiontext'] %>
% endif
    <tr><td width="170">${_('tt_ch.bazl.registrationnummer')}</td>      <td>${c['attributes']['registrationnumber']}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.kartnummer')}</td>              <td>${c['attributes']['lk100']}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.hindernisart')}</td>            <td>${c['attributes']['obstacletype']}</td></tr>
    <tr><td width="170">${_('status')}</td>                             <td>${c['attributes']['state']}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.maxheight')}</td>               <td>${c['attributes']['maxheightagl']}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.elevation')}</td>               <td>${c['attributes']['topelevationamsl']}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.totallength')}</td>             <td>${c['attributes']['totallength']}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.startofconstruction')}</td>     <td>${c['attributes']['startofconstruction'] or '-'}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.abortionaccomplished')}</td>    <td>${c['attributes']['duration'] or '-'}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.markierung')}</td>              <td>${sanctiontext}</td></tr>
</%def>
