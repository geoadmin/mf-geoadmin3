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
    <td><a target="_blank" href="http://www.alexandria.ch/primo_library/libweb/action/dlSearch.do?institution=BIG&vid=ALEX&scope=default_scope&query=lsr07,contains,${c['attributes']['bv_nummer']}">${c['attributes']['kbbez'] or '-'}</a></td>
  </tr>
</%def>
