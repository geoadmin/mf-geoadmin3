<%inherit file="base.mako"/>
<%def name="table_body(c, lang)">

<% c['stable_id'] = True %>
    <%
        import xml.etree.ElementTree as et
        import urllib2
        from chsdi.lib.helpers import parseHydroXML

        xml_file = None
        try:
            xml_file = urllib2.urlopen('http://www.hydrodaten.admin.ch/lhg/SMS.xml', None, 10)
            tree = et.parse(xml_file)
            root = tree.getroot()
            fid = str(c['featureId'])
            html_attr = parseHydroXML(fid, root)
        except:
            html_attr = None
        finally:
            if xml_file:
                xml_file.close()

        file_image = None
        try:
            image = "http://www.hydrodaten.admin.ch/lhg/az/plots/surface/3day_mobile/" + fid + ".png"
            file_image = urllib2.urlopen(image, None, 10)
        except:
            image = None
        finally:
            if file_image:
                file_image.close()

    %>
% if image is None:
    <tr><td class="cell-left">${_('stationsname')}</td>   <td>${c['featureId']}</td></tr>
    <tr><td class="cell-left">${_('stationsnr')}</td>     <td>${c['featureId']}</td></tr>
% endif
    <tr><td class="cell-left">${_('hydromessstationen_graph')}</td>
        <td>
% if image is not None:
            <img src="${image}"/>
% else:
            -
% endif
        </td>
% if html_attr is not None:
    <tr><td class="cell-left">${_('date_time')}</td>   <td>${html_attr['date_time']}</td></tr>
    <tr><td class="cell-left">${_('abfluss')}</td>    <td>${html_attr['abfluss']}</td></tr>
    <tr><td class="cell-left">${_('wasserstand')}</td>    <td>${html_attr['wasserstand']}</td></tr>
    <tr><td class="cell-left">${_('wassertemperatur')}</td>    <td>${html_attr['wassertemperatur']}</td></tr>
    <tr><td class="cell-left">${_('aktuelle_daten')}</td>
% endif
      % if lang in ('de', 'en', 'rm'):
           <td><a target="_blank" href="http://www.hydrodaten.admin.ch/de/${c['featureId']}.html">${_('url') or '-'}</a></td>
      % elif lang == 'fr':
           <td><a target="_blank" href="http://www.hydrodaten.admin.ch/fr/${c['featureId']}.html">${_('url') or '-'}</a></td>
      % elif lang == 'it':
           <td><a target="_blank" href="http://www.hydrodaten.admin.ch/it/${c['featureId']}.html">${_('url') or '-'}</a></td>
      % endif
    </tr>

</%def>
