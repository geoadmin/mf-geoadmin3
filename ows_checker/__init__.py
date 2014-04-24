#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Das Paket L{ows_checker} beinhaltet
    - das Modul L{_checker}: Das Konformitätsprüfungsmodul 
    - das Paket L{_django}: Die Umgebung in Django U{http://www.djangoproject.com/}
    - das Paket L{_helpers}: Nützliche Hilfsfunktionen

B{Verwendung des Konformitätsprüfungsmoduls als Standalone-Script}:
    1. Installation folgender Software
       - Python (Version >= 2.6.5 wird empfohlen), siehe URL [1]
       - python-lxml, siehe URL [2]
    2. Kopieren des Ordners C{quellcode} in einen Zielordner
    3. In den Ordner C{quellcode/ows_checker} wechseln
    4. Zum Testen kann die Datei C{start_checker_test.py} verwendet und
       angepasst werden. Dazu muss die Datei mit Python ausgeführt werden.

B{Verwendung des Konformitätsprüfungsmoduls mit Django}:
    1. Installation analog zum Standalone-Script
    2. Installation von Django
    3. Einrichtung gemäss Anleitung L{_django}, es wird die Verwendung des
       bestehenden Django-Testprojekts empfohlen. Auf eine exakte Step-by-Step
       Anleitung wird verzichtet, da der Installationsprozess von Betriebssystem
       zu Betriebssystem und verwendetem Web-Server zu Web-Server variiert. Es
       wird deshalb auf gängige Installationsanleitungen im Internet hingewiesen, 
       z.B. URL [3].

B{Verwendung}:

>>> #url = 'http://129.206.229.158/cached/osm'
>>> url = 'http://ecogis.admin.ch/de/wms'
>>> #url = 'http://wms.geo.admin.ch/'
>>> #url = 'http://geo.ifip.tuwien.ac.at/geoserver/ows'
>>> #url = 'http://www.gis2.nrw.de/wmsconnector/wms/hangneigung' #WMS 1.0.0
>>> #url = 'http://www.wms.nrw.de/geobasis/adv_nrw500'
>>> #url = 'http://nsidc.org/cgi-bin/atlas_north' #(WFS, WMS, WCS)
>>> import ows_checker._checker
>>> ows_checker._checker.OWSCheck(url, 'WMS', '1.1.1', True, "settings/")
{'status': True, 'checker': '_base_URLSyntax', 'results': ['URL-Syntax ok'], 'hints': []}

@see:
    - URL [1]: U{http://www.python.org/download/releases/2.6.5/}
    - URL [2]: U{http://codespeak.net/lxml/installation.html}
    - URL [3]: U{http://docs.djangoproject.com/en/dev/topics/install/}

@newfield rili: eCH-0056 Richtlinie, eCH-0056 Richtlinien
@author: Christian Karrié
@contact: U{mailto:christian.karrie@fhnw.ch}
@organization: FHNW Fachhochschule Nordwestschweiz
@copyright: FHNW Fachhochschule Nordwestschweiz
@note: Zuständigkeit Dokumentation bei Christian Karrié
@note: Alle Verweise (URL's) wurden am 24. August 2010 abgerufen
@note: Erstellt mit epydoc 3.0.1-8 U{http://epydoc.sourceforge.net/}
"""
from _checker import OWSCheck
