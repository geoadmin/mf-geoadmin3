<%inherit file="base.mako"/>

<%def name="table_body(c, lang)">
    <% c['stable_id'] = True %>

<%
import urllib2
from xml.dom import minidom

image_bildnummer = c['attributes']['bildnummer']
datenherr = c['attributes']['firma']
try:
    xml_file = urllib2.urlopen("http://web-iipimage.prod.bgdi.ch/iipimage/iipsrv.fcgi?DeepZoom="+c['attributes']['filename'][12:]+".dzi")
    xmldoc = minidom.parse(xml_file)
    dimensions = xmldoc.getElementsByTagName('Size')
    image_width = dimensions[0].getAttribute('Width')
    image_height = dimensions[0].getAttribute('Height')
except: 
    image_width = None
    image_height = None
%>

    <tr><td class="cell-left">${_('tt_Bildnummer')}</td>   <td>${c['attributes']['bildnummer']}</td></tr>
    <tr><td class="cell-left">${_('tt_Flugdatum')}</td>    <td>${c['attributes']['flugdatum']}</td></tr>
    <tr><td class="cell-left">${_('tt_Filmart')}</td>      <td>${c['attributes']['filmart']}</td></tr>
    <tr><td class="cell-left">${_('tt_Quickview')}</td>    <td><a href="http://web-iipimage.prod.bgdi.ch/viewer.html?image=${c['attributes']['filename'][12:]}&width=${image_width}&height=${image_height}&title=No%20de%20l%27image&bildnummer=${image_bildnummer}&datenherr=${datenherr}&layer=Photographies%20a%C3%A9riennes%20swisstopo" target="_blank"><img src="http://web-iipimage.prod.bgdi.ch/iipimage/iipsrv.fcgi?FIF=${c['attributes']['filename'][12:]}&WID=150&CVT=jpeg" alt="quickview"></a></td></tr>
</%def>
