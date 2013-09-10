<%inherit file="base.mako"/>
<%def name="preview()">${c['featureId'] or '-'}</%def>

<%def name="table_body(c,lang)">
       <tr><td width="150" valign="top">${_('offizielpktnummer')}</td><td>${c['attributes']['name'] or '-'}</td></tr>
       <tr><td width="150">${_('typ')}</td><td>${c['attributes']['type'] or '-'}</td></tr>
       <tr><td width="150">${_('fp_Y03_X03')}</td><td>${c['attributes']['e_lv03'] or '-'} / ${c['attributes']['n_lv03'] or '-'}</td></tr>
       <tr><td width="150">${_('fp_E95_N95')}</td><td>${c['attributes']['e_lv95'] or '-'} / ${c['attributes']['n_lv95'] or '-'}</td></tr>
       <tr><td width="150">${_('DE')}</td><td>${c['attributes']['de'] or '-'}</td></tr>
       <tr><td width="150">${_('DN')}</td><td>${c['attributes']['dn'] or '-'}</td></tr>
       <tr><td width="150">${_('FS')}</td><td>${c['attributes']['fs'] or '-'}</td></tr>
</%def>
