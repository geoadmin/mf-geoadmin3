# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <tr><td class="cell-left">nr</td>                 <td>${c['featureId']}</td></tr>
    <tr><td class="cell-left">gemeinde</td>           <td>${c['attributes']['gemeinde'] or '-'}</td></tr>
    <tr><td class="cell-left">ort</td>                <td>${c['attributes']['ort'] or '-'}</td></tr>
    <tr><td class="cell-left">kanton</td>             <td>${c['attributes']['kanton'] or '-'}</td></tr>
    <tr><td class="cell-left">karte</td>              <td>${c['attributes']['karte'] or '-'}</td></tr>
% if c['attributes']['url'] != '':
    <tr><td class="cell-left">url</td>                <td><a href="${c['attributes']['url']}" target="_blank">${c['attributes']['url']}</a></td></tr>
% else:
    <tr><td class="cell-left">url</td>                <td>-</td></tr>
% endif
    <tr><td class="cell-left">koordinate_lv03</td>    <td>${c['attributes']['koordinate_lv03'] or '-'}</td></tr>
</%def>
