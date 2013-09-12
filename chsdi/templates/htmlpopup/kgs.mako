# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>
<%def name="preview()">${c['value'] or '-'}</%def>

<%def name="table_body(c, lang)">
    <% c.stable_id = True %>
    <tr><td width="150">${_('beschreibung')}</td>   <td>${c['value']}</td></tr>
    <tr><td width="150">${_('x')}</td>              <td>${c['attributes']['x'] or '-'}</td></tr>
    <tr><td width="150">${_('y')}</td>              <td>${c['attributes']['y'] or '-'}</td></tr>
    <tr><td width="150">${_('gemeinde')}</td>       <td>${c['attributes']['gemeinde'] or '-'}</td></tr>
    <tr><td width="150">${_('kanton')}</td>         <td>${c['attributes']['kt_kz'] or '-'}</td></tr>
    <tr><td width="170">&nbsp;</td>                 <td><a href="${c.path_url}/../${c['featureId']}.html?layer=${c.feature.layer_id}&lang=${c.lang}&baseUrl=http://map.geo.admin.ch?topic=kgs" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

<%def name="body()">

% if c.last == True:
<link rel="stylesheet" type="text/css" href="/${c.instanceid}/wsgi/GeoAdmin.ux/Lightbox/css/lightbox.css">
<script type="text/javascript" src="/${c.instanceid}/wsgi/lib/ext/Ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="/${c.instanceid}/wsgi/lib/ext/Ext/ext-all.js"></script>
<script type="text/javascript" src="/${c.instanceid}/wsgi/GeoAdmin.ux/Lightbox/lib/Lightbox.js"></script>
<style>
    .thumbnail {
        padding: 4px;
        background-color: #e6e6e0;
        border: 1px solid #d6d6d0;
        float: left;
        margin-right: 10px;
        margin-bottom: 10px;
        margin-top: 5px;
    }
    .tooltip_large_header {
        margin-left: 7px !important;
    }
    table {
        border: 1px solid black; 
    }
    #ux-lightbox-overlay {
        height: 5000px !important;
    }
    @media print {
        table {
            border: none;
        }
    }
</style>
<div id="main_div" style="height: auto;">
% else:
<div id="main_div" style="height: auto; page-break-after: always;">
% endif

<% objektart = c.feature.objektart.split(',') %>
% if c.last == True:
<table border="0" cellspacing="15" cellpadding="15" width="100%" style="font-size: 100%; margin-bottom: 10px;" padding="1 1 1 1">
% else:
<table border="0" cellspacing="15" cellpadding="15" width="100%" style="font-size: 100%;" padding="1 1 1 1">
% endif
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 14px; vertical-align: top; color: #660099;">${_('name')}:</td>
         <td style="width: 300px; font-weight: bold; float: left; color: #660099; font-size: 14px;">${c.feature.zkob or '-'}</td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('kategorie')}:</td>
         <td style="width: 300px; float: left;">${c.feature.kategorie or '-'}</td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('tt_kbs_objektart')}:</td>
         <td style="width: 300px; float: left;">
<% counter = 0 %>
% for objart in objektart:
<% 
    obj = 'kultur' + objart
    counter += 1
    if c.feature.pdf_list is not None:
        nb_pdf = len(c.feature.pdf_list.split('##'))
    else:
        nb_pdf = 0
%>
% if counter == len(objektart):
    ${_(obj)}
% else:
    ${_(obj)} /
% endif
% endfor
         </td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('tt_kbs_nbr')}:</td>
         <td style="width: 300px; float: left;">${c.feature.id or '-'}</td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('grundadresse')}:</td>
         <td style="width: 300px; float: left;">${c.feature.adresse or ''}  ${c.feature.hausnr or ''}</td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('tt_kbs_gemeinde')} (${_('tt_kbs_gemeinde_ehemalige')}):</td>
         <td style="width: 300px; float: left;">${c.feature.gemeinde or '-'} (${c.feature.gemeinde_ehemalig or '-'})</td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('Coordinates')}:</td>
         <td style="width: 300px; float: left;">${c.feature.x or '-'} / ${c.feature.y or '-'}</td>
     </tr>
% if c.feature.kurztexte is not None:
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;"></td>
         <td style="width: 300px; float: left; text-align: justify;"><div style="margin-left: -309px;">${c.feature.kurztexte or ''}</div></td>
     </tr>
% endif 
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;"></td>
         <td style="width: 300px; float: left;"><div style="margin-left: -313px;" class="images" id="${c.feature.id}"></div></td>
     </tr>
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('Feature tooltip')}:</td>
% for i in range(nb_pdf):
         <td style="width: 300px; float: left;"><a href="http://dav0.bgdi.admin.ch/kogis_web/downloads/kgs/matrizen/${c.feature.pdf_list.split('##')[i]}.pdf" target="_blank">${c.feature.pdf_list.split('##')[i]}</a></td>
