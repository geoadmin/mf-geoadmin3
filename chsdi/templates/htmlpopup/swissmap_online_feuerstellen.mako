# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="preview()">${c['featureId']}</td></tr></%def>

<%def name="table_body(c, lang)">
    <tr><td width="150">nr</td><td>${c['featureId']}</td></tr>
    <tr><td width="150">gemeinde</td><td>${c['value'] or '-'}</td></tr>
    <tr><td width="150">ort</td><td>${c['attributes']['ort'] or '-'}</td></tr>
    <tr><td width="150">kanton</td><td>${c['attributes']['kanton'] or '-'}</td></tr>
    <tr><td width="150">karte</td><td>${c['attributes']['karte'] or '-'}</td></tr>
    <tr><td width="150">url</td><td>${c['attributes']['url'] or '-'}</td></tr>
    <tr><td width="150">koordinate_lv03</td><td>${c['attributes']['koordinate_lv03'] or '-'}</td></tr>
</%def>
