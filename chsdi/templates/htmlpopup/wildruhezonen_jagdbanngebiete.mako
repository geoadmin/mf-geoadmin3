<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>
% if c['attributes']['wrz_obj'] and (str(c['attributes']['wrz_obj']) != '0'):
    <tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('wrz_name')}</td><td id="wrz-td2-tt">${c['attributes']['wrz_name'] or '-'}&nbsp;(${_('wrz_obj')}&nbsp;${c['attributes']['wrz_obj'] or '-'})</td></tr>
% endif
% if c['attributes']['jb_obj'] and (str(c['attributes']['jb_obj']) != '0'):
    <tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('jb_name')}</td><td id="wrz-td2-tt">${c['attributes']['jb_name'] or '-'}&nbsp;(${_('jb_obj')}&nbsp;${c['attributes']['jb_obj'] or '-'})</td></tr>
% endif
% if c['attributes']['wrz_status']:
    <tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('wrz_status')}</td><td id="wrz-td2-tt">${c['attributes']['wrz_status'] or '-'}</td></tr>
% endif
% if c['attributes']['bestimmung']:
    <tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('bestimmung')}</td><td id="wrz-td2-tt">${c['attributes']['bestimmung'] or '-'}</td></tr>
% endif
% if c['attributes']['zeitraum']:
    <tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('zeitraum')}</td><td id="wrz-td2-tt">${c['attributes']['zeitraum'] or '-'}</td></tr>
% endif
% if c['attributes']['grundlage']:
    <tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('grundlage')}</td><td id="wrz-td2-tt">${c['attributes']['grundlage'] or '-'}</td></tr>
% endif
% if c['attributes']['zusatzinfo']:
    <tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('zusatzinfo')}</td><td id="wrz-td2-tt">${c['attributes']['zusatzinfo'] or '-'}</td></tr>
% endif
% if c['attributes']['bearbeitungsjahr'] and c['attributes']['bearbeitungsjahr'] !='0':
    <tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('bearbeitungsjahr')}</td><td id="wrz-td2-tt">${c['attributes']['bearbeitungsjahr'] or '-'}</td></tr>
% endif
% if c['attributes']['kanton']:
    <tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('kanton')}</td><td id="wrz-td2-tt">${c['attributes']['kanton'] or '-'}</td></tr>
% endif
</%def>
