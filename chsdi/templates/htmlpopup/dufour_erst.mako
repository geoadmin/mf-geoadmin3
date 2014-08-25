<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('tilenumber')}</td> <td>${c['featureId'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('sheetname')}</td> <td>${c['attributes']['kbbez']}</td></tr>
    <tr><td class="cell-left">${_('Datenstand')}</td> <td>${int(round(c['attributes']['datenstand'])) or '-'}</td></tr>
    <tr><td class="cell-left">${_('alexandria')}</td> <td><a href="http://www.alexandria.ch/primo_library/libweb/action/dlSearch.do?institution=BIG&vid=ALEX&scope=default_scope&query=lsr07,contains,${c['attributes']['bv_nummer']}" target="_blank" >${c['attributes']['kbbez'] or '-'}</a></td>
</%def>
