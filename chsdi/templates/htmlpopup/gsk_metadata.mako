<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">


    <tr><td class="cell-left">${_('nr')}</td>                    <td>${c['featureId']}</td></tr> 
    <tr><td class="cell-left">${_('title')}</td>                 <td>${c['attributes']['titel'] or _('notintoposhop')}</td></tr>
    <tr><td class="cell-left">${_('ausgabejahr')}</td>           <td>${c['attributes']['jahr'] or _('notintoposhop')}</td></tr>
    <tr><td class="cell-left">${_('tt_lubis_massstab')}</td>     <td>${c['attributes']['massstab'] or _('notintoposhop')}</td></tr>
    <tr><td class="cell-left">${_('autor')}</td>                 <td>${c['attributes']['author'] or _('notintoposhop')}</td></tr>
    <tr><td class="cell-left">${_('format_de')}</td>             <td>${c['attributes']['format_kz'] or _('notintoposhop')}</td></tr>


</%def>
