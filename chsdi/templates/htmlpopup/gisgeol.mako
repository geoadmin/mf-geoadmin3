<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
<%
    import markupsafe
    from chsdi.lib.zadara_helpers import find_files, hbytes

    c['stable_id'] = False
    sgd_nr = c['layerBodId'] + '.' + 'sgd_nr'
    files = [fileObject for fileObject in find_files(request, 'ch.swisstopo.geologie-gisgeol', str(c['attributes']['sgd_nr'])+'.pdf')]

    def br(text):
        return text.replace('\n', markupsafe.Markup('<br />'))
%>
    <tr><td class="cell-left">${_('sgd_nr')}</td><td>${c['attributes']['sgd_nr']}</td></tr>
    <tr><td class="cell-left">${_('original_document_id')}</td><td>${c['attributes']['orig_id']}</td></tr>
    <tr><td class="cell-left">${_('title')}</td><td>${c['attributes']['title'] | br}</td></tr>
    <tr><td class="cell-left">${_('author')}</td><td>${c['attributes']['author'] | br}</td></tr>
    <tr><td class="cell-left">${_('report_structure')}</td><td>${c['attributes']['report_structure'] | br}</td></tr>
    <tr><td class="cell-left">${_('auxiliary_information')}</td><td>${c['attributes']['aux_info'] | br}</td></tr>
    <tr><td class="cell-left">${_('doccreation_date')}</td><td>${c['attributes']['doccreation']}</td></tr>
    <tr><td class="cell-left">${_('copy_avail')}</td><td>${c['attributes']['copy_avail']}</td></tr>
    <tr><td class="cell-left">${_('view_avail')}</td><td>${c['attributes']['view_avail']}</td></tr>
    <tr><td class="cell-left">${_('pdf_url')}</td>
        <td>
    % if len(files) > 0:
      % for fileObject in files:
        % if fileObject['size'] > 200*1024*1024:
          <a href="mailto:geolinfo@swisstopo.ch?subject=Document order InfoGeol no.: ${fileObject['name']}" target="_blank">
            geolinfo@swisstopo.ch - ${hbytes(fileObject['size'])}
          </a>
        % else:
          <a href="${fileObject['url']}" target="_blank" title="Download ${fileObject['name']} ${hbytes(fileObject['size'])}" target="_blank">
            ${fileObject['name']} - ${hbytes(fileObject['size'])}
          </a>
        % endif
          <br>
      % endfor
    % else:
          <a href="mailto:geolinfo@swisstopo.ch?subject=Document order InfoGeol no.: ${c['attributes']['sgd_nr']}" target="_blank">
            geolinfo@swisstopo.ch - InfoGeol no.: ${c['attributes']['sgd_nr']}
          </a>
    % endif
        </td>
    </tr>
</%def>
