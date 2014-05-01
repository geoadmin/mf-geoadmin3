<%inherit file="base.mako"/>
<%!
    import markupsafe
    def br(text):
        return text.replace('\n', markupsafe.Markup('<br />'))
%>

<%def name="table_body(c,lang)">
    <% c['stable_id'] = False %>
    <tr><td class="cell-left">${_('sgd_nr')}</td><td>${c['attributes']['sgd_nr']}</td></tr>
    <tr><td class="cell-left">${_('title')}</td><td>${c['attributes']['title'] | br }</td></tr>
    <tr><td class="cell-left">${_('author')}</td><td>${c['attributes']['author']}</td></tr>
    <tr><td class="cell-left">${_('report_structure')}</td><td>${c['attributes']['report_structure']}</td></tr>
    <tr><td class="cell-left">${_('auxiliary_information')}</td><td>${c['attributes']['aux_info'] | br }</td></tr>
    <tr><td class="cell-left">${_('doccreation_date')}</td><td>${c['attributes']['doccreation']}</td></tr>
    <tr><td class="cell-left">${_('copy_avail')}</td><td>${c['attributes']['copy_avail']}</td></tr>
    <tr><td class="cell-left">${_('view_avail')}</td><td>${c['attributes']['view_avail']}</td></tr>
    <tr><td class="cell-left">${_('pdf_url')}</td><td>
% if c['attributes']['pdf_url']:
    <a target="_blank" href="${c['attributes']['pdf_url']}">${c['attributes']['pdf_url'] or '-'}</a>
% else:
    -
% endif
    </td></tr>
</%def>
