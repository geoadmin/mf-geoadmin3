<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td class="cell-left">${_('kanton')}</td>    <td>${c['attributes']['kanton'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('gemgemeinde')}</td>    <td>${c['attributes']['gemeindename'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('oereb_status')}</td> 
% if lang == 'de':
     <td>${c['attributes']['oereb_status_de'] or '-'}</td></tr> 
% elif lang == 'fr':
     <td>${c['attributes']['oereb_status_fr'] or '-'}</td></tr>
% elif lang == 'it':
     <td>${c['attributes']['oereb_status_it'] or '-'}</td></tr>
% elif lang == 'en':
     <td>${c['attributes']['oereb_status_en'] or '-'}</td></tr>
% elif lang == 'rm':
     <td>${c['attributes']['oereb_status_rm'] or '-'}</td></tr>
% endif
    <tr><td class="cell-left">${_('oereb_firma')}</td>    <td>${c['attributes']['firmenname'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('grundadresse')}</td>
      % if c['attributes']['ort'] == None:
       <td>-</td>
      % else:
        <td>${c['attributes']['adresszeile']} <br>
            ${c['attributes']['plz']} ${c['attributes']['ort']}
        </td>
      % endif
    </tr>
    <tr><td class="cell-left">${_('grundtel')}</td>    <td>${c['attributes']['telefon'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('Email')}</td>
      % if c['attributes']['email'] == None:
       <td>-</td>
      % elif "@" in c['attributes']['email']:
           <td><a href="mailto:${c['attributes']['email']}">${_(c['attributes']['email']) or '-'}</a></td>
      % else:
       <td>-</td>     
      % endif
    </tr>
    <tr><td class="cell-left">${_('gemdarstellung')}</td>
      % if c['attributes']['url_oereb'] == None:
       <td>-</td>
      % else:
         <td><a target="_blank" href="${c['attributes']['url_oereb']}">${_('link')}</a></td>    
      % endif
    </tr>
</%def>
