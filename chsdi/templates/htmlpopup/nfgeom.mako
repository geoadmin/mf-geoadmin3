<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
    <tr><td class="cell-left">${_('nffirmenname')}</td>    <td>${c['attributes']['firmenname'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('nfname')}</td>    <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('grundadresse')}</td>
      % if c['attributes']['adresse'].strip() == '#':
           <td>-</td>
      % else:  
           <td>
        % for address in c['attributes']['adresse'].split('#'):
          ${address or '-'} <br>
        % endfor
      </td>
      % endif
    </tr>
    <tr><td class="cell-left">${_('grundtel')}</td>    <td>${c['attributes']['telefon'] or '-'}</td></tr>
     <tr><td class="cell-left">${_('grundurl')}</td>
      % if c['attributes']['email'] == None:
       <td>-</td>
      % elif "@" in c['attributes']['email']:
           <td><a href="mailto:${c['attributes']['email']}">${_(c['attributes']['email']) or '-'}</a></td>
      % elif "http" in c['attributes']['email']:
           <td><a target="_blank" href="${c['attributes']['email']}">${c['attributes']['email'] or '-'}</a></td>
      </tr>
      % endif
</%def>
