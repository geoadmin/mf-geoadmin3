<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">

<%
    lang = 'fr' if lang in ('fr', 'it') else 'dt'
    zusta = 'zusta_%s' % lang
%>

    <tr><td class="cell-left">${_('tt_ch.bafu.fauna-wildtierkorridor_national_nr')}</td>       <td>${c['attributes']['nr'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('tt_ch.bafu.fauna-wildtierkorridor_national_zustand')}</td>  <td>${c['attributes'][zusta] or '-'}</td></tr>
    <tr><td class="cell-left">${_('pdf')}</td>                                         <td>
    % if c['attributes']['nr']:
      <a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/bafu/${c['attributes']['nr']}.pdf" target="_blank">${_('link')}</a>
    % else:
      -
    % endif
     </td></tr>

</%def>

