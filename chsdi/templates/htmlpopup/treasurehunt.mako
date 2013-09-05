<%inherit file="base.mako"/>

<%def name="preview()">
    % if lang == 'fr':
        ${c['attributes']['title_fr'] or '-'}
    % elif lang == 'it':
        ${c['attributes']['title_it'] or '-'}
    % else:
        ${c['attributes']['title_de'] or '-'}
    % endif
</%def>

<%def name="table_body(c,lang)">

<tr><td width="150">${_('title')}</td><td>${c['value']}</td></tr>
% if c['attributes']['type_coord'] =='info':
	% if lang =='fr':
	<tr><td width="150" style="vertical-align: top;">${_('information')}</td><td>${c['attributes']['info_fr'] or '-'}</td></tr>
	% elif lang == 'it':
	<tr><td width="150" style="vertical-align: top;">${_('information')}</td><td>${c['attributes']['info_it'] or '-'}</td></tr>
	% else:
	<tr><td width="150" style="vertical-align: top;">${_('information')}</td><td>${c['attributes']['info_de'] or '-'}</td></tr>
	% endif
% else:
	% if lang =='fr':
	<tr><td width="150" style="vertical-align: top;">${_('link')}</td><td><span>Bravo! Clique </span><a href="${c['attributes']['link_fr'] or '-'}" target="_parent">ici</a><span> afin de découvrir l'indice suivant!</span></td></tr>
	% elif lang == 'it':
	<tr><td width="150" style="vertical-align: top;">${_('link')}</td><td><span>Bravo! Clicca <a href="${c['attributes']['link_it'] or '-'}" target="_parent">qui</a><span> per trovare l'indizio successivo!</span></td></tr>
	% else:
	<tr><td width="150" style="vertical-align: top;">${_('link')}</td><td><span>Bravo! Klicke </span><a href="${c['attributes']['link_de'] or '-'}" target="_parent">hier</a><span> um den nächsten Hinweis zu erhalten!</span></td></tr>
	% endif
% endif
</%def>

