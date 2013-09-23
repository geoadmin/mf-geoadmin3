<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td width="150" valign="top">${_('gemkanton')}</td><td>${c['attributes']['kanton'] or '-'}</td></tr>
    <tr><td width="150">${_('gemgemeinde')}</td><td>${c['attributes']['gemeindename'] or '-'}</td></tr>
    <tr><td width="150">${_('gemflaeche')}</td><td>${c['attributes']['flaeche_ha'] or '-'}</td></tr>
    <tr><td width="150">${_('gembfs')}</td>    <td>${c['attributes']['bfs_nr'] or '-'}</td></tr>
    <tr><td width="150">${_('gemdarstellung')}</td>
       % if c['attributes']['abgabestelle'] == None:
         <td>-</td>
      % else:
         <td><a target="_blank" href="http://${c['attributes']['abgabestelle'].replace("http://","")}">${"Link" or '-'}</a></td>
      % endif 
    </tr>
    <tr><td width="150">${_('geompdf_liste')}</td>
      % if lang == 'de' or lang == 'rm' or lang == 'en':
    <%
        myarr=c['attributes']['pdf_liste'].split(';')
        liste_de = filter(lambda x: "_de.pdf" in x,myarr)
        link = ''
        for t in liste_de:
         link += "<a href=\"" + t + "\" target=\"_blank\">" + t[34:].replace(".pdf","") + "</a><br />"
    %>
      % elif lang == 'fr':
    <%
        myarr=c['attributes']['pdf_liste'].split(';')
        liste_fr = filter(lambda x: "_fr.pdf" in x,myarr)
        link = ''
        for t in liste_fr: 
         link += "<a href=\"" + t + "\" target=\"_blank\">" + t[34:].replace(".pdf","") + "<br />"
    %>
      % elif lang == 'it':
    <%
        myarr=c['attributes']['pdf_liste'].split(';')
        liste_it = filter(lambda x: "_it.pdf" in x, myarr)
        link = ''
        for t in liste_it:
         link += "<a href=\"" + t + "\" target=\"_blank\">" + t[34:].replace(".pdf","") + "</a><br />"
    %>
      % endif
    <td>${link or '-'} </td></tr>
</%def>