% endfor
     </tr>
% if c.feature.link_uri is not None:
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('legalregulationlink')}:</td>
         <td style="width: 300px; float: left;"><a href="${c.feature.link_uri or ''}">${c.feature.link_title or ''}</a></td>
     </tr>
% endif
% if c.feature.link_2_uri is not None:
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('legalregulationlink')}:</td>
         <td style="width: 300px; float: left;"><a href="${c.feature.link_2_uri or ''}">${c.feature.link_2_title or ''}</a></td>
     </tr>
% endif
% if c.feature.link_3_uri is not None:
     <tr>
         <td style="width: 300px; font-weight: bold; font-size: 13px; vertical-align: top;">${_('legalregulationlink')}:</td>
         <td style="width: 300px; float: left;"><a href="${c.feature.link_3_uri or ''}">${c.feature.link_3_title or ''}</a></td>
     </tr>
% endif
</table>

% if c.first == True:
<% 
    c.fid_list = []
    c.fid_list.append(str(c.feature.id))
%>
% else:
<% 
    c.fid_list.append(str(c.feature.id))
%>
% endif

% if c.last == True:
<%
    import json 
    from urllib2 import urlopen
    from chsdi.lib.helpers import MyHTMLParser
    
    url = 'http://dav0.bgdi.admin.ch/kogis_web/downloads/kgs/bilder/'
    f = urlopen(url)
    s = f.read()
    
    url2 = 'http://dav0.bgdi.admin.ch/kogis_web/downloads/kgs/matrizen/'
    
    url3 = 'http://dav0.bgdi.admin.ch/kogis_web/downloads/kgs/bilder/meta.txt'
    f3 = urlopen(url3)
    s3 = f3.read()
    s4 = s3.decode('cp1252')
    d = s4.split('\n')
    
    hpictures = {}
    hpdfs = {}
    hmeta = {}
    for fid in c.fid_list:
        parser = MyHTMLParser(flayer='kgs',fid=str(fid))
        parser.feed(s)
        meta = list()
        for i in d:
            e = i.split(';')
            if e[0] == parser.pattern:
                meta.append(e[len(e)-1])
                if e[0] == parser.pattern and len(e[len(e)-2]) != 0:
                    meta[len(meta)-1] += e[len(e)-2]
                endif
            endif
        hpictures[str(fid)] = parser.filesMatched
        if c.feature.pdf_list is not None:
            hpdfs[str(fid)] = c.feature.pdf_list.split('##')
        else:
            hpdfs[str(fid)] = []
        endif
        hmeta[str(fid)] = meta
        endfor
    endfor
    hpictures = json.dumps(hpictures)
    hpdfs = json.dumps(hpdfs)
    hmeta = json.dumps(hmeta, encoding="utf-8")
%>


<script type="text/javascript">
    var hpictures = ${hpictures};
    var hpdfs = ${hpdfs};
    var hmeta = ${hmeta};
    var url = '${url}';
    var url2 = '${url2}';
    window.onload = function () {
        var idivs = document.querySelectorAll('.images');
        for (var i=0; i<idivs.length; i++){
            var div = idivs[i];
            var fid = div.id;

            var pictures = hpictures[fid];
            if (pictures.length > 0){
                var pictures = hpictures[fid];
                var pdfs = hpdfs[fid];
                var meta = hmeta[fid];
                for (var n = 0; n < pictures.length; n++) {
                    var title = '';
                    var pic = pictures[n];
                    var div_child = document.createElement('DIV');
                    div_child.className = 'thumbnail';
                    var a = document.createElement('A');
                    a.className = 'lightbox';
                    a.href = url + pic;
                    title = meta[n].replace("/","");
                    a.title = title;
                    var img = document.createElement('IMG');
                    img.width = 100;
                    img.src = url + pic;
                    a.appendChild(img);
                    div_child.appendChild(a);
                    div.appendChild(div_child);
                }
                Ext.ux.Lightbox.register('a.lightbox', true);
            }
        }
        var aels = document.querySelectorAll('.pdf');
        for (var i=0; i<aels.length; i++){
            var a = aels[i];
            var fid = a.id;
            var pdfs = hpdfs[fid];
            if (pdfs.length !== 0) {
                a.href = url2 + pdfs[i] + '.pdf';
            } else {
                a.innerHTML = '-';
            }
        }
    var disclamer = document.querySelector('.disclamer');
    disclamer.setAttribute("href","http://www.disclaimer.admin.ch")
    }
</script>
% endif
</div>
</%def>
