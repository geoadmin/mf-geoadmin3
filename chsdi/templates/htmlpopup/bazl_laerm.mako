<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">${_('tt_ch.bazl.laermbelastungskataster.registername')}</td>          <td>${c['attributes']['noisepollutionregister_registername']}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bazl.laermbelastungskataster.editor')}</td>                <td>${c['attributes']['noisepollutionregister_editor'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bazl.laermbelastungskataster.validfrom')}</td>             <td>${c['attributes']['noisepollutionregister_validity_validfrom'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bazl.laermbelastungskataster.exposuretype')}</td>          <td>${c['attributes']['exposuregroup_exposuretype'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bazl.laermbelastungskataster.level_db')}</td>              <td>${c['attributes']['exposurecurve_level_db'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bazl.laermbelastungskataster.documentlink')}</td>          <td><a href="${c['attributes']['noisepollutionregister_documentlink'] or '-'}" target="_blank">${_('tt_ch.bazl.laermbelastungskataster.documentlink')}</a></td></tr>
</%def>
