<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

<%
    lang = 'fr' if lang in ('fr', 'it') else 'dt'
    zusta = 'zusta_%s' % lang

    if c['attributes']['nr'] is not None:
        webDavHost = request.registry.settings['webdav_host']
        url_pdf = webDavHost + '/kogis_web/downloads/bafu/' + c['attributes']['nr'] + '.pdf'
%>

    <tr><td class="cell-left">${_('tt_ch.bafu.fauna-wildtierkorridor_national_nr')}</td>       <td>${c['attributes']['nr'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.fauna-wildtierkorridor_national_zustand')}</td>  <td>${c['attributes'][zusta] or '-'}</td></tr>
    <tr><td class="cell-left">${_('pdf')}</td>                                         <td>
    % if c['attributes']['nr']:
      <a href="${url_pdf}" target="_blank">${_('link')}</a>
    % else:
      -
    % endif
     </td></tr>

</%def>

