<%inherit file="base.mako"/>

<%def name="table_body(c,lang)">
     <tr><td width="150" valign="top">${_('grundfuehrung')}</td>
     % if lang == 'de' or lang == 'rm' or lang == 'en':
          <td>${c['attributes']['grundbuchfuehrung_d'] or '-'}</td>
     % elif lang == 'fr':
          <td>${c['attributes']['grundbuchfuehrung_f'] or '-'}</td>
     % elif lang == 'it':
          <td>${c['attributes']['grundbuchfuehrung_i'] or '-'}</td>
     % endif
    </tr>
    <tr><td width="150">${_('grundgemeinde')}</td>    <td>${c['attributes']['ortsteil_grundbuch'] or '-'}</td></tr>
    <tr><td width="150">${_('grundkreis')}</td>    <td>${c['attributes']['grundbuchkreis'] or '-'}</td></tr>
    <tr><td width="150">${_('grundadresse')}</td>
    % if c['attributes']['adresse'].strip() == "#":
       <td>-</td></tr>
    % else:
      <td>${c['attributes']['adresse'].replace("#","<br>") or '-'}</td></tr>
    % endif
    <tr><td width="150">${_('grundtel')}</td>    <td>${c['attributes']['telefon'] or '-'}</td></tr>
    <tr><td width="150">${_('grundurl')}</td>
      % if c['attributes']['email'] == None:
        <td>-</td>
      % else:
        <td><a href="mailto:${c['attributes']['email']}">${_(c['attributes']['email']) or '-'}</a></td>
        </tr>
      % endif
</%def>
