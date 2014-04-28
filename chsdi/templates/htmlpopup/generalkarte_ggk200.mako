<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr>
        <td>${_('linkzurlegende')}</td>
        <td><a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/geologie/ggk200/${c['attributes']['pdf_file']}.pdf" target="_blank">${_('link')}</a>
     </td>
    </tr>
</%def>

