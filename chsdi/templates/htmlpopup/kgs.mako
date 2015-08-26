# -*- coding: utf-8 -*-

<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>
    <tr><td class="cell-left">${_('ch.babs.kulturgueter.zkob')}</td>   <td>${c['attributes']['zkob']}</td></tr>
    <tr><td class="cell-left">${_('y')}</td>              <td>${int(round(c['attributes']['x'],0)) or '-'}</td></tr>
    <tr><td class="cell-left">${_('x')}</td>              <td>${int(round(c['attributes']['y'],0)) or '-'}</td></tr>
    <tr><td class="cell-left">${_('gemeinde')}</td>       <td>${c['attributes']['gemeinde'] or '-'}</td></tr>
    <tr><td class="cell-left">${_('kanton')}</td>         <td>${c['attributes']['kt_kz'] or '-'}</td></tr>
</%def>

<%def name="extended_info(c, lang)">
    <%
        c['stable_id'] = True
        objarts = c['attributes']['objektart'].split(',')
        import csv
        from urllib2 import urlopen
        webDavHost = request.registry.settings['webdav_host']
        csv_url = webDavHost + '/kogis_web/downloads/kgs/bilder/meta.txt'
        csv_file = None
        try:
            csv_file = urlopen(csv_url)
            reader = csv.reader(csv_file, delimiter =';')  # creates the reader object
            pic_list = []
            for i, row in enumerate(reader):   # iterates the rows of the file in orders
                if i == 0: # The first row is NUMMER;BILDNR;FOTOGRAF;COPYRIGHT and cannot be parsed.
                    continue
                if int(row[0]) == c['featureId']:
                    pic_list.append(map(lambda x: x.decode('cp1252'), row))
        finally:
            csv_file.close()
    %>
    <script>
        $(document).ready(function(){
            $('.thumbnail-container').on('click', function (event) {
              event = event || window.event;
                event.preventDefault();
              var target = event.target || event.srcElement,
                link = target.src ? target.parentNode : target,
                options = {index: link, event: event, onslide: function(index, slide){
                    /** a "beautiful" line of code which sets the title of the gallery to the current copyright + photographer of the current photo**/
                    $('#blueimp-gallery-title').html(($($('.thumbnail-container').children('.thumbnail')[index]).children('div').html()));
                }},
                links = this.getElementsByTagName('a');
              blueimp.Gallery(links, options);
            });
        });
    </script>


    <table class="table-with-border kernkraftwerke-extended">
        <tr>
            <th class="cell-left">${_('name')}</th>
            <td>${c['attributes']['zkob'] or '-'}</td>
        </tr>
        <tr>
            <th class="cell-left">${_('kategorie')}</th>
            <td>${c['attributes']['kategorie'] or '-'}</td>
        </tr>
        <tr>
            <th class="cell-left">${_('tt_kbs_objektart')}</th>
            <td>
                % for i, objart in enumerate(objarts):
                    ${_('kultur' + objart) + ' / ' if (i+1<len(objarts)) else _('kultur' + objart)}
                % endfor
            </td>
        </tr>
        <tr>
            <th class="cell-left">${_('tt_kbs_nbr')}</th>
            <td>${c['featureId'] or '-'}</td>
        </tr>
        <tr>
            <th class="cell-left">${_('grundadresse')}</th>
            <td>${c['attributes']['adresse'] or ''} ${c['attributes']['hausnr'] or ''}</td>
        </tr>
        <tr>
            <th class="cell-left">${_('tt_kbs_gemeinde')} (${_('tt_kbs_gemeinde_ehemalige')})</th>
            <td>${c['attributes']['gemeinde'] or ''} ${'('+c['attributes']['gemeinde_ehemalig']+')' if c['attributes']['gemeinde_ehemalig'] else ''}</td>
        </tr>
        <tr>
            <th class="cell-left">${_('Coordinates')}</th>
            <td>${int(round(c['attributes']['x'],0)) or ''} / ${int(round(c['attributes']['y'],0)) or ''}</td>
        </tr>
    % if c['attributes']['pdf_list'] is not None:
        <tr>
            <th class="cell-left">${_('Feature tooltip')}:</th>
            <td>
	        % for pdf in c['attributes']['pdf_list'].split('##'):
                <a href="${webDavHost}/kogis_web/downloads/kgs/matrizen/${pdf}" target="_blank">${pdf}</a><br />
	        % endfor
            </td>
	    </tr>
    %endif
    % if c['attributes']['link_uri'] is not None:
        <tr>
          <th class="cell-left">${_('legalregulationlink')}</th>
            <td><a href="${c['attributes']['link_uri']}">${c['attributes']['link_title']}</a></td>
        </tr>
    % endif
    % if c['attributes']['link_2_uri'] is not None:
        <tr>
          <th class="cell-left">${_('legalregulationlink')}</th>
          <td><a href="${c['attributes']['link_2_uri']}">${c['attributes']['link_2_title']}</a></td>
        </tr>
    % endif
    % if c['attributes']['link_3_uri'] is not None:
        <tr>
          <th class="cell-left">${_('legalregulationlink')}</th>
          <td><a href="${c['attributes']['link_3_uri']}">${c['attributes']['link_3_title']}</a></td>
        </tr>
    % endif
    </table>
     <div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls">
        <div class="slides"></div>
        <div class="title" id="blueimp-gallery-title"></div>
        <a class="prev">&lsaquo;</a>
        <a class="next">&rsaquo;</a>
        <a class="close">x</a>
        <a class="play-pause"></a>
        <ol class="indicator"></ol>
     </div>
        <div class="kgs-thumbnails">
            <div class="thumbnail-container">
            %for pic in pic_list:
                <div class="thumbnail">
                    <a href="${webDavHost}/kogis_web/downloads/kgs/bilder/kgs_${pic[0]}_${pic[1]}.jpg">
                        <img class="image" src="${webDavHost}/kogis_web/downloads/kgs/bilder/kgs_${pic[0]}_${pic[1]}.jpg" />
                    </a>
                    <div>${pic[3] or ''} - ${pic[2] or ''}</div>
                </div>
            %endfor
            </div>
        </div>
    <table class="kernkraftwerke-extended">
    % if c['attributes']['kurztexte'] is not None:
        <tr>
          <td>${c['attributes']['kurztexte']}</td>
        </tr>
    % endif
    </table>
</%def>
