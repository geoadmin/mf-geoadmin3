<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
<% c['stable_id'] = True %>

    <%
        import xml.etree.ElementTree as et
        import urllib2
        from chsdi.lib.helpers import parseHydroXML
        xml_file = urllib2.urlopen('http://www.hydrodaten.admin.ch/lhg/SMS.xml')
        tree = et.parse(xml_file)
        root = tree.getroot()
        fid = str(c['featureId'])
        link_image = str(c['featureId'])
        html_attr = parseHydroXML(fid, root)
        image_file = None
        try:
            image = "http://www.hydrodaten.admin.ch/lhg/az/plots/surface/3day_mobile/T_" + link_image + ".png"
            image = "http://www.hydrodaten.admin.ch/lhg/az/plots/naduf/3day_mobile/T_" + link_image + ".png"
            image_file = urllib2.urlopen(image)
        except:
            image = None
        finally:
            if image_file:
                image_file.close()

    %>
    <tr><td class="cell-left">${_('wassertemp_3tagtemp')}</td>
        <td>
% if image is not None:
            <img src="${image}"/>
% else:
            -
% endif
        </td>
   </tr>
   <tr><td class="cell-left">${_('ch.bafu.hydrologie-wassertemperaturmessstationen.name')}</td>    <td>${c['attributes']['name'] or '-'}</td></tr>
   <tr><td>${_('ch.bafu.hydrologie-wassertemperaturmessstationen.id')}</td>   <td>${c['featureId'] or '-'()}</td></tr>
   <tr><td>${_('date_time')}</td>   <td>${html_attr['date_time']}</td></tr>
   <tr><td>${_('wassertemperatur')}</td>    <td>${html_attr['wassertemperatur']}</td></tr>

% if lang in ('de', 'en', 'rm') :
    <tr><td>${_('aktuelle_daten')}</td>    <td><a target="_blank" href="http://www.hydrodaten.admin.ch/de/${c['attributes']['url']}">${_('url') or '-'}</a></td></tr>
% else :
    <tr><td>${_('aktuelle_daten')}</td>    <td><a target="_blank" href="http://www.hydrodaten.admin.ch/${lang}/${c['attributes']['url']}">${_('url') or '-'}</a></td></tr>
% endif

</%def>

