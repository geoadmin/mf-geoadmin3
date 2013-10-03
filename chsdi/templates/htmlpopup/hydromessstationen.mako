<%inherit file="base.mako"/>
<%def name="table_body(c, lang)">

<% c['stable_id'] = True %>
% if c.counter == 1:
    <%
        import xml.etree.ElementTree as et
        import urllib2

        xml_file = urllib2.urlopen('http://www.hydrodaten.admin.ch/lhg/SMS.xml')
        tree = et.parse(xml_file)
        c.root = tree.getroot()
    %>
% endif

    <%
        from chsdi.lib.helpers import parseHydroXML
        import urllib2
        fid = str(c['featureId'])
        html_attr = parseHydroXML(fid, c.root)
        try:
            image = "http://www.hydrodaten.admin.ch/lhg/az/plots/surface/3day_mobile/" + fid + ".png"
            file = urllib2.urlopen(image)
        except:
            image = None

    %>
% if image is None:
    <tr><td width="150">${_('stationsname')}</td>   <td>${c['featureId']}</td></tr>
    <tr><td width="150">${_('stationsnr')}</td>     <td>${c['featureId']}</td></tr>
% endif
    <tr><td width="150" style="vertical-align: top;">${_('hydromessstationen_graph')}</td>
        <td>
% if image is not None:
            <img src="${image}"/>
% else:
            -
% endif
        </td>
    <tr><td width="150">${_('date_time')}</td>   <td>${html_attr['date_time']}</td></tr>
    <tr><td width="150">${_('abfluss')}</td>    <td>${html_attr['abfluss']}</td></tr>
    <tr><td width="150">${_('wasserstand')}</td>    <td>${html_attr['wasserstand']}</td></tr>
    <tr><td width="150">${_('wassertemperatur')}</td>    <td>${html_attr['wassertemperatur']}</td></tr>
    <tr><td width="150">${_('aktuelle_daten')}</td>
      % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
           <td><a target="_blank" href="http://www.hydrodaten.admin.ch/de/${c.feature.edv_nr4}.html">${_('url') or '-'}</a></td>
      % elif c.lang == 'fr':
           <td><a target="_blank" href="http://www.hydrodaten.admin.ch/fr/${c.feature.edv_nr4}.html">${_('url') or '-'}</a></td>
      % elif c.lang == 'it':
           <td><a target="_blank" href="http://www.hydrodaten.admin.ch/it/${c.feature.edv_nr4}.html">${_('url') or '-'}</a></td>
      % endif
    </tr>

</%def>

