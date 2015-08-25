<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
<%
    lang = 'fr' if lang in ('fr', 'it') else 'de'
%>
<tr><td class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.gsch_n')}</td><td>${c['attributes']['gsch_n'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.geologie')}</td><td>${c['attributes']['geologie'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.fluss')}</td><td>${c['attributes']['fluss'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.station')}</td><td>${c['attributes']['station'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.institut')}</td><td>${c['attributes']['institut'] or '-'}</td></tr>
<tr><td class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.amt')}</td><td>${c['attributes']['amt'] or '-'}</td></tr>
<%
    webDavHost = request.registry.settings['webdav_host']
    url_pdf = webDavHost + '/kogis_web/downloads/bafu/geschiebemessnetz/' + c['attributes']['pdf_file']
%>
<tr><td class="cell-left">${_('link')}</td>
    <td>
    % if c['attributes']['pdf_file']:
      <a href="${url_pdf}" target="_blank">${_('link')}</a>
    % else:
      -
    % endif
     </td></tr>
</%def>

<%def name="extended_info(c, lang)">
<%
    lang = 'fr' if lang in ('fr', 'it') else 'de'
%>
<table class="table-with-border kernkraftwerke-extended">
<colgroup>
  <col width=50%>
  <col width=50%>
</colgroup>
<tr>
<th class="cell-left">${_('x')}</th>
<td>${int(c['attributes']['rechtswert']) or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('y')}</th>
<td>${int(c['attributes']['hochwert']) or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.gsch_n')}</th>
<td>${c['attributes']['gsch_n'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.lk')}</th>
<td>${c['attributes']['lk'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.lage')}</th>
    % if lang in ('fr','it'):
<td>${c['attributes']['lage_fr'] or '-'}</td>
    % else:
<td>${c['attributes']['lage_de'] or '-'}</td>
    %endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.fn')}</th>
<td>${c['attributes']['fn'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.hmax')}</th>
<td>${c['attributes']['hmax'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.hmin')}</th>
<td>${c['attributes']['hmin'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.hmed')}</th>
<td>${c['attributes']['hmed'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.exp')}</th>
<td>${c['attributes']['exp'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.form')}</th>
<td>${c['attributes']['form'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.geologie')}</th>
<td>${c['attributes']['geologie'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.platz')}</th>
    % if lang in ('fr','it'):
<td>${c['attributes']['platz_fr'] or '-'}</td>
    % else:
<td>${c['attributes']['platz_de'] or '-'}</td>
    %endif
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.fluss')}</th>
<td>${c['attributes']['fluss'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.station')}</th>
<td>${c['attributes']['station'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.institut')}</th>
<td>${c['attributes']['institut'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ch.bafu.feststoffe-geschiebemessnetz.amt')}</th>
<td>${c['attributes']['amt'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('abteilung')}</th>
<td>${c['attributes']['abteilung'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('sektion')}</th>
<td>${c['attributes']['sektion'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('kontakt_name')}</th>
<td>${c['attributes']['kontakt_name'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('strasse_fr_de')}</th>
<td>${c['attributes']['strasse'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('plz_fr_de')}</th>
<td>${c['attributes']['plz'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('ort_fr_de')}</th>
<td>${c['attributes']['ort'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('sachbearb')}</th>
<td>${c['attributes']['sachbearb'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('telephon_fr_de')}</th>
<td>${c['attributes']['telephon'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('fax')}</th>
<td>${c['attributes']['fax'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('emailadresse1')}</th>
<td>${c['attributes']['emailadresse1'] or '-'}</td>
</tr>
<tr>
<th class="cell-left">${_('emailadresse2')}</th>
<td>${c['attributes']['emailadresse2'] or '-'}</td>
</tr>
<tr>
<%
    from chsdi.lib.helpers import resource_exists
    pdf = None
    if c['attributes']['pdf_file'] is not None:
        webDavHost = request.registry.settings['webdav_host']
        url_pdf = webDavHost + '/kogis_web/downloads/bafu/geschiebemessnetz/' + c['attributes']['pdf_file']
        pdf = resource_exists(url_pdf)
%>
<th class="cell-left">${_('link')}</th>
<td>
    % if c['attributes']['pdf_file']:
      <a href="${url_pdf}" target="_blank">${_('link')}</a>
    % else:
      -
    % endif
</td>
</tr>
</table>
</%def>
