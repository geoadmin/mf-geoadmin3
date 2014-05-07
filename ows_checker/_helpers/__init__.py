#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Module ``_helpers``.

"""

import xml.dom.minidom as dom
import urllib2
import xml2dict

DEFAULT_TIMEOUT = 100

class ResponseDict(dict):
    """
    Die Klasse L{ResponseDict} formuliert ein C{dict}-Objekt mit vier festen
    Parametern und vier festen Rückgabewerten.
    
    B{Aufruf}:
        
    >>> r = ResponseDict("WMS-04 Checker", ["alles gut"], True, ["WMS-04"])
    >>> r
    {'checker': "WMS-04 Checker", 'results':["alles gut"], 'status': True, 'hints':["WMS-04"]}
    >>> r.status
    True

    @ivar checker: Name der Methode
    @type checker: str, unicode
    @ivar results: Resultat(e)
    @type results: list
    @ivar status: Status der Überprüfung
    @type status: bool
    @ivar hints: Hinweise bezüglich Richtlinie(n)
    @type hints: list
    @ivar response_dict: Zusammengefasstes Schema
    @type response_dict: dict
    """
    def __init__(self, checker, results, status, hints = False):
        """
        @param checker: Name der Methode
        @type checker: str, unicode, list
        @param results: Resultat(e)
        @type results: str, unicode, list
        @param status: Status der Überprüfung
        @type status: bool
        @param hints: Optionale Hinweise bezüglich Richtlinie(n)
        @type hints: str, unicode, list
        """
        self.hints = hints
        
        if isinstance(checker, (str, unicode)):
            self.checker = checker
        else:
            raise ValueError("Es muss ein String für Checker übergeben werden")
        
        if isinstance(results, (str, unicode)):
            self.results = [results]
        elif isinstance(results, list):
            self.results = results
        else:
            raise ValueError(u"Es muss ein String oder eine Liste für Results übergeben werden")
        
        if isinstance(status, bool):
            self.status = status
        else:
            raise ValueError(u"Es muss ein Boolean für Status übergeben werden")
         
        if self.hints:
            if isinstance(hints, (str, unicode)):
                self.hints = [unicode(hints)]
            elif isinstance(hints, list):
                self.hints = hints
                    
        self.response_dict = {'checker':self.checker,
                               'results':self.results,
                               'status':self.status,
                               'hints':self.hints}
        
        dict.__init__(self, self.response_dict)
        
def URL2File(url, headers={}, timeout=DEFAULT_TIMEOUT, auth={}):
        """
        Wandelt eine URL in ein Dateiobjekt um.

        B{Funktionsweise}:
            1. Es wird ein HTTP-Request aus C{url} formuliert
            2. Es wird ein Dateiobjekt erstellt und dieses zurückgegeben

        Zusätzlich wird ein Timeout von standardmässig fünf
        Sekunden verwendet, um die Usability nicht zu beeinträchtigen.

        B{Beispiel}:
        
        >>> u = URL2File("http://example.com/test.xml")
        >>> u.info().gettype()
        "text/xml"
        
        @param url: URL
        @type url: str
        @param headers: Optionale Header-Informationen
        @type headers: dict
        @param timeout: Timeout in Sekunden
        @type timeout: int
        @return: Datei
        @rtype: C{file}-Objekt
        """
        url = _ns(url)
        headers.update({
            'User-Agent' : 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)'
        })
        if auth:
            username = auth.get('user','user')
            password = auth.get('pass','pass')
            passman = urllib2.HTTPPasswordMgrWithDefaultRealm()
            passman.add_password(None, url, username, password)
            authhandler = urllib2.HTTPBasicAuthHandler(passman)
            opener = urllib2.build_opener(authhandler)
            urllib2.install_opener(opener)
            file = urllib2.urlopen(url)
        else:
            req = urllib2.Request(url, None, headers)
            file = urllib2.urlopen(url=req, timeout=timeout)
        return file
    
def URL2XML2Dict(url):
    xmldict = xml2dict.XML2Dict()
    f = URL2File(url)
    tree = dom.parse(f)
    f.close()
    header = f.info().gettype()
    assert 'xml' in header
    for node in tree.childNodes:
        if node.nodeType == dom.Node.ELEMENT_NODE:
            body = node.toxml('utf-8')
    xmldict = xmldict.fromstring(body)
    return xmldict
        

def ns(e):
    """
    Ein Workaround für XML-Namespaces, von C{pickle} erzeugten C{'__dict__'}-Objekten
    und von L{_helpers.xml2dict.XML2Dict} erzeugten C{'value'}-Objekten.
    
    B{Beispiel 1}:

    >>> e = {'value':'Ein Wert', '__dict__':{}}
    >>> ns(e)
    "Ein Wert"

    B{Beispiel 2}: z.B. falls ein C{list}-Objekt mit C{dict.keys()} erzeugt wurde

    >>> e = ['value', 'Ein Wert', 'Noch ein Wert', 'namespace', '__dict_']
    >>> ns(e)
    ['Ein Wert', 'Noch ein Wert']

    @param e: Objekt mit unbrauchbaren und brauchbaren Werten
    @type e: str, list, dict
    @return: Objekt mit brauchbaren Werten
    @rtype: str, list
    """
    
    entity = None
    
    # {'__dict__':{}, ...}
    if isinstance(e, dict):
        e.pop('__dict__',None)
        entity = e.value

    # ['value', 'namespace', '__dict__', ...]
    elif isinstance(e, list):
        if 'value' in e:
            e.remove('value')
        if 'namespace' in e:
            e.remove('namespace')
        if '__dict__' in e:
            e.remove('__dict__')
            
        entity = e    
        
    elif isinstance(e, str):
        entity = e
    
    else:
        entity = e
    
    return entity

def unify(l):
    """
    L{unify} löscht alle Duplikate aus einer Liste.
    @param l: Liste mit Duplikaten
    @type l: list
    @return: Liste ohne Duplikate
    @rtype: list
    """
    return list(set(l))
    
def value(l):
    """
    Gibt die Wert des Schlüssels C{value} aus einem dict in einer Liste C{l} zurück.

    B{Beispiel}:

    >>> l = [{'value': 'vnd.ogc.wms_xml'}, {'value': 'vnd.ogc.gml'}]
    >>> value(l)
    ['vnd.ogc.wms_xml', 'vnd.ogc.gml' ]

    @param l: Liste mit dict-Objekten
    @type l: list, str
    @return: Werte des Attributs C{value}
    @rtype: list
    """
    v = []
    if isinstance(l, dict):
        v.append(l.value)
        
    if isinstance(l, list):
        for i in l:
            v.append(i.value)
    elif isinstance(l, str):
        v = [l]
    return v

def removeCharsetFromMime(s):
    """
    Löscht z.B. die Zeichenkette C{UTF-8} aus der Zeichenkette
    C{text/xml;UTF-8} heraus, sodass nur C{text/xml} zurückgegeben wird.

    B{Beispiel}:
    
    >>> s = "text/xml;UTF-8"
    >>> removeCharsetFromMime(s)
    "text/xml"

    @param s: Zeichenkette C{text/xml;UTF-8}
    @type s: str
    @return: Zeichenkette C{text/xml}
    @rtype: str
    """
    if "charset" in s:
        l = s.split(";")
        l = l[0]
    else:
        l = s
    return l

def filterkey(e, key, ns=False):
    """
    Gibt eine Liste aus der Liste C{e} mit dem Attribut C{key} zurück.

    B{Beispiel 1}: Herauslesen der SRS aus einer Liste, die C{dict}'s enthält.

    >>> e = [{'SRS':'12345', 'Name':'WGS-1'}, {'SRS':'54321', 'Name':'WGS-2'}]
    >>> key = "SRS"
    >>> filterkey(e, key)
    ['12345', '54321']

    B{Beispiel 2}: Herauslesen des Namens aus einer Liste, die C{dict}'s enthält.

    >>> e = [{'SRS':'12345', 'Name':'WGS-1'}, {'SRS':'54321', 'Name':'WGS-2'}]
    >>> key = "Name"
    >>> filterkey(e, key)
    ['WGS-1', 'WGS-2']

    @param e: Liste
    @type e: list
    @param key: Schlüssel
    @type key: str
    @param ns: Status, ob zusätzlich L{_helpers.ns} verwendet werden soll
    @type ns: bool
    @return: Liste mit den gefundenen Attributen C{key}
    @rtype: list
    """
    l = []
    key_split = key.split("=")
    if isinstance(e, list):
        for i in e:
            if len(key_split)>1:
                if i[key_split[0]] == key_split[1]:
                    if ns:
                        l.append(_ns(i[key_split[0]]))
                    else:
                        l.append(i[key_split[0]])
            else:
                if ns:
                    l.append(_ns(i[key]))
                else:
                    l.append(i[key])
                
    return l

def b(node):
    """
    Converts a string "0" or "1" to Python's ``True`` and ``False``
    """
    return bool(int(node))

def dict2list(obj):
    """
    Converts an ``obj`` (Dict, List) to a List
    """
    if isinstance(obj, dict):
        return [obj]
    return obj

_b = b
_filterkey = filterkey
_removeCharsetFromMime = removeCharsetFromMime
_value = value
_ns = ns
