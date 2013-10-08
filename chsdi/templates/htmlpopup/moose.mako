<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('bafu_population')}</td><td>${c['attributes']['populationsnr'] or '-'}</td></tr>
    <tr><td width="150">${_('bafu_jahr')}</td><td>${c['attributes']['jahr'] or '-'}</td></tr>
    <tr><td width="150">${_('bafu_standort')}</td><td>${c['attributes']['standort'] or '-'}</td></tr>
    <tr><td width="150">${_('bafu_RLtext')}</td><td>${c['attributes']['rl_text'] or '-'}</td></tr>
    <tr><td width="150">${_('bafu_NHVText')}</td><td>${c['attributes']['nhv_text'] or '-'}</td></tr>
</%def>

