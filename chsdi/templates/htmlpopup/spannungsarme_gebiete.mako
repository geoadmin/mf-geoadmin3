<%inherit file="base.mako"/>

<%def name="preview()">${c['value'] or '-'}</%def>

<%def name="table_body(c,lang)">
    <tr><td width="150">${_('identificator')}</td><td>${c['featureId'] or '-'}</td></tr>
    <tr><td width="150">${_('optionaler_name')}</td><td>${c['value']}</td></tr>
    <tr><td width="150">${_('validierungsdatum')}</td><td>${c['attributes']['vali_date'] or '-'}</td></tr>
</%def>

