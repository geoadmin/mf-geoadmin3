<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
  <%
    product = c['attributes']['produkt']
    productName = 'kartenwerk_%s' % product
  %>
  <tr>
    <td class="cell-left">${_('kartenwerk')}</td>
    <td>${_(productName)}</td>
  </tr>
  <tr>
    <td class="cell-left">${_('kbnum')}</td>
    <td>${c['attributes']['kbnum'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-left">${_('kbbez')}</td>
    <td>${c['attributes']['kbbez'] or '-'}</td>
  </tr>
  <tr>
    <td class="cell-left">${_('release_year')}</td>
    <td>${c['attributes']['release_year'] or '-'}</td></tr>
  <tr>
    <td class="cell-left">${_('blattbezeichnung')}</td>
    <td><a target="_blank" href="http://opac.admin.ch/cgi-bin/gwalex/chameleon?function=INITREQ&SourceScreen=NOFUNC&skin=portal&search=FREEFORM&u1=0&t1=aw%3A${c['attributes']['bv_nummer']}&op1=AND&u2=0&t2=&op2=AND&u3=0&t3=&lng=de&conf=.%2Fchameleon.conf&pos=1&host=biblio.admin.ch+3606+DEFAULT&sortby=pubti&sortdirection=0">${c['attributes']['kbbez'] or '-'}</a></td>
  </tr>
</%def>
