<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td class="cell-left">${_('identificator')}</td><td>${c['featureId'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('optionaler_name')}</td><td>${c['attributes']['sg_name']}</td></tr>
    <tr><td class="cell-left">${_('validierungsdatum')}</td><td>${c['attributes']['vali_date'] or '-'}</td></tr>
</%def>

