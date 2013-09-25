# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td width="150">nr</td>                 <td>${c['featureId']}</td></tr>
    <tr><td width="150">gemeinde</td>           <td>${c['attributes']['gemeinde'] or '-'}</td></tr>
    <tr><td width="150">ort</td>                <td>${c['attributes']['ort'] or '-'}</td></tr>
    <tr><td width="150">kanton</td>             <td>${c['attributes']['kanton'] or '-'}</td></tr>
    <tr><td width="150">karte</td>              <td>${c['attributes']['karte'] or '-'}</td></tr>
% if c['attributes']['url'] != '':
    <tr><td width="150">url</td>                <td><a href="${c['attributes']['url']}" target="_blank">${c['attributes']['url']}</a></td></tr>
% else:
    <tr><td width="150">url</td>                <td>-</td></tr>
% endif
    <tr><td width="150">koordinate_lv03</td>    <td>${c['attributes']['koordinate_lv03'] or '-'}</td></tr>
</%def>
