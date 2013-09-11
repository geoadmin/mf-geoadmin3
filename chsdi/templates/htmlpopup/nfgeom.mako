<%inherit file="base.mako"/>

<%def name="preview()">${_('feature')}</%def>

<%def name="table_body(c,lang)">
    <tr><td width="150" valign="top">${_('nffirmenname')}</td>    <td>${c['attributes']['firmenname'] or '-'}</td></tr>
    <tr><td width="150">${_('nfname')}</td>    <td>${c['attributes']['name'] or '-'}</td></tr>
    <tr><td width="150">${_('grundadresse')}</td>
      % if c['attributes']['adresse'].strip() == '#':
           <td>-</td>
      % else:  
           <td>${c['attributes']['adresse'].replace("#","<br>") or '-'}</td>
      % endif
    </tr>
    <tr><td width="150">${_('grundtel')}</td>    <td>${c['attributes']['telefon'] or '-'}</td></tr>
     <tr><td width="150">${_('grundurl')}</td>
      % if c['attributes']['email'] == None:
       <td>-</td>
      % elif "@" in c['attributes']['email']:
           <td><a href="mailto:${c['attributes']['email']}">${_(c['attributes']['email']) or '-'}</a></td>
      % elif "http" in c['attributes']['email']:
           <td><a target="_blank" href="${c['attributes']['email']}">${c['attributes']['email'] or '-'}</a></td>
      </tr>
      % endif
</%def>
