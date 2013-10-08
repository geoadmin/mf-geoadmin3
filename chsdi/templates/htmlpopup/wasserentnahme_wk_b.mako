<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">${_('kanton')}</td>          <td>${c['attributes']['kanton'] or '-'}</td></tr>
    <tr><td width="150">${_('kantoncode')}</td>         <td>${c['attributes']['kantoncode'] or '-'}</td></tr>
    <tr><td width="150">${_('rwknr')}</td>          <td>${c['attributes']['rwknr']}</td></tr>
    <tr><td width="150">${_('ent_gew')}</td>         <td>${c['attributes']['ent_gew'] or '-'}</td></tr>
    <tr><td width="150">${_('pdf')}</td>    <td><a href="http://www.ubst.bafu.admin.ch/restwasser/data/data/er/fr/${c['attributes']['link'] or '-'}" target="_blank">Link</a></td></tr>
</%def>

