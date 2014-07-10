from lxml import etree
import xml.dom.minidom as dom
import xml.etree.ElementTree as ET
import urllib2
import time
import pprint
import socket
import csv
import math
import numpy
socket.setdefaulttimeout(2)

SERVICES = [
    {
        'url':'http://ecogis.admin.ch/fr/wms',
        'time_lxml': [],
        'time_dom': [],
        's': 'WMS'
    },
    {
        'url':'http://www.sogis1.so.ch/cgi-bin/sogis/sogis_ortho.wms',
        'time_lxml': [],
        'time_dom': [],
        's': 'WMS'
    },
    {
        'url':'http://wms.geo.admin.ch/',
        'time_lxml': [],
        'time_dom': [],
        's': 'WMS'
    },
    {
        'url':'http://webgis.uster.ch/wms/orthofotos_und_uep/orthofotos_und_uep',
        'time_lxml': [],
        'time_dom': [],
        's': 'WMS'
    },
    {
        'url':'http://geo.ifip.tuwien.ac.at/geoserver/ows',
        'time_lxml': [],
        'time_dom': [],
        's': 'WMS'
    },
    {
        'url':'http://www.gis2.nrw.de/wmsconnector/wms/hangneigung',
        'time_lxml': [],
        'time_dom': [],
        's': 'WMS'
    },
    {
        'url':'http://www.wms.nrw.de/geobasis/adv_nrw500',
        'time_lxml': [],
        'time_dom': [],
        's': 'WMS'
    },
    {
        'url':'http://nsidc.org/cgi-bin/atlas_north',
        'time_lxml': [],
        'time_dom': [],
        's': 'WMS'
    },
    {
        'url':'http://preview.grid.unep.ch:8080/geoserver/ows',
        'time_lxml': [],
        'time_dom': [],
        's': 'WMS'
    },
    {
        'url':'http://nsidc.org/cgi-bin/atlas_north',
        'time_lxml': [],
        'time_dom': [],
        's': 'WFS'
    },
    {
        'url':'http://geonames.nga.mil/nameswfs/request.aspx',
        'time_lxml': [],
        'time_dom': [],
        's': 'WFS'
    },
    {
        'url':'http://ecogis.admin.ch/wfs/restwasser',
        'time_lxml': [],
        'time_dom': [],
        's': 'WFS'
    },
    {
        'url':'http://wms1.ccgis.de/geoserver/wfs',
        'time_lxml': [],
        'time_dom': [],
        's': 'WFS'
    },
    {
        'url':'http://www.kgis.scar.org:7070/geoserver/wfs',
        'time_lxml': [],
        'time_dom': [],
        's': 'WFS'
    },
    {
        'url':'http://preview.grid.unep.ch:8080/geoserver/ows',
        'time_lxml': [],
        'time_dom': [],
        's': 'WFS'
    },
    {
        'url':'https://bioenergykdf.net/geoserver/wfs',
        'time_lxml': [],
        'time_dom': [],
        's': 'WFS'
    },
    {
        'url':'http://preview.grid.unep.ch:8080/geoserver/ows',
        'time_lxml': [],
        'time_dom': [],
        's': 'WFS'
    },
    {
        'url':'http://www.ithacaweb.org/geoserver/wfs',
        'time_lxml': [],
        'time_dom': [],
        's': 'WFS'
    },
    {
        'url':'http://ogo.heig-vd.ch/geoserver/wfs',
        'time_lxml': [],
        'time_dom': [],
        's': 'WFS'
    },
]

def checkWithLXML(url):
    start = time.time()
    try:
        tree = etree.parse(url)
        root = tree.getroot()
        ch = root.getchildren()
    except Exception, e:
        #print "Skipped", url, e
        return 0.0
    return time.time() - start

def checkWithMinidom(url):
    start = time.time()
    headers = {
            'User-Agent' : 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)'
    }
    try:
        req = urllib2.Request(url, None, headers)
        file = urllib2.urlopen(url=req, timeout=2)
        tree = dom.parse(file)
        file.close()
        for node in tree.childNodes:
            if node.nodeType == dom.Node.ELEMENT_NODE:
                body = node.toxml('utf-8')
                t = ET.fromstring(body)
                ch = t.getchildren()
    except Exception, e:
        #print "Skipped", url, e
        return 0.0
    return time.time() - start

fn = 'lxml_vs_minidom_%s.csv' % time.time()
wr = csv.writer(open(fn, 'wb'), delimiter=' ', quotechar='|', quoting=csv.QUOTE_MINIMAL)
wr.writerow(['URL', 'Dienst', 'LXML_Mean', 'DOM_Mean', 'LXML_Std', 'DOM_Std'])

for i in range(20):
    for service in SERVICES:
        #print "Checking URL=", service['url']
        url = service['url'] + '?request=GetCapabilities&service=' + service['s']
        l = checkWithLXML(url)
        service['time_lxml'].append(l)
        m = checkWithMinidom(url)
        service['time_dom'].append(m)
        print "Mean's of %s after %d steps:" %(service['s'], i) , numpy.mean(service['time_lxml']), numpy.mean(service['time_dom']), numpy.std(service['time_lxml']), numpy.std(service['time_dom'])#

"""    
pprint.pprint(SERVICES)
fn = 'lxml_vs_minidom_%s.csv' % time.time()
wr = csv.writer(open(fn, 'wb'), delimiter=' ', quotechar='|', quoting=csv.QUOTE_MINIMAL)
wr.writerow(['URL', 'Dienst', 'LXML', 'DOM'])
"""
for s in SERVICES:
    print s['time_lxml']
    print s['time_dom']
    wr.writerow([s['url'], s['s'], numpy.mean(s['time_lxml']), numpy.mean(s['time_dom']), numpy.std(service['time_lxml']), numpy.std(service['time_dom'])])
