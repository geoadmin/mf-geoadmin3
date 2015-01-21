<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
       <tr><td class="cell-left">${_('ch.swisstopo.verschiebungsvektoren-tsp1.name')}</td><td>${c['attributes']['name'] or '-'}</td></tr>
       <tr><td class="cell-left">${_('typ')}</td><td>${c['attributes']['type'] or '-'}</td></tr>
       <tr><td class="cell-left">${_('fp_Y03_X03')}</td><td>${c['attributes']['e_lv03'] or '-'} / ${c['attributes']['n_lv03'] or '-'}</td></tr>
       <tr><td class="cell-left">${_('fp_E95_N95')}</td><td>${c['attributes']['e_lv95'] or '-'} / ${c['attributes']['n_lv95'] or '-'}</td></tr>
       <tr><td class="cell-left">${_('DE')}</td><td>${c['attributes']['de'] or '-'}</td></tr>
       <tr><td class="cell-left">${_('DN')}</td><td>${c['attributes']['dn'] or '-'}</td></tr>
       <tr><td class="cell-left">${_('FS')}</td><td>${c['attributes']['fs'] or '-'}</td></tr>
</%def>
