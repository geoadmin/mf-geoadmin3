<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    % if 'kanton' in c['attributes']:
    <tr><td class="cell-left">${_('gemkanton')}</td><td>${c['attributes']['kanton']}</td></tr>
    % endif
    % if 'gemeindename' in c['attributes']:
    <tr><td class="cell-left">${_('gemgemeinde')}</td><td>${c['attributes']['gemeindename']}</td></tr>
    % endif
    % if 'flaeche_ha' in c['attributes']:
    <tr><td class="cell-left">${_('gemflaeche')}</td><td>${c['attributes']['flaeche_ha']}</td></tr>
    %endif
    % if 'bfs_nr' in c['attributes']:
    <tr><td class="cell-left">${_('gembfs')}</td><td>${c['attributes']['bfs_nr']}</td></tr>
    % endif
    <tr><td class="cell-left">${_('gemdarstellung')}</td>
       % if c['attributes']['abgabestelle'] == None:
         <td>-</td>
      % else:
         <td><a target="_blank" href="http://${c['attributes']['abgabestelle'].replace("http://","")}">${"Link" or '-'}</a></td>
      % endif 
    </tr>
    <tr><td class="cell-left">${_('geompdf_liste')}</td>
      % if lang in ('de', 'rm', 'en'):
    <%  lang_pdf = '_de.pdf'
    %>
      % else:
    <%
        lang_pdf = '_' + lang + '.pdf'
    %>
      % endif
    <%
        myarr=c['attributes']['pdf_liste'].split(';')
        list_pdf = filter(lambda x: lang_pdf in x,myarr)
    %>
    <td>
      % for t in list_pdf:
          <% pdf_name = t[34:].replace(".pdf","") %>
          <a href="${t}" target="_blank">${pdf_name}</a><br />
      % endfor
    </td></tr>
</%def>
