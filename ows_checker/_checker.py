#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
The _checker-Module contains the Python class :py:class:`OWSCheck`. This class
performs the eCH-0056 Version 2.0 validation.

*Requirements:*

* :py:mod:`lxml`
* :py:mod:`owslib`
* :py:mod:`django` (optional)

"""

from pprint import pprint
from owslib.wms import WebMapService

# Globale Abhängigkeiten
import urllib2, re, urllib, os, socket, random, datetime
import xml.dom.minidom as dom
import xml.parsers.expat
from lxml import etree

# Interne Anhängigkeiten
from _helpers import xml2dict, ResponseDict, URL2File, object_dict, dict2list, URL2XML2Dict, DEFAULT_TIMEOUT
from _helpers import _ns, _b, _filterkey, _value, _removeCharsetFromMime, unify
import messages as _m

try:
    from django.utils.encoding import smart_str, smart_unicode
    has_django = True
except ImportError:
    has_django = False


DEBUG = False
VERSION = "1.0.0"
STATUS_FLAG = {
    1: 'green', # fulfilled
    2: 'red',   # not fulfilled
    3: 'yellow',# optional not fulfilled
    4: 'white'  # not checked
}


class OWSCheck(object):
    """
    Base class that performs the validation.

    Example usage:

    >>> o = OWSCheck(url="http://ecogis.admin.ch/de/wms", service="WMS")
    >>> o.next()
    {'checker':'base_URLSyntax', 'status':True, ...}

    Start on with reading the docs about :py:func:`next`.

    :param string url: URL of the Service
    :param string service: Type of the Service

    See :py:meth:`__init__` for more parameters.

    :ivar string base_url: URL of Service
    :ivar string service: Service, see :py:attr:`SUPPORTED_OWS`
    :ivar string version: Version to check of Service
    :ivar bool auto: if True, the method :py:meth:`next` will do an automated check based on :py:attr:`workflow`
    :ivar string cwd: Current working directory
    :ivar object tree: :py:class:`xml.dom.minidom.dom` - Object of parsed GetCapabilities file, see
                       :py:meth:`base_GetCapHandler`.
    :ivar float progress: Progress of workflow, see :py:meth:`calculateProgress`.
    :ivar object gc_xmlroot: Root-:py:class:`xml.dom.Node` - Object of :py:attr:`tree`, see
                             :py:meth:`base_VersionHandler`.
    :ivar list version_list: Python `list` of checked Version. Example: `"1.3.0"` -> `[1,3,0]`.
    :ivar object gc_file_info: Contains Headerinformations about :py:attr:`tree`, see :py:meth:`base_GetCapHandler`.
    :ivar dict gc_dict: :py:class:`XML2Dict` - Object of GetCapabilities Document, see :py:meth:`base_GetCapHandler`.
    :ivar list layers: `list` of Layers, see :py:meth:`wms_LegendURL`.
    :ivar dict service_settings_version: :py:class:`XML2Dict` - Object with service and version dependent Settings, see
                                         :py:meth:`base_VersionHandler`.
    :ivar bool ows_common: The checked Service correspond the
                           `OWS Common Standard <http://www.opengeospatial.org/standards/common>`_
    :ivar bool has_django: Bool that shows if Django is installed.
    :ivar bool base_error:

        Bool that shows if an base error occured. A base error can be

        * Timeout during HTTP request to Server
        * Requested URL is not a XML Document

        If `base_error` turns True, :py:meth:`next` won't be called again.

    :ivar string base_error_msg: The error message for :py:attr:`base_error`.

    :ivar dict service_settings: :py:class:`XML2Dict` - Object with service dependent settings (File `settings/*.xml`).
    :ivar list service_specific_workflow: List of additional workflow according to service type.
    :ivar list service_exceptions: List of service dependent Exceptions, see :py:meth:`base_VersionHandler`.
    :ivar dict service_specific_results: Additional service dependent results see :py:attr:`results_overview`.
    :ivar string version_requested: Requested service version.
    :ivar string ssurl: Service specific URL
    :ivar dict crs: Dict of Coordinate Reference Systems
    :ivar list workflow:

        List containing the workflow to process the whole check. The list is sorted by method call order.

        Structure of the workflow:

            >>> workflow = [
                [
                    'Name of the method',   # String
                    params for the method,  # Object
                    method checked,         # Bool
                    check results           # Dict
                ],
                ...
            ]

        In :py:meth:`__init__`, the `workflow` gets some more work extended by :py:attr:`service_specific_workflow`.

        For workflow see :ref:`the-workflow`.

    :ivar dict results_overview:

        Dict containing all results sorted by `Richtlinie`. This is mainly for presenting the results in a website. For
        the structure of :py:attr:`results_overview` see :py:meth:`getResultsOverview`.

    """
    
    SUPPORTED_OWS = (('WMS', 'Web Map Service',),
                     ('WFS', 'Web Feature Service',),
                     ('WCS', 'Web Coverage Service',),
                     ('CSW', 'Catalogue Service'),
                     ('WMTS','Web Map Tile Service',))
    
    def __init__(self, base_url, service, version=None, auto=True, cwd="", ssurl=None, restful=False):
        """
        Init of classe OWSCheck.

        :param string base_url: URL of the Service
        :param string service: Type of the Service
        :param string version: Version of the Service, default `None`
        :param bool auto: If true, :py:meth:`next` will be called according to the workflow
        :param string cwd: Current working directory, important for the `settings/*.xml` Files
        :param string ssurl: URL of the service specific XML Document
        :param bool restful: If True, no KVP will be used
        """
        
        if isinstance(base_url, (str, unicode)) and isinstance(service, (str, unicode)):
            self.base_url = base_url
            self.service = service.upper()
            if version:
                self.version_given = True
            else:
                self.version_given = False
                
            self.version = version
            self.version_requested = version
        else:
            raise ValueError("base_url, service must be string or unicode")
        
        # Variablen (VOR WORKFLOW)
        self.cwd = cwd
        self.tree = True
        self.progress = 0
        self.gc_xmlroot = []
        self.version_list = []
        self.gc_file_info = object
        self.gc_dict = None
        self.layers = object
        self.service_settings_version = None
        self.ows_common = object
        self.has_django = has_django
        self.base_error = False
        self.base_error_msg = ''
        # Servicebedingte Einstellungen
        _s = xml2dict.XML2Dict()
        #_s_path = self.cwd + "%s.xml" %self.service.lower()
        _s_path = os.path.join(self.cwd, "%s.xml" %self.service.lower())
        if DEBUG: print _s_path
        self.service_settings = _s.parse(_s_path)[self.service.lower()]
        self.service_specific_workflow = []
        self.service_exceptions = []
        self.crs = self.CRSHandler()
        self.ssurl = ssurl
        self.ssxml = {}
        self.checker_times = {}
        self.gc_by_versions = {}
        self.missing_capa = []
        self.swapcases = False

        if restful and self.service != "WMTS":
            self.base_error = True
            self.base_error_msg = 'Restful only for WMTS!'
        self.restful = restful
        if self.restful:
            base = self.base_url
            version = self.version or self.service_settings.minVersion
            self.base_url = urllib.basejoin(base, version + '/')

        if not self.version:
            self.version = _ns(self.service_settings.minVersion)
            self.version_requested = _ns(self.service_settings.minVersion)

        self.auth = {}
        # Workflow
        self.workflow = [
            ["base_URLSyntax",         self.base_url,   False, {}],
            ["base_SSXMLHandler",      None,            False, {}],
            ["base_GetCapHandler",     None,            False, {}],
            ["base_ServiceHandler",    None,            False, {}],
            ["base_VersionHandler",    None,            False, {}],
            ["base_RandomRequest",     None,            False, {}],
            ["base_SwapCases",         None,            False, {}],
            #["security_HttpsHandler",  None,            False, {}],
            ["language_GetCapLang",    None,            False, {}],
            ["vers_MaxService",        None,            False, {}],
            ["meta_MIMEHandler",       None,            False, {}],
            ["meta_ServiceMeta",       None,            False, {}],
            ["vers_MinService",        None,            False, {}],
            #["xml_DefinitionHandler",  None,            False, {}],
            # xml_DefinitionHandler too slow
            ["meta_ServiceOperations", None,            False, {}],
        ]
        
        
        self.results_overview = {
            0:{'name':'Status', 'status':[], 'msg':[]},
            1:{'name':'ALLG',
            'rili':{
                    1:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                    2:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                    3:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                    4:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                    5:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                    6:{'status':[], 'msg':[], 'optional':False, 'checked':False},
            }},
            2:{'name':'SECU',
            'rili':{
                    1:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                    2:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                    3:{'status':[], 'msg':[], 'optional':True, 'checked':False},
            }},
            3:{'name':'LANG',
            'rili':{
                    1:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                    2:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                    3:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                    4:{'status':[], 'msg':[], 'optional':True, 'checked':False},
            }},
            4:{'name':'CAPA',
            'rili':{
                    1:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                    2:{'status':[], 'msg':[], 'optional':False, 'checked':False},
            }},
            5:{'name':'EXCE',
            'rili':{
                    1:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                    2:{'status':[], 'msg':[], 'optional':False, 'checked':False},
            }},
            6: {'name':'VERS',
            'rili':{
                    1:{'status':[], 'msg':[], 'optional':False, 'checked':False},
            }},
            7: {'name':'META',
               'rili':{
                       1:{'status':None, 'msg':[], 'optional':False, 'checked':False},
                       #2:{'status':None, 'msg':[], 'optional':False, 'checked':False}
            }},
            8: {'name':'CRS',
            'rili':{
                1:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                2:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                3:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                4:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                5:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                6:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                7:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                8:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                9:{'status':[], 'msg':[], 'optional':True, 'checked':False},
            }},
            9: {'name':'WMS',
            'rili':{
                1:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                2:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                3:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                4:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                5:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                6:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                7:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                8:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                9:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                10:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                11:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                50:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                51:{'status':[], 'msg':[], 'optional':True, 'checked':False},
            }},
            10: {'name':'WFS',
               'rili':{
                1:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                2:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                3:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                4:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                5:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                6:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                7:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                8:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                50:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                51:{'status':[], 'msg':[], 'optional':False, 'checked':False},
            }},
            11: {'name':'WCS',
                'rili':{
                1:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                2:{'status':[], 'msg':[], 'optional':True, 'checked':False},
            }},
            12: {'name':'CSW',
                'rili':{
                1:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                2:{'status':[], 'msg':[], 'optional':False, 'checked':False},
            }},
            13: {'name':'WMTS',
                'rili':{
                1:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                2:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                3:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                4:{'status':[], 'msg':[], 'optional':False, 'checked':False},
                5:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                6:{'status':[], 'msg':[], 'optional':True, 'checked':False},
                7:{'status':[], 'msg':[], 'optional':True, 'checked':False},
            }},
            20: {'name':'SLD',
            'rili':{
                   1:{'status':[], 'msg':[], 'optional':True, 'checked':False},
            }},
            21: {'name':'SE',
            'rili':{
                   1:{'status':[None], 'msg':[], 'optional':True, 'checked':False},
            }},
            22: {'name':'FE',
            'rili':{
                   1:{'status':[None], 'msg':[], 'optional':True, 'checked':False},
            }},
            23: {'name':'POS',
            'rili':{
                   1:{'status':[None], 'msg':[], 'optional':False, 'checked':False},
                   2:{'status':[None], 'msg':[], 'optional':False, 'checked':False},
            }},
        }
        
        if self.service == 'WMS':
            self.service_specific_workflow += [
                ["wms_ServiceMeta",       None, False, {}],
                ["wms_LegendURL",         None, False, {}],
                ["wms_MetaDataURL",       None, False, {}],
                ["wms_ImageFormats",      None, False, {}],
                ["wms_CRS",               None, False, {}],
                # Removed GetMap due to stateless (too slow)
                #["wms_GetMap",            None, False, {}],
                ["wms_SLD",               None, False, {}],
                ["wms_GetFeatureInfoMIME",None, False, {}],
                ["wms_GetFeatureInfo",    None, False, {}],
            ]

        elif self.service == 'WFS':
            self.service_specific_workflow += [
                ["wfs_CheckGetFeature",None, False, {}],
                ["wfs_CheckFeatureTypes", None, False, {}],
                ["wfs_CRS",            None, False, {}],
                ["wfs_GetFeature",     None, False, {}],
                ["wfs_ServiceMeta",    None, False, {}],
            ]
            
        elif self.service == 'WCS':
            self.service_specific_workflow += [
                ["wcs_CRS", None, False, {}],
            ]
            
        elif self.service == 'CSW':
            self.service_specific_workflow += [
                ['csw_Timestamp',   None, False, {}],
                ["csw_AppProfile",  None, False, {}],
                ["csw_Meta",        None, False, {}],
            ]
            
            #for i in self.results_overview[8]['rili'].keys():
            #    self.setResultsOverview('CRS-%s' %(str(i).zfill(2)), True, "CSW doesn't support CRS")
            
        elif self.service == 'WMTS':
            self.service_specific_workflow = [
                ["wmts_RESTful",   None, False, {}], #WMTS-02 #WMTS-05
                ["wmts_Formats",   None, False, {}], #WMTS-03
                ["wmts_CRS",       None, False, {}], #WMTS-04/06
                ["wmts_TMS",       None, False, {}]  #WMTS-07
            ]
            # Set to optional/neutral
            self.results_overview[8]['rili'][2]['optional'] = True
            self.results_overview[8]['rili'][3]['optional'] = True
            self.results_overview[8]['rili'][4]['optional'] = True
            
        else:
            self.base_error = True
            self.base_error_msg = 'Service %s not supported' %(self.service)

        self.workflow += self.service_specific_workflow
        
        """
        While-Schleife, die bei auto=True ausgeführt wird.
        Sie ruft, solange die Variable auto=True ist, die Methode next() auf.
        Falls der Checker "finished" aufgerufen wird, wird die Schleife beendet.
        """
        while auto:
            n = self.next()
            if n['checker'] == 'finished':
                auto = False
                break
    
    def next(self):
        """
        The method :py:meth:`next` controls the order of methods called to proceed the validation.

        In every call of :py:meth:`next`, the next method in the :py:attr:`workflow` will be called.
        The complete logic of the checker is done inside this method and can be controlled from outside
        (external programs) with just to call :py:meth:`next`.

        For workflow see :ref:`the-workflow`.

        Example:

        >>> oc = OWSCheck(....)
        >>> oc.next() # First method in workflow will be called
        {'checker':'checkUrlSyntax', ...}
        >>> oc.next() # Second method in workflow will be called
        {'checker':'checkGCUrl', ...}

        Operation:

        1. Call next()
        2. Interate through workflow (variable `work`), find name of method (:py:func:`str` at `work[0]`) which
           hasn't been checked now (:py:func:`bool` at `work[2]`) and call this method with arguments
           (:py:func:`object` at `work[1]`).
        3. After the method has been checked, a flag is set (:py:func:`bool` at `work[2]`) to show that the method
           was called
        4. Writing results from the method into workflow (:py:func:`dict` at `work[3]`)
        5. At the end, :py:meth:`calculateProgress` is called

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` of the current work status
        """
        checker = {'checker':'finished',
                   'status':False,
                   'results':['',],
                   'hints':['',]}
        
        if self.base_error:
            if DEBUG: print "==== BASE ERROR OCCURED ===="
            if DEBUG: print "Fehler: ", self.base_error_msg
            checker['results'] = [self.base_error_msg]
            self.setResultsOverview("Status", True, self.base_error_msg)
            return checker
        
        for work in self.workflow:
            """
            work[0]: Funktionsname
            work[1]: Parameter
            work[2]: Wurde überprüft
            work[3]: Resultate
            """
            func_name = work[0]
            if not work[2]:
                # Hat 1 Parameter
                start_time = datetime.datetime.now()
                param = work[1]
                if work[1]:
                    checker = self.__getattribute__(func_name)(param)
                # Ohne Parameter
                else:
                    checker = self.__getattribute__(func_name)()
                work[2] = True
                work[3] = checker
                
                # Add times
                end_time = datetime.datetime.now()
                td = (end_time - start_time)
                self.checker_times[func_name] = "%s.%s" %(td.seconds, td.microseconds) 
                
                # Abbruch der for-Schleife nach Funktionsaufruf
                break
        
        # Berechnung des Fortschritts
        self.calculateProgress()
        
        if checker['checker'] == 'finished':
            self.setResultsOverview("Status", True, "finished")
        
        if DEBUG: pprint(checker)
        return checker

    def build_kvp_url(self, url, data, swapcases=False):
        """
        Function to build a complete URL containing all KVP (Key-Value-Pair) Parameters based on ``url`` and ``data``.
        Supports Vendor Specific Parameters (existing GET-Parameter).

        :param url: URL to build
        :param data: KVP Parameter as an dictionary
        :rtype: URL with all GET-Parameters
        """
        class S(str):
            """
            Pseudo-String class that allows to set
            a ssp (server-specific parameters) - Attribute
            """
            ssp = False

        kvp = urllib.urlencode(data)
        if swapcases:
            kvp = kvp.swapcase()

        if "?" in url:
            url = S(url + "&" + kvp)
            url.ssp = True
        else:
            url = S(url + "?" + kvp)
        return url
    
    def getResultsOverview(self, aggregate=True):
        """
        The method :py:meth:`getResultsOverview` calls the method :py:meth:`next`
        and returns (insted of the result of a single check) all current results in
        :py:attr:`results_overview`.

        If ``aggregate=True``, all checker Results will be aggregated as follow into a dictionary containing following
        elements:

        * ``status``: 'red', 'green', 'white' and 'yellow' indicates the status of a Richtline
            * 'red': mandatory Richtlinie not fulfilled
            * 'green': mandatory or optional Richtline fulfilled
            * 'white': Richtlinie not checked
            * 'yellow': optional Richtline not fulfilled
        * ``msg``: List of Message Results (first Element of the List is taken from ``messages.py``).
        * ``optional``: Boolean indicates if the Richtlinie is optional or mandatory
        * ``checked``: Boolean indicates if the Richtline was checked or not

        The following table should clarify
        the structure of :py:attr:`results_overview`:

        +-----------+-----------------------------------------------------------+
        | Level (*) | Description of content                                    |
        +===========+===========================================================+
        |         1 | The numbers 1-8 (and 9 with service depended Richtlinien) |
        |           | allows a sorted Python dictionary to group the results.   |
        |           |                                                           |
        |           | Key 0: Current Status (siehe below)                       |
        |           |   1-n: Level 2                                            |
        +-----------+-----------------------------------------------------------+
        |         2 | Key `name`: Shortcut of Richtlinie                        |
        |           |     `rili`: Content of Level 3                            |
        +-----------+-----------------------------------------------------------+
        |         3 | Key n: Number n of Richtlinie, see Level 4                |
        +-----------+-----------------------------------------------------------+
        |         4 | Key `status`: List containing status of single check      |
        |           |      `msg`: Message returned of a single check            |
        +-----------+-----------------------------------------------------------+
        

        (*) Number of Slicings

            >>> results_overview[0]            # would be one (1) slicing,
            >>> results_overview[0]['name'][1] # would be tree (3) slicings.
        
        The combination of Level = 1 and Key = 0 is a special case. In this object, the current status of the Checker
        is stored:

        >>> results_overview[0]
        {
            'msg': 'finished',
            'name': 'Status',
            'status': [True, True, True, True, True]
        }

        Examples of Levels:
        
        >>> results_overview[0]['name'] # Level 2
        Status
        >>> results_overview[6]['rili'][1]['status'] # Level 4
        [True, True, False]
        
        Call Examples:
        
        >>> c = OWSCheck(...)
        >>> c.getResultsOverview()
        {0: {'msg': 'finished', 'name': 'Status', 
             'status': [True, True, True, True, True]},
         1: {'name': 'ALLG',
             'rili': {1: {'msg': ['http://...', '...'], 'status': [False]}, ...

        Call Examples with ``aggregate=True``:

        >>> c = OWSCheck(...)
        >>> c.getResultsOverview(aggregate=True)
        0: {'msg': ['Checked URL: http://ogo.heig-vd.ch/geoserver/wfs',
                    'Checked Service: WFS',
                    'Your Server is not eCH-0056 compliant, following Rules are not fulfilled: ALLG-01, ALLG-04, EXCE-02'],
            'name': 'Status',
            'status': 'red'},
        1: {'name': 'ALLG',
            'rili': {1: {'checked': True,
                         'msg': ['The service does not fulfill case sensitivity for parameters values'],
                         'optional': False,
                         'status': 'red'},
                    }
            }
        ...

        :param aggregate: :py:func:`bool` to aggreagate all results
        :rtype: :py:func:`dict` of :py:attr:`results_overview`
        """
        self.next()

        if aggregate:
            failed = 0
            failed_rili = []
            for i, checker in self.results_overview.items():
                rili = checker['name']
                if checker.has_key('rili'):
                    for nr, results in checker['rili'].items():
                        if nr < 10:
                            nr = "0" + str(nr)
                        rl = "%s-%s" %(rili, nr)
                        data = results.pop('data', {})
                        status = results['status']
                        optional = results['optional']
                        checked = results['checked']
                        if status and len(status):
                            status = all(status)
                        else:
                            status = False

                        if status:
                            status = 'green'
                        elif not status and optional:
                            status = 'yellow'
                        else:
                            status = 'red'
                            if checked:
                                failed += 1
                                failed_rili.append(rl)
                        if not checked:
                            status = 'white'

                        if self.base_error:
                            msg = _m.getMsg(rl, status, data, fake=True)
                        else:
                            msg = _m.getMsg(rl, status, data)
                        results['msg'] = [msg] + results['msg']

                        results['status'] = status

            if not self.base_error:
                # Set Final Result
                print "FAILED", failed
                print "FAULED RILI", failed_rili
                if failed > 0:
                    msg = "Your Server is not eCH-0056 compliant, following Rules are not fulfilled: %s" % ', '.join(failed_rili)
                    status = 'red'
                else:
                    msg = "Congratulations, your Server is eCH-0056 compliant"
                    status = 'green'
                self.results_overview[0]['msg'] = [
                    "Checked URL: %s" % self.base_url,
                    "Checked Service: %s" % self.service,
                    msg]
                self.results_overview[0]['status'] = status
            else:
                self.results_overview[0]['status'] = 'red'


        return self.results_overview
    
    def getRiliResults(self, rili):
        """
        The method :py:meth:`getRiliResults` returns the results (as a :py:meth:`ResponseDict`) of a given
        Richlinie (Variable `rili`) by looking up the results from :py:attr:`results_overview` and aggregating the
        status.

        Example:

        >>> c = OWSCheck(...)
        >>> c.getRiliResults(rili='ALLG-03')
        {
            'checker': "getRiliResults",
            'results':["alles gut"],
            'status': True,
            'hints':["ALLG-01"]
        }

        :param string rili: Name of the Richtlinie
        :rtype: :py:meth:`ResponseDict` with aggregated status
        """
        ro = self.results_overview
        kat, rili_id = rili.split("-")
        for root in ro.keys():
            if ro[root]['name'] == kat:
                kat_id = int(root)
                break
                
            rili_id = int(rili_id)
            
        status = ro[kat_id]['rili'][rili_id]['status']
        results = ro[kat_id]['rili'][rili_id]['msg']
        return ResponseDict("getRiliResults", results, all(status))
    
    def setResultsOverview(self, rili, status, msg, append=False, data={}):
        """
        Sets the `status` and `msg` to a Richtlinie `rili`.

        :param string rili: Name of the Richtlinie
        :param bool status: Status of Check
        :param string msg: Message of Check
        :param bool append: Default `False`, if True, `msg` will be appended and not extended.
        """
        ro = self.results_overview
        # Sonderfall Ebene 1 Nr. 0
        if rili == 'Status':
            ro[0]['status'].append(status)
            if not isinstance(msg, list):
                msg = [msg]
            ro[0]['msg'] = msg
        
        # Sonstige Nummern in Ebene 1
        else:
            kat, rili_id = rili.split("-")            
            for root in ro.keys():
                if ro[root]['name'] == kat:
                    kat_id = int(root)
                    break
                
            rili_id = int(rili_id)
            ro[kat_id]['rili'][rili_id]['status'].append(status)
            if data:
                try:
                    ro[kat_id]['rili'][rili_id]['data'].update(data)
                except KeyError:
                    ro[kat_id]['rili'][rili_id]['data'] = data

            if msg is not None:
                if append or not isinstance(msg, list):
                    ro[kat_id]['rili'][rili_id]['msg'].append(msg)
                else:
                    ro[kat_id]['rili'][rili_id]['msg'].extend(msg)
            # Set checked-Flag
            ro[kat_id]['rili'][rili_id]['checked'] = True
    
    def calculateProgress(self):
        """
        Calculates the current progress of the checker:
        Number of Checks done in the workflow / Number of Checks available in the workflow.

        :rtype: Int between 0 and 100
        """
        next = "Start"
        wf_status = [work[2] for work in self.workflow]
        for i, work in enumerate(self.workflow):
            if not work[2]:
                try: next = self.workflow[i+1][0]
                except IndexError: next = "Finished"
                break 
            
        #next = '<a href="/media/apidocs/html/ows_checker._checker.OWSCheck-class.html#%s" target="_newtab">%s</a>' %(next, next)
            
        _all = float(sum(wf_status))/float(len(wf_status))*100
        self.progress = _all
        pipes = "|"*int(_all)
        msg = "Processing %s [ %d%% ]: %s" %(next, _all, pipes)
        if all(self.results_overview[0]['status']):
            self.setResultsOverview('Status', True, msg)
        return _all
    
    def checkFileHeader(self, header, url):
        """
        Checks an expected `header` of a resource (given by an `url`) and returns
        a `tuple (equal, detected header of url)`.

        Uses :py:func:`info() <urllib2.urlopen>` and :py:func:`mimetools.Message.gettype` to detect the mime type.
        
        Example:

        >>> checkFileHeader(header="image/png", url="getmap")
        False, "image/png"

        .. todo::

            Check for Subtypes

        .. seealso::

            * :py:func:`URL2File <ows_checker._helpers.URL2File>`

        :param string header: Expected Header type, i.e. "image/png"
        :param string url: URL to resource to check
        :rtype: :py:func:`tuple` with two elements (:py:func:`bool`, :py:func:`str`)
        """
        head = []
        if isinstance(header, list):
            for h in header:
                if "; mode=" in h:
                    head.append(h.split("; mode=")[0])
                else:
                    head.append(h)
        elif isinstance(header, str):
            if "; mode=" in header:
                head.append(header.split("; mode=")[0])
            else:
                head.append(header)
        try:
            f = URL2File(url, auth=self.auth)
            info = f.info()
            _type = info.gettype()
            equal = _type in head
            f.close()
            return equal, _type
        except Exception, e:
            if DEBUG: print str(e), url
            return False, str(e)
    
    def CRSHandler(self):
        """
        Reads all coordinate reference system defined in the `settings/<Service Type>.xml` file and returns it as
        an :py:class:`object_dict <ows_checker._helpers.object_dict.object_dict>` Instance as
        Attribute :py:attr:`crs`.

        :rtype: :py:class:`object_dict <ows_checker._helpers.object_dict.object_dict>`
        """
        crs_mustnot = {}
        crs_optional = {}
        crs_must = {}
        crs_3d_must = {}
        crs_3d_optional = {}
        
        for ref_settings in _ns(self.service_settings.RefSys.CRS):
            
            ref_status = _ns(ref_settings.status)
            ref_value = _ns(ref_settings.value)
            rili = _ns(ref_settings.rili)
            
            if  ref_status == 'must':
                if ref_settings.has_key("dim"):
                    crs_3d_must[rili] = ref_value
                else:
                    crs_must[rili] = ref_value
                
            elif ref_status == 'not':
                crs_mustnot[rili] = ref_value
                
            elif ref_status == 'optional':
                if ref_settings.has_key("dim"):
                    crs_3d_optional[rili] = ref_value
                else:
                    crs_optional[rili] = ref_value
                    
        crs = {'crs_must':crs_must,
               'crs_3d_must':crs_3d_must,
               'crs_mustnot':crs_mustnot,
               'crs_optional':crs_optional,
               'crs_3d_optional':crs_3d_optional}
        
        return object_dict.object_dict(crs)
    
    def checkCRS(self, srs_all, for_version=None):
        """
        Compares the given list of SRS (`srs_all`) with the list of SRS build in :py:meth:`CRSHandler`.

        It contains an workaround for `OGC Definition identifier URNs in OGC namespace` (see links below for
        futher informations) to check SRS in URN format: `urn:ogc:foo:EPSG:4326`.

        Example:

        >>> print c.crs.crs_must
        ['EPSG:4326', ...]
        >>> c.checkCRS(srs_all = ['urn:ogc:foo:EPSG:4326', ...])
        True, ['CRS EPSG:4326 found', ...]

        .. seealso::

            * :ref:`rili-crs-01`
            * :ref:`rili-crs-02`
            * :ref:`rili-crs-03`
            * :ref:`rili-crs-04`
            * :ref:`rili-crs-05`
            * :ref:`rili-crs-06`
            * :ref:`rili-crs-07`
            * :ref:`rili-crs-08`
            * :ref:`rili-crs-09`

            * http://portal.opengeospatial.org/files/?artifact_id=16339
            * http://urn.opengis.net/
            * http://www.opengeospatial.org/ogcUrnPolicy

        :param list srs_all: List of Spatial Reference Systems
        :param str for_version: optional Version String of the checked Version. Default ``None``.
        :rtype: status (:py:func:`bool`) and results (:py:func:`list`)
        """
        status_list = []
        anz_crs_rili = len(self.results_overview[8]['rili'].keys())

        if not len(srs_all):
            msg = "No SRS found"
            for i in xrange(anz_crs_rili):
                self.setResultsOverview("CRS-0%d"%(i+1), False, msg)
            return False, msg
        
        crs_mustnot = self.crs.crs_mustnot
        crs_optional = self.crs.crs_optional
        crs_must = self.crs.crs_must
        crs_3d_must = self.crs.crs_3d_must
        crs_3d_optional = self.crs.crs_3d_optional
        status = False
        results = []
        use_nons = False
        
        # Namespace Workaround
        crs_all_nonamespaces = []
        for crs in srs_all:
            if "urn:" in crs:
                splitted = crs.split(":")[-1]
                crs_all_nonamespaces.append("EPSG:" + splitted)
                use_nons = True 
    
        if use_nons:
            srs_all = crs_all_nonamespaces
            
        # Liste kürzen
        
        srs_all = unify(srs_all)
        #if DEBUG: print srs_all
        #if DEBUG: print crs_must
        #if DEBUG: print crs_optional
        for must in crs_must.keys():
            if crs_must[must] in srs_all:
                msg = "CRS %(crs)s found" % {'crs': crs_must[must]}
                status = True
            else:
                msg = "CRS %(crs)s not found, but must" % {'crs': crs_must[must]}
                status = False
            if for_version:
                msg+= " for %s Version %s" % (self.service, for_version)
            results.append(msg)
            status_list.append(status)
            self.setResultsOverview(must, status, msg)
        
        for must in crs_3d_must.keys():
            if crs_3d_must[must] in srs_all:
                msg = "CRS %(crs)s found" % {'crs': crs_3d_must[must]}
                status = True
            else:
                status = False
                msg = "CRS %(crs)s not found, but must" % {'crs': crs_3d_must[must]}
            if for_version:
                msg+= " for %s Version %s" % (self.service, for_version)
            results.append(msg)
            status_list.append(status)
            self.setResultsOverview(must, status, msg)
            
        for mustnot in crs_mustnot.keys():
            if crs_mustnot[mustnot] in srs_all:
                msg = "CRS %(crs)s found, but depreciated" % {'crs': crs_mustnot[mustnot]}
                if for_version:
                    msg+= " (found for %s Version %s)" % (self.service, for_version)
                status = False
            else:
                status = True
                msg = "CRS %(crs)s not found (is okay)" % {'crs': crs_mustnot[mustnot]}
                if for_version:
                    msg+= " for %s Version %s" % (self.service, for_version)
            results.append(msg)
            status_list.append(status)
            self.setResultsOverview(mustnot, status, msg)    
            
        for optional in crs_optional.keys():
            if crs_optional[optional] in srs_all:
                status = True
                msg = "Optional %(crs)s found" % {'crs': crs_optional[optional]}
            else:
                status = False
                msg = "Optional %(crs)s not found" % {'crs' : crs_optional[optional]}
            if for_version:
                msg+= " for %s Version %s" % (self.service, for_version)
            results.append(msg)
            status_list.append(status)
            self.setResultsOverview(optional, status, msg) 
               
        for optional in crs_3d_optional.keys():
            if crs_3d_optional[optional] in srs_all:
                status = True
                msg = "Optional %(crs)s found" % {'crs':crs_3d_optional[optional]}
            else:
                status = False
                msg = "Optional %(crs)s not found" % {'crs': crs_3d_optional[optional] }
            if for_version:
                msg+= " for %s Version %s" % (self.service, for_version)    
            results.append(msg)
            status_list.append(status)
            self.setResultsOverview(optional, status, msg)
            
        status = all(status_list)
        return status, results
    
    def checkISO8601(self, timestamp):
        """
        Checks Date(Time) according to ISO 8601.

        .. seealso::

            * :ref:`rili-allg-06`
            * `Regex by Cameron Brooks (Original by Dean)
              <http://underground.infovark.com/2008/07/22/iso-date-validation-regex/>`_
        
        :param string timestamp: Timestamp to validate
        :rtype: status and message
        """
        regex  = r'^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))'
        regex += r'?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))'
        regex += r'([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d'
        regex += r'([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$'
        iso_8601 = re.compile(regex)
        status = bool(iso_8601.match(timestamp))
        if status:
            msg = "Timestamp '%(timestamp)s' is ISO 8601 compilant" % locals()
        else:
            msg = "Timestamp '%(timestamp)s' is not ISO 8601 compilant" % locals()

        return status, msg
    
    def base_URLSyntax(self, url):
        """
        Checks a given string (`url`) if it matches an Internet Located Resource.

        Regex from: `Django-Webframework <https://docs.djangoproject.com/en/dev/ref/validators/#urlvalidator>`_

        :param string url: URL to check
        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        hints = []
        results = []
        regex = re.compile(
            r'^https?://' # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?.?|' #domain...
            r'localhost|' #localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
            r'(?::\d+)?' # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)

        status = bool(regex.search(url))

        if status:
            results.append('URL-Syntax ok')
        else:
            try:
                if ".cgi" in url:
                    status = True
                    results.append("URL-Syntax ok, but contains a dot")
                    url = url.split(".cgi")[0]
                    check = self.base_URLSyntax(url)
                    status = check.status
                    results.extend(check.results)

                elif url.startswith("http://") and ("@" in url) and (":" in url):
                    url = url.split("http://")[1]
                    user, host = urllib.splituser(url)
                    user, password = urllib.splitpasswd(user)
                    self.auth = {
                        'user':user,
                        'pass':password
                    }
                    self.base_url = self.base_url.replace("%s:%s@" %(user, password), "")
                    check = self.base_URLSyntax(self.base_url)
                    status = check.status
                    results.extend(check.results)

                elif url.startswith("https://") and ("@" in url) and (":" in url):
                    url = url.split("https://")[1]
                    user, host = urllib.splituser(url)
                    user, password = urllib.splitpasswd(user)
                    self.auth = {
                        'user':user,
                        'pass':password
                    }
                    self.base_url = self.base_url.replace("%s:%s@" %(user, password), "")
                    check = self.base_URLSyntax(self.base_url)
                    status = check.status
                    results.extend(check.results)

                else:
                    results.append("Please recheck url %s" % url)

            except (IndexError, TypeError), e:
                results.append("Please recheck url %s" % url)
                status = False

        if not status:
            self.base_error = True
            self.base_error_msg = results
        
        self.setResultsOverview("Status", status, results)
        return ResponseDict('base_URLSyntax', results, status, hints)
    
    def base_RandomRequest(self):
        """
        Generates a random 15 character long string and sends it as the `REQUEST` value (instead of `GetCapabilities`)
        to the server (i.e.: `http://url.com/wms?request=89WFGA83FSWAJQL&service=WMS`) and checks the response:

            * Checking HTTP Error Code, if HTTP Error (caught by :py:exc:`urllib2.URLError` or
              :py:exc:`urllib2.HTTPError`), :ref:`rili-allg-03` is fulfilled.

                * Checkering Header Info's, if response returns an OWS Service Exception (XML File)
                  (i.e.: `application/vnd.ogc.se_xml`), :ref:`rili-exce-01` and :ref:`rili-exce-02` fulfilled.

                    * if encoding of Service Exception is in UTF-8, :ref:`rili-allg-04` is fulfilled.

                * else checking encoding of returned resource:

                    * :ref:`rili-exce-01` not fulfilled,
                    * if encoding is in UTF-8, :ref:`rili-exce-02` is fulfilled
                    * else :ref:`rili-exce-02` is not fulfilled.

                * If any response from server, :ref:`rili-allg-03` is fulfilled.

        .. seealso::

            * :ref:`rili-exce-01`
            * :ref:`rili-exce-02`
            * :ref:`rili-allg-03`
            * :ref:`rili-allg-04`
            * :py:exc:`xml.parsers.expat.ExpatError`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        
        if self.restful:
            return ResponseDict("base_RandomRequest", ['Skipped, is restful'], True)
        
        enc_status = status = False
        results = []
        hints = []
        header = "No Header found"
        string = ''
        for i in random.sample('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',15):
            string+=i

        kvp = {'request':string,
               'service':self.service,
               'version':self.version}
        
        req_url = self.build_kvp_url(self.base_url, kvp, self.swapcases)
        #self.base_url + "?" + urllib.urlencode(kvp)
        results.append("Checking URL "+req_url)
        version = self.version + ": "
        try:
            # HTTP-Request
            f = URL2File(req_url)

            # Dateiheader
            header = f.info().gettype()
            results.append(header)
            hints.append("ALLG-03")
            status = True
            if header in self.service_exceptions:
                # Gibt auch an, dass der Dienst Service Exceptions unterstützt
                self.setResultsOverview("EXCE-01", True, version + header, data={'mime_type':header})
                self.setResultsOverview("EXCE-02", True, version + "see EXCE-01 (Service supports Service Exceptions)")
                # Encoding
                tree = dom.parse(f)
                #print "Checking", req_url
                encoding = self.xml_Encoding(tree, name="Service Exception")
                enc_status = encoding['status']
                hints.append("ALLG-04")
                results.append("%s" %encoding['results'][0])
                self.setResultsOverview("ALLG-04", enc_status, encoding.results)

            else:
                # Gibt auch an, dass der Dienst keine Service Exceptions unterstützt,
                # oder es sich um einen nicht unterstützen MIME-Typ handelt (z.B. HTML)
                se = self.service_exceptions
                msg = "Header %(header)s not in %(se)s - EXCE-02" % locals()
                self.setResultsOverview("EXCE-01", False, version + msg, data={'mime_type':header})
                try:
                    tree = dom.parse(f)
                    #print "Checking", req_url
                    encoding = self.xml_Encoding(tree, name="Non Service Exception", ignore_rili=True)
                    enc_status = encoding['status']
                    self.setResultsOverview("EXCE-02", enc_status, encoding['results'])
                except xml.parsers.expat.ExpatError, e:
                    results.append("%(header)s could not be read" % locals())
                    self.setResultsOverview("EXCE-02", False, version + header)

        #except KeyError, e:
        #    results.append(e)

        except urllib2.URLError, e:
            # z.B. HTTP Error 400: Bad Request
            results.append("URLError: "+ str(e))
            status = True
            
        except urllib2.HTTPError, e:
            status = True
            results.append("HTTPError: %s: %s" %(e.code, e.msg))
            
        except xml.parsers.expat.ExpatError, e:
            results.append("Response in XML, but XML parser error in line %d" %e.lineno)

        if header == 'No Header found':
            self.setResultsOverview("EXCE-01", False, "No Exception Message given, no Header found, TBD")
            self.setResultsOverview("EXCE-02", False, "No Exception Message given, no Header found, TBD")
        
        self.setResultsOverview("ALLG-03", status, header)
        return ResponseDict('base_RandomRequest', results, all([status, enc_status]), hints)
    
    def base_GetCapHandler(self):
        """
        Download and offer the GetCapabilities document from the given :py:attr:`base_url` as :py:attr:`gc_dict`.

        How it works:

            * Download GetCapabilities document, if successful :ref:`rili-allg-01` and :ref:`rili-allg-02` fulfilled.
            * Getting and verifying Headerinformations (HTTP Status code with content `200`,
              MIME Type with content `xml`)
            * Preparing XML document for XML parser (only XML Node object)
            * Parsing XML Tree, offer as :py:class:`XML2Dict <ows_checker._helpers.xml2dict.XML2Dict>`
            * Checking encoding of XML document for UTF-8 with :py:meth:`xml_Encoding`
            * Check, if document content in an OWS Exception

        Affected Guidlines:build_kvp_url

            * :ref:`rili-allg-01` through hardcoded parameters in HTTP-Request
            * :ref:`rili-allg-02` through using no vendor specific parameters in HTTP-Request
            * :ref:`rili-allg-03` through getting an HTTP-Response
            * :ref:`rili-allg-04` through :py:meth:`xml_Encoding` (UTF-8)

        Caught Python Exceptions:

            * :py:exc:`urllib2.HTTPError`
            * :py:exc:`urllib2.URLError`
            * :py:exc:`xml.parsers.expat.ExpatError`


        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        status = False
        hints = ["ALLG-01",
                 "ALLG-02"]
        
        xmldict = xml2dict.XML2Dict()
        try:
            if self.restful:
                service_gc = self.service_settings.REST.GetCapabilities
                ows_url = self.build_kvp_url(urllib.basejoin(self.base_url, service_gc), {})
                if DEBUG: print ows_url

            else:

                kvp = {'request':'GetCapabilities',
                       'service':self.service}

                if self.version:
                    kvp.update({'version':self.version})

                ows_url = self.build_kvp_url(self.base_url, kvp, swapcases=self.swapcases)
                gc_file = URL2File(ows_url, auth=self.auth)
                try:
                    dom.parse(gc_file)
                except xml.parsers.expat.ExpatError, e:
                    self.swapcases = True
                    ows_url = self.build_kvp_url(self.base_url, kvp, swapcases=self.swapcases)


            results = [ows_url]

            print "GetCap", ows_url

            try:
                gc_file = URL2File(ows_url, auth=self.auth)
                if ows_url.ssp:
                    self.setResultsOverview("ALLG-02", False, "URL contains Vendor Specific Parameters")
                else:
                    self.setResultsOverview("ALLG-02", True, "URL contains no Vendor Specific Parameters")
                self.setResultsOverview("ALLG-03", True, "Anfrage erhalten")
                hints.append("ALLG-03")
                self.gc_file_info = gc_file.info()
                self.tree = dom.parse(gc_file)
                results.append(self.gc_file_info.gettype())
                if "xml" not in gc_file.info().gettype():
                    msg = "Returned files is not an XML file: %s" %(gc_file.info().gettype())
                    results.append(msg)
                    self.setResultsOverview("Status", False, msg)
                    return ResponseDict("_base_GetCapHandler", gc_file.info().gettype(), False)

                for node in self.tree.childNodes:
                    if node.nodeType == dom.Node.ELEMENT_NODE:
                        body = node.toxml('utf-8')
                        if has_django:
                            body = smart_str(body)
                self.gc_dict = xmldict.fromstring(body)
                if gc_file.code == 200:
                    status = True
                    d = self.xml_Encoding(self.tree, name="GetCapabilites")
                    # ALLG-04
                    # self.setResultsOverview("ALLG-04", d.status, d.results)
                    # wird in self.xml_Encoding erledigt
                    # Don't stop at non UTF-8
                    # status = d.status
                    results.append(d.results)
                    if not d.status:
                        msg = 'GetCapabilities: XML-Encoding does not match UTF-8'
                        results.append(msg)
                    hints.append(d.hints)   # = ALLG-04

                else:
                    err_msg = "Request failed: Code %s" %gc_file.code
                    results.append(err_msg)
                    self.setResultsOverview("Status", status, err_msg)
                gc_file.close()

            except urllib2.HTTPError, e:
                # Wird in folgenden Fällen aufgerufen
                # - Netzwerk nicht erreichbar
                # - Authentifizierung erforderlich
                ex_msg = u"HTTP-Error: %s %s" %(e.code, e.msg)
                results.append(ex_msg)
                self.setResultsOverview("ALLG-02", False, ex_msg)
                self.setResultsOverview("ALLG-03", True, ex_msg)
                self.setResultsOverview("Status", False, ex_msg)

            except urllib2.URLError, e:
                ex_msg = str(e.reason)
                results.append(ex_msg)
                self.setResultsOverview("Status", False, ex_msg)

            except socket.timeout, e:
                ex_msg = "Time Out"
                results.append(ex_msg)
                self.setResultsOverview("Status", False, ex_msg)

            except xml.parsers.expat.ExpatError, e:
                ex_msg = "GetCapabilities not well-formed: %s" %str(e)
                results.append(ex_msg)
                self.setResultsOverview("Status", False, ex_msg)

        except urllib2.HTTPError, e:
            ex_msg = "HttpError"
            self.setResultsOverview("Status", False, ex_msg)
            results = []
            results.append(e.msg)

        except urllib2.URLError, e:
            ex_msg = "URL Error %s" %(e)
            results = []
            results.append(ex_msg)
            self.setResultsOverview("Status", False, ex_msg)

        except socket.timeout, e:
            ex_msg = "Time Out"
            results.append(ex_msg)
            self.setResultsOverview("Status", False, ex_msg)

        if self.gc_dict:    
            if self.gc_dict.has_key('ServiceExceptionReport') or self.gc_dict.has_key('ExceptionReport'):
                exceptionmsg = "(no exception msg)"
                status = False
                value = ""
                if self.gc_dict.has_key('ServiceExceptionReport'):
                    code = self.gc_dict.ServiceExceptionReport
                    if code.has_key('ServiceException'):
                        value = _value(code.ServiceException)
                    else:
                        value = 'No ServiceException found'
                    
                elif self.gc_dict.has_key('ExceptionReport'):
                    try:
                        code = self.gc_dict.ExceptionReport.Exception.exceptionCode
                        value = self.gc_dict.ExceptionReport.Exception.ExceptionText.value
                    except KeyError, e:
                        msg = "Server responen with (Service)ExceptionReport but has no Element %s" %(e)
                        self.setResultsOverview("Status",
                            status,
                            msg)
                        self.base_error = True
                        self.base_error_msg = msg
                        return ResponseDict('base_VersionHandler', msg, status)
                
                msg = "Server responded with a (Service)ExceptionReport XML Document: %(value)s, exceptionCode was: %(code)s, URL was %(ows_url)s" % locals()
                self.setResultsOverview("Status", 
                                        status, 
                                        msg)
                # Set Trigger self.
                self.base_error = True
                self.base_error_msg = msg
                return ResponseDict('base_VersionHandler', msg, status)
            
        if not status:
            self.base_error = True
            self.base_error_msg = results
            
        return ResponseDict('base_GetCapHandler', results, status, hints)
    
    def base_ServiceHandler(self):
        """
        Checks, if the given service is equal the service defined in the GetCapabilities document.
        This avoids user input mistakes (wrong Service Type selection) and useless error messages.
        
        Definition in settings xml file. Example ``Operations.GetCapabilities.WayToServiceTypeNode``
        
        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        
        status = False
        results = []
        hints = []
        service = None
        
        try:
            ways = self.service_settings.Operations.GetCapabilities.WayToServiceTypeNode
        except KeyError:
            self.base_error = True
            service = self.service.lower()
            msg = 'No Element "WayToServiceTypeNode" not found. '
            msg += 'Please add this Element to settings/%(service)s.xml at Operations.GetCapabilities.WayToServiceTypeNode' % locals()
            self.base_error_msg = msg
            results.append(msg)
            return ResponseDict('base_ServiceHandler', results, status, hints)
        
        if isinstance(ways, list):
            ways = [way.value for way in ways]
        elif isinstance(ways, str):
            ways = [ways]
        
        def detect_way(ways, gc):
            """
            Function to look up for given ``ways`` (XML Path) in a GetCapabilities document.

            :param list ways: List of :py:func:`str` which defines the Service Type inside the GetCapabilities document
            :param dict gc: GetCapabilities document
            """
            msg = ''
            found_in_gc = False
            
            #if DEBUG: print "Ways", ways
            
            for node in ways:             
                for way in node.split('.'):                    
                    if isinstance(gc, str):
                        #if DEBUG: print "found in gc?", found_in_gc, gc, way, node
                        return found_in_gc, msg, gc
                    
                    if gc is None:
                        continue
                        
                    if gc.has_key(way):   
                        #if DEBUG: print "got way", way             
                        gc = getattr(gc, way)     
                        msg = "Way found: %s" %(way)  
                        
                        if way == node.split('.')[-1]:
                            found_in_gc = True                          
                            results.append('Found node %s' %(node))
                            #if DEBUG: print "Found!!!!!!!!!!!!!!!!!!!"
                            return found_in_gc, msg, gc
                    else:
                        service = self.service
                        msg = "Definition not found in %(node)s, seems to be no %(service)s!" % locals()
                        continue
            
            return found_in_gc, msg, gc
                    
        gc = self.gc_dict
        
        found_in_gc, msg, gc = detect_way(ways, gc)    

        if DEBUG:
            print msg
            print found_in_gc
            print gc
            print type(gc)

        
        if found_in_gc:
            if isinstance(gc, str):
                #if DEBUG: print "Found Service %s" %gc
                service = gc
            elif isinstance(gc, dict):
                #if DEBUG: print gc
                service = gc.value
            else:
                if DEBUG: print "Unknown instance: %s" %(type(gc))
            
            # Convert to uppercase (self.service is uppercase, too)    
            service = service.upper()
            
            status = self.service in service
            results.append('Service found in GetCapabilities: %s, Service requested: %s' %(service, self.service))

        if self.gc_dict is not None:
            if "%s_Capabilities" % (self.service.upper()) in self.gc_dict.keys():
                status = True
        else:
            status = False

        if not status:
            msg = 'Service Type "%s" (in GetCapabilities) does ' \
                  'not match "%s" (Form). ' \
                  'Service Name Node not found in GetCapabilities! Please check your parameters (url=service?) or ' \
                  'your settings/%s.xml.' %(service, self.service, self.service)
            self.base_error = not status
            self.base_error_msg = msg
            
        return ResponseDict('base_ServiceHandler', results, status, hints)
        
    def base_VersionHandler(self):
        """
        Detects the Version of the Service returned in the GetCapabilities document.

        It handles the different GetCapabilities documents (different root element names, i.e. in WMS Version 1,1,1 it's
        `WMS_Capabilities`, in WMS Version <= 1.1.1 it's `WMT_MS_Capabilities` and in OWS Common Services it's
        `Capabilities`) and sets the corresponding attributes:

        * `version`: from GetCapabilities document
            * `ows_common`: if the root element name is `Capabilities`, sets :ref:`rili-allg-05`.
            * `service_settings_version`: settings from `settings/*.xml` according to detected version
            * `gc_xmlroot`: XML root element mapped according to the detected root element name
            * `version_list`: settings from `settings/*.xml`
            * `service_exceptions`: settings from `settings/*.xml`


        .. note::

            On errors like "Version X.Y.Z not found in settings/WMS.xml!" you should modify the settings file.
        
        .. seealso::

            * :ref:`rili-allg-05`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        key = self.service + '_Capabilities'
        status = True
        results = []
        
        # nur WMS <= 1.1.1
        if self.gc_dict.has_key('WMT_MS_Capabilities'):
            v = _ns(self.gc_dict.WMT_MS_Capabilities.version)
            r = 'WMT_MS_Capabilities'
            
        
        # z.B. WMS_Capabilities
        elif self.gc_dict.has_key(key):
            v = _ns(self.gc_dict[key].version)
            r = key
        
        # z.B. Capabilities (i.d.R. OWS Common)
        elif self.gc_dict.has_key('Capabilities'):
            v = _ns(self.gc_dict.Capabilities.version)
            r = 'Capabilities'
            
        else:
            r = None
            v = None
            status = False
            element = _ns(self.gc_dict.keys())
            msg = "Unsupported XML Element Node found %(element)s" % locals()
            self.base_error = True
            self.base_error_msg = msg
            self.setResultsOverview("Status", 
                                    status, 
                                    msg)
            return ResponseDict('base_VersionHandler', msg, status)
            
        # GC XML Root Node
        self.gc_xmlroot = self.gc_dict[r]
        results.append("Detected %s Version: %s" %(self.service, v))
        
        # Version
        if v:
            self.version = v
            self.version_list = v.split('.')
        else:
            raise Exception('Version konnte nicht ermittelt werden :-(')

        if self.version != self.version_requested:
            results.append("Requested minimal Version '%s' but got Version '%s'" %(self.version_requested, self.version))

        # Read Settings
        for sv in _ns(self.service_settings.Version):
            if _ns(sv.num) == _ns(self.version):
                self.service_settings_version = sv
                self.service_exceptions = [_ns(s) for s in sv.Exception]
                se = self.service_exceptions
                self.ows_common = _b(_ns(self.service_settings_version.OWS_Common))
                break
            
        if not self.service_settings_version:
            self.base_error = True
            version = self.version
            service = self.service.lower()
            self.base_error_msg = "Version %(version)s not found in settings/%(service)s.xml!" %(self.version, self.service.lower())
            
        if self.ows_common:
            results.append("Service supports OWS Common")
        else:
            results.append("Server doesn't support OWS Common")
        self.setResultsOverview("ALLG-05", self.ows_common, results, data={'service':self.service, 'version':self.version})
        return ResponseDict('base_VersionHandler', results, status)
    
    def base_SwapCases(self):
        """
        Checking :ref:`rili-allg-01` trough swapcase the KVP-Values:

        I.e.: `request=gETcAPABILITIES`

        If the response from the server with the correct (`GetCapabilities`) request parameters differs from the
        incorrect (`gETcAPABILITIES`) parameters, :ref:`rili-allg-01` is fulfilled.

        .. note::

            This never happen. Or?

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        #if self.restful:
        #    return ResponseDict("base_SwapCases", ['Skipped, is restful'], True)
        if True:
            return ResponseDict("base_SwapCases", ['Not checked'], True)
        
        service = self.service
        version = self.version
        
        hints = "ALLG-01"
        status = False # Allg-01 not supported by Default

        # Swapcase only Values (not Keys)
        kvp = {'request':'GetCapabilities'.swapcase(),
               'service':service.swapcase()}
        if version:
            # Versionstring cant be caseswapped
            kvp.update({'version':version})

        ows_url = self.build_kvp_url(self.base_url, kvp, swapcases=self.swapcases)
        results = [ows_url]
        
        # Ursprüngliche, "korrekte" Headerinformationen
        typeheader_no_swap = self.gc_file_info.gettype()

        # Compare Headerinformations
        header_status = False
        try:
            equal, header = self.checkFileHeader(typeheader_no_swap, ows_url)
            header_status = not equal
            results.append("%s = %s" %(header, typeheader_no_swap))

        except urllib2.HTTPError, e:
            results.append(u"HTTP-Error: %s %s" %(e.code, e.msg))

        except urllib2.URLError, e:
            results.append(str(e.reason))

        # Compare Root Elements
        try:
            f = URL2XML2Dict(ows_url)
            keys_in_swap = f.keys()
            keys_in_no_swap = self.gc_dict.keys()
            element_status = not (keys_in_swap == keys_in_no_swap)
            results.append("Element Names in Original GetCapabilites (" + ", ".join(keys_in_no_swap) + ") vs in Swap (" + ", ".join(keys_in_swap) + ")")
        except Exception, e:
            element_status = True
            results.append(str(e))

        if header_status:  status = True
        if element_status: status = True

        self.setResultsOverview("ALLG-01", status, results)
        return ResponseDict('base_SwapCases', results, status, hints)
    
    def base_SSXMLHandler(self):
        """
        Gets and parses the Server Settings XML document and validates the base structure.

        .. seealso::

            * :ref:`rili-wms-50`
            * :ref:`rili-wfs-50`
            * see examples in `examples/ssxml/*.xml` for different servers

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        _ss = xml2dict.XML2Dict()
        status = True
        msg = 'Error reading ServerSetting file: '
        if self.ssurl:
            r = self.base_URLSyntax(self.ssurl)
            if r['status']:

                try:
                    # Convert URL to a File Object
                    f = URL2File(self.ssurl)
                    # Read the DOM of the XML
                    tree = dom.parse(f)
                    # Get the Body of the XML 
                    for node in tree.childNodes:
                        if node.nodeType == dom.Node.ELEMENT_NODE:
                            body = node.toxml('utf-8')
                    # Convert XML to a dict
                    self.ssxml = _ss.fromstring(body)['ServerSettings']
                    # check for Content
                    #sc = self.ssxml['ServerCapabilities']['Security']['HTTPSLogin'].keys()
                    #compare = all([v in ['Password', 'Username', 'value'] for v in sc])
                    
                    # Weitere dienstspezifische Überprüfungen erfolgen in der
                    # entsprechenden Methode
                    # WMS: wms_GetFeatureInfo
                                
                    # Setzte auf okay:
                    #status = compare
                    if self.service == 'WMS':
                        status = False
                        try:
                            wms = dict2list(self.ssxml.WMS)
                            for w in wms:
                                if w.has_key('GetFeatureInfo'):
                                    features = dict2list(w.GetFeatureInfo.Feature)
                                if w.has_key('Layers'):
                                    layers_in_ssxml = dict2list(w.Layers.Layer)

                            for feat in features:
                                must_params = ['REQUEST', 'CRS', 'FORMAT', 'WIDTH',
                                               'HEIGHT', 'BBOX', 'QUERY_LAYERS',
                                               'LAYERS', 'STYLES', 'I', 'J',
                                               'FEATURE_COUNT', 'INFO_FORMAT',
                                               'EXCEPTIONS', 'value']
                                for param in must_params:
                                    a = feat.Params[param]

                            ssxml_valid = True
                            status = True

                        except (KeyError, AttributeError), e:
                            e = str(e)
                            temp = e.split(" ")
                            msg += 'Element %s not found' % temp[len(temp) - 1]

                except KeyError, e:
                    element = str(e)
                    msg += 'Element %(element)s not found!' % locals()
                except urllib2.HTTPError, e:
                    msg += 'HTTP-Error: %s %s, URL: %s' %(e.code, e.msg, self.ssurl)
                except urllib2.URLError, e:
                    msg += 'URL-Error: %s' %(e.reason)
                except xml.parsers.expat.ExpatError, e:
                    msg += 'XML not well formed: %s' %(str(e))

                if not status:    
                    if DEBUG: print msg
                
        else:
            """
            Use Fallback
            """
            self.ssxml = object_dict.object_dict({
                'ServerCapabilities' : {
                        'Security': {
                            'HTTPSLogin': {
                                'Username':'',
                                'Password':''                                
                            },
                            'SSL': '0',
                            'SSLCertificate': '',
                            'SwissID':''
                        }
                    }
                })
            status = True
            #self.ssurl = 'fallback'
                
        if status:
            url = self.ssurl or 'fallback'
            results = ['Successfully read from %(url)s' % locals()]
        else:
            self.base_error = True
            self.base_error_msg = msg
            results = [msg]
            
        return ResponseDict('base_SSXMLHandler', results, status)
    
    def security_HttpsHandler(self):
        """
        Checks for `https://` in Server URL.

        Todo:

            * Implement Username/Password authentication
            * Implement SwissID verification

        .. seealso::

            * :ref:`rili-secu`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        status = False
        results = []
       
        # SECU-01

        if self.base_url.startswith('https://'):
            results.append("Service uses HTTPS")
            status_https = True
        else:
            results.append("Service uses no HTTPS")
            status_https = False

        self.setResultsOverview("SECU-01", status_https, results)

        # SECU-02

        results = []
        status = bool(self.auth)
        if status:
            results.append("Service uses HTTP Basic Authentification")
        else:
            results.append("Service uses no HTTP Basic Authentification")


        self.setResultsOverview("SECU-02", status, results)
        self.setResultsOverview("SECU-03", status=False, msg=["Check for SuissID not implemented"])
        
        return ResponseDict('security_HttpsHandler', results, status)
    
    def language_GetCapLang(self):
        """
        Checks for language support by checking following language identifications

        * German: 'de', 'deu', 'de-CH', 'ger'
        * French: 'fr',  'fra', 'fr-CH', 'fre'
        * Italien: 'it', 'ita', 'it-CH',
        * English: 'en', 'eng', 'en-US', 'en-GB', 'en-CA'
        * Romantsch: 'roh', 'rm'

        in

        * the GetCapabilities document (Element Attribute `xml:lang`), see :ref:`rili-lang-01`
        * the GetCapabilities document Element <Languages>, see `OGC Web Service Common Implementation Specification 2.0.0`,
          Chapter 7.4.11 `Service metadata XML example`, Page 60
        * the GetCapabilities document Element `Operation.Parameter[name="Language"].Value` (XPath expression),
          see :ref:`rili-lang-02`
        * the URL of the Server, i.e. `http://server/geoserver/de-CH/wms`, see :ref:`rili-lang-03`
            * if :ref:`rili-lang-03` fulfilled, the language identifier is cut from the URL and a new Request
              (i.e. `http://server/geoserver/wms`) is made. If the Server response with HTTP Status Code 300
              (multiple choices), :ref:`rili-lang-04` is fulfilled.

        For Limitations / Interpretations of :ref:`rili-lang` see Note at :ref:`rili-lang-01`.

        .. seealso::

            * :ref:`rili-lang-01` (GetCapabilities, URL)
            * :ref:`rili-lang-02` (GetCapabilities)
            * :ref:`rili-lang-03` (URL)
            * :ref:`rili-lang-03` (URL, Request)

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        status = False
        ch_langs = ['de', 'deu', 'de-CH', 'ger',                # Deutsch
                    'en', 'eng', 'en-US', 'en-GB', 'en-CA',     # Englisch
                    'fr',  'fra', 'fr-CH', 'fre',               # Französisch
                    'it', 'ita', 'it-CH',                       # Italienisch
                    'roh', 'rm']                                # Romanisch
        
        url_status = False
        url_results = []
        langs_found  = []
        results = []
        
        """
        By GetCapabilities
        """
        f = None
        if self.restful:
            url = urllib.basejoin(self.base_url, self.service_settings.REST.GetCapabilities)
        else:
            kvp = {
                   'request': 'GetCapabilities',
                   'service': self.service,
                   'version': self.version
                   #'language':'de-CH'
            }
            url = self.build_kvp_url(self.base_url, kvp, swapcases=self.swapcases)
        try:
            f = URL2File(url, auth=self.auth)
            for line in f.readlines():
                # <Title xml:lang="fr">
                l = re.compile('xml:lang="(\w+)"')
                found = l.findall(line)
                if found:
                    langs_found.append(found[0])
        except Exception, e:
            url_results.append("%s for URL %s" %(e, url))

        finally:
            if f:
                f.close()
            
        # Check Capabilities.Languages
        try:
            for lang in dict2list(self.gc_xmlroot.Languages.Language):                
                langs_found.append(lang.value)
            results.append('Found following languages: ' + ', '.join(langs_found))
        except KeyError:
            results.append('XML Element "Languages" not found.')
                    
        if DEBUG: print langs_found
            
        """
        LANG-02
        Suche in Operation.Parameter(name=Language).Value
        """
        # Get the Service Operations (same as in meta_ServiceOperations)
        """
        if self.ows_common:
            #OWS_Common Workaround 
            service_ops = dict2list(self.gc_xmlroot.OperationsMetadata.Operation)
        else:
            service_ops = dict2list(self.gc_xmlroot.Capability.Request)
        
        #if DEBUG: print service_ops
        langs_in_param_found = []
        for operation in service_ops:
            if not operation.has_key('Parameter'):
                continue
            else:
                params = dict2list(operation.Parameter)
                for param in params:
                    if "language" == param.name.lower():
                        for lang in dict2list(param.Value):
                            langs_in_param_found.append(lang.value)
                            langs_found.append(lang.value)
                            
        if len(langs_in_param_found):
            self.setResultsOverview("LANG-02", True, "Found following languages: " + ', '.join(langs_in_param_found))
        else:
            self.setResultsOverview("LANG-02", False, "Found no languages in Parameters")

        """

        """
        By URL-naming
        LANG-03
        LANG-04
        """
        #else:
        urls = self.base_url.split("/")
        url_results = "Service does not support languages via URL-Path"
        for url_lang in urls:
            if url_lang in ch_langs:
                url_status = True
                langs_found.append(url_lang)
                results.append("Supported language %s found" %url_lang)
                url_results = "Supports languages via URL-Path '%s'"%url_lang
                break
        
        """
        Checking for HTTP status 300
        """
        
        if url_status:
            http_status_code_redirect = 300
            http_status_code = None
            http_300 = False 
            http_300_results = 'Server responded with HTTP status code 300 (multiple choices)'
            
            base_url = self.base_url.replace("/%s/" %(url_lang), "/")
            url = self.build_kvp_url(base_url, kvp, self.swapcases)
            results.append('Checking for URL %s' %(url))
            try:                  
                f = URL2File(url, auth=self.auth)
                http_status_code = f.code            
            except Exception, e:
                http_status_code = e.code
            finally:
                f.close()
            
            http_300 = http_status_code_redirect == http_status_code
            if not http_300:
                http_300_results = 'Server responded with HTTP status code %i (should be 300)' %(http_status_code)
        
        else:
            http_300 = False
            http_300_results = 'Service does not support redirection (HTTP Status Code 300)'
        self.setResultsOverview("LANG-04", http_300, http_300_results)
            
        """
        Checking equalness
        """
        equal_langs = []
        
        for l in ch_langs:
            if l in langs_found:
                equal_langs.append(l)
            else:
                pass
        results.append("Found %s eCH-languages (%s) in GetCapabilities." %(len(equal_langs), ', '.join(equal_langs)))
        status = bool(len(equal_langs))
        
        if not status:
            results.append("Service does not support languages (via GetCapabilities)")
        if not url_status:
            url_results = "Service does not support languages (via URL)"
        
        hints = "LANG-xx"
        # Anzahl > 0 der gefundenen übereinstimmenden Sprachangaben erfüllt LANG-01
        equal_langs = ["'%s'" %l for l in equal_langs]
        self.setResultsOverview("LANG-01", status, results, data={'code':', '.join(equal_langs)})
        self.setResultsOverview("LANG-03", url_status, url_results, data={'code':url_lang})

        #status = any([status, url_status, http_300, langs_in_param_found])
        status = any([status, url_status, http_300])
        return ResponseDict('language_GetCapLang', results, status, hints)
    
    def vers_MinService(self):
        """
        Checks for minimum supported Version number. The minimum supported Version number is defined as
        Element `minVersion` in the `settings/*.xml` files:

        .. code-block:: xml

            <wms>
                <minVersion>1.1.1</minVersion>
                <currVersion>1.3.0</currVersion>
	            ...
            </wms>


        .. seealso::

            * :ref:`rili-wms-01`
            * :ref:`rili-wmts-01`
            * :ref:`rili-wfs-01`
            * :ref:`rili-wcs-01`
            * :ref:`rili-csw-01`
            * :py:meth:`vers_MaxService`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        status = False
        m = _ns(self.service_settings.minVersion)
        hints = ["%(v)s-01: Die Umsetzung eines %(v)s MUSS mind. der OGC %(v)s Version %(m)s entsprechen." %{'v':self.service, 'm':m}]
        m_list = m.split('.')
        min = int(''.join(m_list))
        ist = int(''.join(self.version_list))
        if ist == min: status = True
        if status: results = "%s == %s" %(self.version, m)
        else: results = "%s not equal to min. Version %s" %(self.version, m)
        
        self.setResultsOverview("%s-01" % self.service, status, results)
        return ResponseDict('vers_MinService', results, status, hints) 
    
    def vers_MaxService(self):
        """
        Detects the highest Version supported by the server and adds the XML of each
        detected Version to ``gc_by_version``.

        This method sends multiple requests to the server. Each request differs in the `version` parameter and will be
        compared with the latest and highest Version found in GetCapabilities document.

        The versions can be defined in the `settings/*.xml` files.

        Part of `settings/wms.xml`:

        .. code-block:: xml
            
            <currVersion>1.3.0</currVersion>   # current suggested Version
            <Version num="1.1.1"> # WMS Version 1.1.1
                ...
                Options for WMS 1.1.1
                ...
            </Version>
            <Version num="1.3.0"> # WMS Version 1.3.0
                ...
                Options for WMS 1.3.0
                ...
            </Version>

        Process:
        
            * if `version` given in :py:meth:`__init__`, then compare the given version number with the requested
              version number.
            * Parse versions from `<Version>` Elements in `settings/*.xml`
            * Perform a `request=GetCapabilities&version=<version>`
            * Compare the given version number with the requested version number
            * If requested Version (without `version` key in Request) equal to highest supported version from the
              server (determined through the multiple requests (with `version` key in Request) :ref:`rili-vers-01`
              (and :ref:`rili-wms-05`, :ref:`rili-wcs-02`, :ref:`rili-wfs-04`) fulfilled.

        .. seealso::

            * :ref:`rili-vers-01`
            * :ref:`rili-wms-05`
            * :ref:`rili-wcs-02`
            * :ref:`rili-wfs-04`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        hints = ["VERS-01"]
        highest_supported = 0
        version_in_settings = 0
        status = False
        supported = []
        results = []
        highest_possible = int(_ns(self.service_settings.currVersion).replace('.', ''))

        
        # Falls eine Version im GC-Request-Parameter gegeben ist
        if self.version_given or self.version_requested:
            req = self.version_requested
            ver = self.version
            status = req == ver
            msg = "Requested Version: %(req)s - got Version %(ver)s" % locals()
            results.append(msg)
            #self.setResultsOverview("VERS-01", status, msg, data={'versions':ver})
            #return ResponseDict("detectMaxService", results, status, hints)
            
        
        # Iterieren über die <Version num="x.x.x"> Elemente in der XML-Settings-Datei
        default_rest_version = self.service_settings.minVersion
        for version in self.service_settings.Version:
            version_in_settings = _ns(version.num)
            if self.restful:
                base = self.base_url.replace(default_rest_version, version_in_settings)
                url = urllib.basejoin(base, self.service_settings.REST.GetCapabilities) 
            else:
                kvp = {
                    'request':'GetCapabilities',
                    'service':self.service,
                    'version':version_in_settings
                }
                url = self.build_kvp_url(self.base_url, kvp, self.swapcases)
            
            if DEBUG: print url 
                                            
            try:
                f = URL2File(url, auth=self.auth)

            except IOError, e:
                return ResponseDict('vers_MaxService', str(e)+url, False, hints)
            
            xmldict = xml2dict.XML2Dict()
            try:
                xml = xmldict.fromstring(f.read())
                # Check Mime-Type here
                root = xml.keys()[0]
                current_gc_version = int(xml[root].version.replace('.', ''))
                results.append("Checking for version %s - got version %s" %(_ns(version_in_settings), 
                                                                        xml[root].version))

                self.gc_by_versions[xml[root].version] = xml[root]

            except SyntaxError:
                results.append("Could not parse %s" % url)

            supported.append(".".join(str(current_gc_version)))

            if highest_supported <= current_gc_version:
                highest_supported = current_gc_version
        
        max_int = highest_supported
        max_str = ".".join(list(str(highest_supported)))
            
        service_version = int(self.version.replace('.',''))
        """
        if max_int > service_version:
            results.append("Server responded with version %s by default, although version %s is supported" %(self.version, 
                                                                                                    max_str))
        else:
            results.append("Server responded with highest supported version %s by default" %self.version)
            #status = True
        """
        if self.service == "WMS":
            msg = "Server supports version: " + max_str
            self.setResultsOverview("WMS-05", max_int>=highest_possible, msg)
            results.append(msg)
            hints.append("WMS-05")
        elif self.service == "WFS":
            msg = "Server supports version: " + max_str
            results.append(msg)
            self.setResultsOverview("WFS-04", max_int>=highest_possible, msg)
            hints.append("WFS-04")
        elif self.service == "WCS":
            msg = "Server supports version: " + max_str
            results.append(msg)
            self.setResultsOverview("WCS-02", max_int>=highest_possible, msg)
            hints.append("WCS-02")
        
        else:
            # Sonstige Dienste, wo die Version in XXX-01 definiert ist
            msg = "Server supports version: " + max_str
            results.append(msg)            
            self.setResultsOverview("%s-01" %(self.service), max_int>=highest_possible, msg)
            hints.append("%s-01" %(self.service))

        ver = ", ".join(unify(supported))
        self.setResultsOverview("VERS-01", status, results, data={'versions':ver})
        return ResponseDict("vers_MaxService", results, status, hints)
    
    def meta_MIMEHandler(self):
        """
        Compares the MIME type of the GetCapabilities file with the Entry in the service settings
        (`settings/*.xml`) and with the entry in the GetCapabilities document.
        
        Part of `settings/wms.xml`:

        .. code-block:: xml

            <MIME>application/vnd.ogc.wms_xml</MIME>
            <MIME>application/vnd.ogc.gml</MIME>
        
        Process:

            * parse MIME types from service settings
            * read MIME entry in GetCapabilities document
            * read Headerinformation from GetCapabilities file
            * compare, if equal :ref:`rili-capa-01` fulfilled.

        .. seealso::

            * :ref:`rili-capa-01`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        
        status = False
        hints = "CAPA-01"
        
        # Was sagen die Einstellungen?
        mime = settings = dict2list(self.service_settings_version.MIME)
        
        # Aus der GC-Datei: Format muss nicht angegeben werden, deshalb wird in den 
        # settings nachgeschaut
        try:
            if self.ows_common: 
                for op in self.gc_xmlroot.OperationsMetadata.Operation:                    
                    if op.name == "GetCapabilities":                                       
                        for param in op.Parameter:
                            if isinstance(param, dict):
                                if param.name == "AcceptFormats":
                                    # MIME aus GetCapabilites XML Datei
                                    mime = _ns(param.Value)
                     
                                
            else:
                mime = _ns(self.gc_xmlroot.Capability.Request.GetCapabilities.Format)
                
        except KeyError:
            # Fallback auf settings
            mime = settings
        
        mime = _ns(mime)
        settings = _ns(settings)
        
        if isinstance(settings, list):
            settings = [_ns(s) for s in settings]
        else:
            settings = [settings]
        
        # Bei mime als Liste:
        if isinstance(mime, list):
            mime = [_ns(m) for m in mime]
        else:
            mime = [mime]
        # Beginn der Überprüfung
        try:
            header = self.gc_file_info.gettype()
            status = (header in mime) and (header in settings)
            service = self.service
            mt = header
            results = "%(service)s: %(header)s (file-header) - %(mime)s (capabilities) - %(settings)s (settings)" % locals()
        except (AttributeError, TypeError), e:
            results = "Could not determine header type: " + str(e)
            mt = str(e)
        results = "%s Version %s: %s" %(self.service, self.version, results)
        self.setResultsOverview("CAPA-01", status, results, data={'mime_type':mt})
        return ResponseDict('meta_MIMEHandler', results, status, hints)
    
    def meta_ServiceMeta(self):
        """
        Checks for self-explanatory (Metadata) XML Elements in GetCapabilites document:

        For service types that doesn't support OWS Common Specification:

        * Service
            * Name
            * Title
            * Abstract
            * Fees
            * AccessConstraints
            * OnlineResource
                * Href
            * ContactInformation (not checked for WFS 1.0.0)
            * ContactOrganization (not checked for WFS 1.0.0)
            * ContactElectronicMailAddress (not checked for WFS 1.0.0)

        For service types that support OWS Common Specification:

        * ServiceProvider
            * ProviderName
            * ServiceContact
                * ContactInfo
                    * ElectronicMailAddress

        * ServiceIdentification
            * AccessConstraints
            * Title
            * Abstract
            * Fees

        For WCS 1.0.0

        * Service
            * Fees
            * AccessConstraints
            * Label
            * Description
            * ResponsibleParty
                * Organisationname
                * Contactinfo
                    * OnlineResource
                    * Address
                        * ElectronicMailAddress

        Process:

            * read Elements from GetCapabilities document
            * if all XML Elements found, :ref:`rili-capa-02` fulfilled.

        .. note::

            The methods :py:meth:`wms_ServiceMeta` and :py:meth:`wfs_ServiceMeta` use the same concept to check
            service type dependant Metadata.

        .. seealso::

            * :py:meth:`wms_ServiceMeta`
            * :py:meth:`wfs_ServiceMeta`
            * :ref:`rili-capa-02`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        lengths = []
        not_found = []
        status = False
        support_selfdecription = self.service in ("WMS", "WFS", "WCS", "CSW", "WMTS")
        msg = None
        data = {
            'descr':None
        }

        def checkEmpty(s, v):
            try:
                s = _ns(s[v])
                if " " == s:
                    return False
                if len(s) >= 1:
                    return True
            except KeyError:
                return False

        if support_selfdecription:
            if self.service.upper() == 'WCS' and self.version == '1.0.0':
                if self.gc_xmlroot.has_key('Service'):
                    if self.gc_xmlroot.Service.has_key('responsibleParty'):
                        S = self.gc_xmlroot.Service.responsibleParty
                        if not S.has_key('organisationName') or not checkEmpty(S, 'organisationName'):
                            not_found.append("'organisationName'")
                        if S.has_key('contactInfo'):
                            if S.contactInfo.has_key('address'):
                                #print S.contactInfo.electronicMailAddress
                                if not S.contactInfo.address.has_key('electronicMailAddress') or not checkEmpty(S.contactInfo.address, 'electronicMailAddress'):
                                    not_found.append("'electronicMailAddress'")

                            else:
                                not_found.append("'address'")
                            if not (S.contactInfo.has_key('onlineResource') or checkEmpty(S.contactInfo, 'onlineResource')):
                                not_found.append("'onlineResource'")
                        else:
                            not_found.append("'contactInfo'")
                    else:
                        not_found.append("'responsibleParty'")

                    if not self.gc_xmlroot.Service.has_key('fees') or not checkEmpty(self.gc_xmlroot.Service, 'fees'):
                        not_found.append("'fees'")
                    if not self.gc_xmlroot.Service.has_key('accessConstraints') or not checkEmpty(self.gc_xmlroot.Service, 'accessConstraints'):
                        not_found.append("'accessConstraints'")
                    if not self.gc_xmlroot.Service.has_key('label') or not checkEmpty(self.gc_xmlroot.Service, 'label'):
                        not_found.append("'label'")
                    if not self.gc_xmlroot.Service.has_key('description') or not checkEmpty(self.gc_xmlroot.Service, 'description'):
                        not_found.append("'description'")
                else:
                    not_found.append("'Service'")

            else:
                if self.ows_common:
                    if self.gc_xmlroot.has_key('ServiceProvider'):
                        SP = self.gc_xmlroot.ServiceProvider
                        if not SP.has_key('ProviderName') or not checkEmpty(SP, 'ProviderName'): not_found.append("'ProviderName'")
                        if SP.has_key('ServiceContact'):
                            if SP.ServiceContact.has_key('ContactInfo'):
                                if SP.ServiceContact.ContactInfo.Address:
                                    if not SP.ServiceContact.ContactInfo.Address.has_key('ElectronicMailAddress') or not checkEmpty(SP.ServiceContact.ContactInfo.Address, 'ElectronicMailAddress'):
                                        not_found.append("'ElectronicMailAddress'")
                                else:
                                    not_found.append("'ElectronicMailAddress'")
                            else:
                                not_found.append("'ElectronicMailAddress'")
                        else:
                            not_found.append("'ElectronicMailAddress'")
                    else:
                        not_found.append("'ServiceProvider'")

                    if self.gc_xmlroot.has_key('ServiceIdentification'):
                        SI = self.gc_xmlroot.ServiceIdentification
                        if not SI.has_key('AccessConstraints') or not checkEmpty(SI, 'AccessConstraints'):
                            not_found.append("'AccessConstraints'")
                        if not SI.has_key('Title') or not checkEmpty(SI, 'Title'):
                            not_found.append("'Title'")
                        if not SI.has_key('Abstract') or not checkEmpty(SI, 'Abstract'):
                            not_found.append("'Abstract'")
                        if not SI.has_key('Fees') or not checkEmpty(SI, 'Fees'):
                            not_found.append("'Fees'")
                    else:
                        not_found.append("'ServiceIdentification'")

                else:
                    if self.gc_xmlroot.has_key('Service'):
                        S = self.gc_xmlroot.Service
                        if not S.has_key('Name') or not checkEmpty(S, 'Name'): not_found.append("'Name'")
                        if not S.has_key('Title') or not checkEmpty(S, 'Title'): not_found.append("'Title'")
                        if not S.has_key('Abstract') or not checkEmpty(S, 'Abstract'): not_found.append("'Abstract'")
                        if not S.has_key('Fees') or not checkEmpty(S, 'Fees'): not_found.append("'Fees'")
                        if not S.has_key('AccessConstraints') or not checkEmpty(S, 'AccessConstraints'): not_found.append("'AccessConstraints'")
                        if S.has_key('OnlineResource'):
                           if S.OnlineResource.has_key('href'):
                               if not checkEmpty(S.OnlineResource, 'href'):
                                   not_found.append("'OnlineResource'")
                        else:
                           not_found.append("'OnlineResource'")
                        if not self.service == "WFS" and self.version == "1.0.0":
                            if not S.has_key('ContactInformation') or not checkEmpty(S, 'ContactInformation'): not_found.append("'ContactInformation'")
                            if not S.has_key('ContactOrganization') or not checkEmpty(S, 'ContactOrganization'): not_found.append("'ContactOrganization'")
                            if not S.has_key('ContactElectronicMailAddress') or not checkEmpty(S, 'ContactElectronicMailAddress'): not_found.append("'ContactElectronicMailAddress'")

                    else:
                        not_found.append("'Service'")

        else:
            msg = "No self-description for Service %s found" %(self.service)
            data['descr'] = msg
            self.setResultsOverview("CAPA-02", status, msg, data=data)
            self.missing_capa.extend(msg)
            return ResponseDict('meta_ServiceMeta', msg, status, "CAPA-02")

        status = not bool(len(not_found))
        if len(not_found):
            msg = "Missing Elements: %s. Must be present in GetCapabilites." % (', '.join(not_found))
        else:
            msg = "Found all Service Independant Elements."

        if self.service.lower() == 'wms':
            self.missing_capa.extend(not_found)
        else:
            self.setResultsOverview("CAPA-02", status, msg, data={'descr':', '.join(not_found)})
        return ResponseDict('meta_ServiceMeta', msg, status, "CAPA-02")

    def meta_ServiceOperations(self):
        """
        Checks an GetCapabilities document for service type dependent operations (defined in `settings/*.xml`). This
        is a further indication if the service is OGC conform. All mandatory operations must be supported.
        
        Part of `settings/wms.xml`:

        .. code-block:: xml

            <Operations>
                <GetMap>
                    <Format mime="image/png" />
                    <Format mime="image/jpeg" />
                </GetMap>
                <GetCapabilities>
                    <Encoding>UTF-8</Encoding>
                    <WayToServiceTypeNode>WMS_Capabilities.Service.Name</WayToServiceTypeNode>
                    <WayToServiceTypeNode>Capabilities.ServiceIdentification.ServiceType</WayToServiceTypeNode>
                    <WayToServiceTypeNode>WMT_MS_Capabilities.Service.Name</WayToServiceTypeNode>
                </GetCapabilities>
                <GetFeatureInfo>
                    <Encoding>UTF-8</Encoding>
                    <MIME>text/xml</MIME>
                </GetFeatureInfo>
            </Operations>
            
        In addition to the mandatory operations, some more operation dependent settings can take place here (i.e.
        supported Formats for a `GetMap` Request, encoding of GetCapabilities document, `WayToServiceTypeNode` used in
        :py:meth:`base_ServiceHandler`). These settings are version independent.

        .. seealso::

            * :ref:`rili-wms-09`
            * :ref:`rili-wfs-01` and :ref:`rili-wfs-02`
            * :ref:`rili-wcs-01`
            * :ref:`rili-wmts-01`
            * :ref:`rili-csw-01`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        status = True
        hints = "%s-01" %(self.service)
        if self.ows_common:
            #OWS_Common Workaround 
            service_ops = _filterkey(self.gc_xmlroot.OperationsMetadata.Operation, 
                                 'name', 
                                 True)
        else:
            service_ops = _ns(self.gc_xmlroot.Capability.Request.keys())
        
        # Einlesen der settings/<Dienstname>.xml
        settings = _ns(self.service_settings.Operations.keys())
        
        msg = "All OGC %s operations supported" %self.service
        
        unsupported_ops = []

        for operation in settings:
            if _ns(operation) not in service_ops:
                status = False
                msg = "Not all OGC %s operations supported: " %self.service
                unsupported_ops.append(_ns(operation))
        msg += ', '.join(unsupported_ops)

        unsupported_ops_str =  ', '.join(unsupported_ops)

        if self.service == "WMS":
            self.setResultsOverview("WMS-09", status, msg)
        
        elif self.service == "WFS":
            self.setResultsOverview("WFS-02", status, msg, data={'operations':unsupported_ops_str})
            
        else:
            # Default zu Richtline <Dienstname>-01
            self.setResultsOverview("%s-01" %(self.service), status, msg)
            if DEBUG: print "Status %s-01: %s" %(self.service, status)
        
        """    
        elif self.service == "WCS":
            self.setResultsOverview("WCS-01", status, msg)
        
        elif self.service == "CSW":
            self.setResultsOverview("CSW-01", status, msg)
        """
        return ResponseDict('meta_ServiceOperations', msg, status, hints)

    def xml_DefinitionHandler(self):
        """
        Gets the XML systemID-Element (`DTD` or `XSD`, if none is found, `DTD` is used) and call :py:meth:`xml_Validate`.

        .. deprecated:: 1.0
            Deactivated in Workflow, too slow for stateless

        .. note::

            This method is deactivated in Workflow, too slow for stateless.

        Process:

            1. Analyze of Doctypes in ``tree``.
            2. Getting the ``SystemID``.
            3. If no ``XSD`` or ``DTD`` referenced in the GetCapabilities document, will assume ``DTD``
            4. Call of :py:meth:`xml_Validate <ows_checker._checker.OWSCheck.xml_Validate>`
            
        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        #if DEBUG: print "XML-Version: ", self.tree.version
        #if DEBUG: print "XML-Encoding: ", self.tree.encoding
        #if DEBUG: print self.tree.nodeType #9 = DOCUMENT_NODE
        #if DEBUG: print "Namespaces: ", self.tree.namespaceURI
        #if DEBUG: print "DOCTYPE: ", self.tree.doctype
        #if DEBUG: print "DTD: ", self.tree.doctype.systemId
        
        if self.tree.doctype is None:
            d = self.xml_Validate(tree=self.tree, validate_with='XSD')
        else:
            systemID = str(self.tree.doctype.systemId).lower()
            if '.xsd' in systemID:
                d = self.xml_Validate(tree=self.tree, validate_with='XSD')
            elif '.dtd' in systemID:
                d = self.xml_Validate(tree=self.tree, validate_with='DTD')
            else:
                d = ResponseDict(checker='xml_DefinitionHandler', 
                                 results="No DTD or XSD found", 
                                 status=False) 
            
            d.results.insert(0, systemID)
            
        return d
    
    def xml_Validate(self, tree, validate_with):
        """
        Redirect to :py:meth:`xml_DTD <ows_checker._checker.OWSCheck.xml_DTD>` or
        :py:meth:`xml_XSD <ows_checker._checker.OWSCheck.xml_XSD>`.

        :param object tree: `tree` to validate
        :param string validate_with: `DTD` or `XSD`
        """
        if validate_with == 'DTD':    return self.xml_DTD(tree) 
        elif validate_with == 'XSD':  return self.xml_XSD(tree)
        else: raise ValueError("Parameter validate_with doesn't support the value '%s'"%validate_with)
        
    def xml_DTD(self, tree):
        """
        Validates a `tree` against a (first try) remote OGC DTD Scheme or a local copy of them (second try) with
        :py:func:`lxml.etree._Validator.validate`.

        Both locations are defined in `settings/*.xml`:

        .. code-block:: xml

            <Version num="1.1.1">
                ...
                <Schema>http://schemas.opengis.net/wms/1.1.1/WMS_MS_Capabilities.dtd</Schema>
                <Schema_local>schemas/wms_1_1_1.dtd</Schema_local>
                ...
            </Version>
            <Version num="1.3.0">
                ...
                <Schema>http://schemas.opengis.net/wms/1.3.0/capabilities_1_3_0.xsd</Schema>
                <Schema_local>schemas/wms_1_3_0.xsd</Schema_local>
                ...
            </Version>

        `<Schema_local>` are located in `settings/schemas/*`.

        .. note::

            A workaround accepts Validation exceptions for the Element `<VendorSpecificCapabilities>`, see
            http://codespeak.net/lxml/api.html#error-handling-on-exceptions for more informations.

        .. seealso::

            * :py:meth:`xml_XSD`
        
        :param object tree: tree to Validate
        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        dtd_url = _ns(self.service_settings_version.Schema)
        hints = ['-']
        results = [dtd_url]
        try:
            dtd_file = URL2File(dtd_url)
        except urllib2.URLError:
            # Fallback to local copy of DTD-File
            dtd_file = open(self.cwd + self.service_settings_version.Schema_local)
        dtd = etree.DTD(dtd_file)
        root = etree.XML(tree.toxml())
        status = dtd.validate(root)
        results.append(str(dtd.error_log))
        
        dtd_file.close()
        
        # Workaround
        if "VendorSpecificCapabilities" in str(dtd.error_log):
            hints = "No declaration for element VendorSpecificCapabilities (see http://codespeak.net/lxml/api.html#error-handling-on-exceptions)"
            status = True
        return ResponseDict('xml_DTD', results, status, hints)
    
    def xml_XSD(self, tree):
        """
        See :py:meth:`xml_DTD`.

        .. note::

            If OWS Commom Implementation Specification supported, XSD validation will be skipped.

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        hints = None
        results = []
        status = False
        if self.ows_common:
            return ResponseDict('xml_XSD', "OWS Commom supported, XSD validation skipped", False, hints)
        
        try:
            # OWS (Offiziell)
            schema_url = _ns(self.service_settings_version.Schema)
            xsd_file = URL2File(schema_url)
            
        except urllib2.URLError:
            # Lokale Kopie
            schema_url = self.cwd + _ns(self.service_settings_version.Schema_local)
            xsd_file = open(schema_url)
        
        results.append(schema_url)
        
        try:
            xsd = etree.XMLSchema(file=xsd_file)
            root = etree.XML(tree.toxml())
            status = xsd.validate(root)
            results.append(str(xsd.error_log))
        except etree.XMLSyntaxError, e:
            # Passiert oft, falls das doctype nicht existiert und es trotzdem dtd ist
            results.append("Workaround xml_XSD:"+str(e))
            try:
                dtd_workaround = self.validateXML(tree, 'DTD')
                results.append(dtd_workaround.results)
                status = dtd_workaround.status
            except Exception, e:
                results.append(str(e)) 
        except etree.XMLSchemaParseError, e:
            results.append(str(e))
            status = False
            
        xsd_file.close()
        return ResponseDict('xml_XSD', results, status, hints)

    def xml_Encoding(self, tree, name="GetCapabilities", ignore_rili=False):
        """
        Compares the encoding of ``tree`` with given encoding (from `settings/*.xml`). If no encoding can be found
        in ``tree``, the result ``No encoding detected`` will be returned.

        Part from `settings/wms.xml`:

            .. code-block:: xml

                <XML>
                    <Encoding>UTF-8</Encoding>
                </XML>
            
        .. seealso::

            * :ref:`rili-allg-04`

        :param object tree: XML-Tree to check
        :param str name: Label of what is checked here. Default ``GetCapabilities``.
        :param bool ignore_rili: If ``True``, :ref:`rili-allg-04` won't be set here. Default ``False``.
        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        results = []
        #print dir(tree)
        #print "Parent", tree.parentNode
        #print "Encoding", tree.encoding
        #print name
        #if tree.encoding is None:
        #    print tree.toxml()
        try:
            status = tree.encoding.lower() == _ns(self.service_settings.XML.Encoding).lower()
            results.append("%s: Found Encoding: %s" % (name, tree.encoding))
        except AttributeError, e:
            status = False
            results.append("No encoding of %s document detected (%s)" % (name, e))

        if name == "Service Exception":
            self.setResultsOverview("EXCE-02", status, results)
        r = self.getRiliResults("ALLG-04")
        status = all([r.status, status])
        results = r.results + results
        if not ignore_rili:
            self.setResultsOverview("ALLG-04", status, results)
        return ResponseDict('xml_Encoding', results, status)
    
    def wms_ServiceMeta(self):
        """
        Extends the Methods :py:meth:`meta_ServiceMeta <ows_checker._checker.OWSCheck.meta_ServiceMeta>` with
        following entries:

        * ``VendorSpecificCapabilities``
        * ``Service``
            * ``AccessConstraints``
            * ``OnlineResource``
            * ``ContactInformation``
                * ``ContactPersonPrimary``
                    * ``ContactOrganization``
                * ``ContactElectronicMailAddress``

        For :ref:`rili-wms-08`, following entries will be added:

        * ``Capability.VendorSpecificCapabilities.ExternalServiceMetadata`` (WMS 1.1.1)
        * ``Capability._ExtendedCapabilities.ExternalServiceMetadata`` (WMS 1.3.0)

        .. note::

            * Ignores results from :ref:`rili-capa-02`.

        .. seealso ::

            * :ref:`rili-wms-04` through `lookup` in GetCapabilities document
            * :ref:`rili-wms-08` through `lookup` in GetCapabilities document
            * :py:meth:`OWSCheck.meta_ServiceMeta <ows_checker._checker.OWSCheck.meta_ServiceMeta>`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        lengths = []
        status = False
        not_found = []
        descr = ""
        try:
            S = self.gc_xmlroot.Service
        except KeyError, e:
            descr = e
            not_found.append(str(e))
        #try:
         #   lengths.append(len(_ns(S.AccessConstraints)))
        #except KeyError, e:
         #   descr = e
          #  not_found.append(str(e))
        try:
            lengths.append(len(S.OnlineResource.href))
        except KeyError, e:
            descr = e
            not_found.append(str(e))

        try:
            lengths.append(len(S.ContactInformation))
            if len(S.ContactInformation) < 2:
                not_found.append("'ContactInformation'")
            try:
                lengths.append(len(S.ContactInformation.ContactPersonPrimary.ContactOrganization))
                if len(S.ContactInformation.ContactPersonPrimary.ContactOrganization) < 2:
                    not_found.append("'ContactOrganization'")
            except (KeyError, AttributeError), e:
                descr = e
                not_found.append("'ContactOrganization'")
            try:
                lengths.append(len(S.ContactInformation.ContactElectronicMailAddress))
                if len(S.ContactInformation.ContactElectronicMailAddress) < 2:
                    not_found.append("'ContactElectronicMailAddress'")
            except (KeyError, AttributeError), e:
                descr = e
                not_found.append('ContactElectronicMailAddress')
        except KeyError, e:
            descr = e
            not_found.append(str(e))


        if len(not_found):
            #msg = "Missing Elements: %s. Must be present in GetCapabilites." % (', '.join(not_found))
            self.missing_capa.extend(not_found)

        else:
            msg = "All Elements found."

        status = not bool(len(self.missing_capa))

        self.setResultsOverview("WMS-04", status, msg=None, data={'descr': ', '.join(self.missing_capa)})
        self.setResultsOverview("CAPA-02", status, msg=None, data={'descr': ', '.join(self.missing_capa)})

        status_vsc = False

        if self.gc_by_versions.has_key('1.1.1'):
            # WMS Version 1.1.1
            if self.gc_xmlroot.Capability.has_key('VendorSpecificCapabilities'):
                if DEBUG: print self.gc_xmlroot.Capability.VendorSpecificCapabilities
                if self.gc_xmlroot.Capability.VendorSpecificCapabilities.has_key('ExternalServiceMetadata'):
                    status_vsc = True
                    msg = "Found VendorSpecificCapabilities.ExternalServiceMetadata"

        elif self.gc_by_versions.has_key('1.3.0'):
            # WMS Version 1.3.0
            if self.gc_by_versions['1.3.0'].Capability.has_key('ExtendedCapabilities'):
                if DEBUG: print self.gc_xmlroot.ExtendedCapabilities
                if self.gc_xmlroot.Capability.ExtendedCapabilities.has_key('ExternalServiceMetadata'):
                    status_vsc = True
                    msg = "Found ExtendedCapabilities.ExternalServiceMetadata"

        if not status_vsc:
            msg = "No Vendor Specific Capabilities found"

        self.setResultsOverview("WMS-08", status_vsc, msg)
        return ResponseDict("wms_ServiceMeta", msg, status)
    
    def wms_getsublayer(self, l0, layers):
        """
        Recursive function to search the hole layerstructur
        """
        a = 0
        b = []
        if isinstance(l0, dict):
            if l0.has_key('Layer'):
                if isinstance(l0.Layer, dict):
                    layers.append(l0.Layer)
                    a += 1
                if isinstance(l0.Layer, list):
                    for x in range(len(l0.Layer)):
                        if isinstance(l0.Layer[x], dict):
                            layers.append(l0.Layer[x])
                            b.append(x)
            #else:
             #   l0.Layer = []
              #  layers = l0.Layer

        else:
            pass

        if a > 0:
            self.wms_getsublayer(l0.Layer, layers)

        if len(b) > 0:
            for x in range(len(b)):
                self.wms_getsublayer(l0.Layer[b[x]], layers)
        return layers, l0

    def wms_getLayers(self, version=None):
        """
        Get a list of WMS Layers listed in GetCapabilites on ``Capability.Layer``.

        :returns: List of WMS Layers
        """
        layers = []
        if version:
            try:
                l0 = self.gc_by_versions[version]['Capability']['Layer']
            except KeyError:
                return layers

        else:
            l0 = self.gc_xmlroot.Capability.Layer
        layers = []
        layers, i0 = self.wms_getsublayer(l0,layers)

            # Try Root Layer too
        layers.append(l0)
        return layers
    
    def wms_LegendURL(self):
        """
        The Mehtod :py:meth:`wms_LegendURL <ows_checker._checker.OWSCheck.wms_LegendURL>` iterates through all Layer
        elements given by :py:meth:`wms_getLayers <ows_checker._checker.OWSCheck.wms_getLayers>` (*) and checks the
        appearance of a ``LegendURL`` entry. For each ``LegendURL``, the Header of the URL (i.e. ``image/png``) will
        be checked.

            (*) in Detail, every Layer given except the Root ``Layer`` entry:

            .. code-block:: xml

                <Capability>
                    <Layer> # ignore this
                        <SRS>...
                        <SRS>...
                        <Layer> # use this
                            <MetadataURL>...
                            <Style>...
                        <Layer> # and this
                            <MetadataURL>...
                            <Style>...
            
        Process for every Sublayer:

            1. Getting the ``Style``-Name (often it's ``default``)
            2. Getting the ``URL`` from ``Style.LegendURL.OnlineResource.href`` defined in GetCapabilities document
            3. Getting the expected Mime-Type from ``Style.LegendURL.Format`` defined in GetCapabilities document
               (not defined in :ref:`rili`)
            4. Calling :py:meth:`checkFileHeader <ows_checker._checker.OWSCheck.checkFileHeader>` with URL from Legend
               and expected Format
            5. Getting ``MetadataURL``-Types. If compatible to `GM03` (``type="GM03"``), :ref:`rili-wms-07` and
               :ref:`rili-meta-01` (commented out) fulfilled

        Todo:

            * Check Mime-Types according to :ref:`rili` and not what is defined in GetCapabilities document

        .. note::

            * Check against :ref:`rili-wms-06` ist not `perfect`, see Documentation in
              :py:meth:`wms_LegendURL <ows_checker._checker.OWSCheck.wms_LegendURL>`
            * the :py:class:`Checker <ows_checker._checker.OWSCheck>`'s Attribute ``layers`` is set here

        .. seealso::

            * :ref:`rili-wms-06`
            * :ref:`rili-wms-07` through MetadataURL-type `GM03`
            * :ref:`rili-meta-01` throught :ref:`rili-wms-07` (commented out)


        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        hints = "WMS-06"
        gc_layer = self.wms_getLayers()
        layers = {}
        has_legendurl = 0
        legends_results = []
        legends_status = []
        formats_found = []
        formats_not_found = []
        status = False
        number_layers = 0
        number_legend_url = 0
        """
        Falls 1 Layer vorhanden
        """
        if not isinstance(gc_layer, list):
            gc_layer = [gc_layer]

        a = 0
        for layer in gc_layer:
            a += 1
            #Comment the next two lines out to check the "root" layer
            if a == len(gc_layer):
                continue

            if not isinstance(layer, dict):
                continue

            #Comment the next two lines out to check the "container" layer
            if layer.has_key('Layer') and not layer.has_key('Name'):
                continue

            if not layer.has_key('Name'):
                name = "unnamed"
            else:
                name = _ns(layer.Name)

            number_layers += 1
            if layer.has_key('Style'):
                # layer_style_name i.d.R. default
                try:
                    layer_style_name = [_ns(style.Name) for style in _ns(layer.Style)]
                except AttributeError, e:
                    layer_style_name = ['default']
                    
                except KeyError, e:
                    msg = "No named Style found in layer '%s'" %name
                    self.setResultsOverview("WMS-06", status, msg)
                    return ResponseDict("wms_LegendURL", msg, status, hints)

                layers.update({name:layer_style_name})
                if not isinstance(layer.Style, dict):
                    continue
                
                for key in layer.Style.keys():
                    #if DEBUG: print style, layer.Style[key]
                    #if DEBUG: print layer_style_name
                    if key == 'LegendURL':
                        number_legend_url += 1
                        legendurl = _ns(layer.Style[key].OnlineResource.href)
                        #if DEBUG: print legendurl
                        legend_format = _ns(layer.Style[key].Format)
                        if "; mode=" in legend_format:
                            legend_format = legend_format.split("; mode=")[0]
                        if "; mode=" in legendurl:
                            legendurl = legendurl.replace("; mode=", "")
                        has_legendurl += 1
                        # Überprüft das tatsächiche Vorhandensein der Legende

                        formats_found.append(legend_format)

                        """
                        try:
                            status, results = self.checkFileHeader(legend_format, legendurl)
                            if not status:
                                legends_results.append("%s %s: %s=%s" %(status, name, results, legend_format))
                            legends_status.append(status)
                        except urllib2.HTTPError, e:
                            legends_results.append("URL %s not found: %s" %(legendurl, e.msg))
                            legends_status.append(False)
                        except urllib2.URLError, e:
                            legends_status.append(False)
                            legends_results.append("Failed getting %s not found: %s" %(legendurl, e.message))
                        """
            else:
                legends_results.append("No element Style in layer %s found" %name)
                legends_status.append(False)

        self.layers = layers
        
        results = ["%d of %d layers got a LegendURL" %(number_legend_url,number_layers)]
        for r in legends_results:
            results.append(r)

        formats_found = unify(formats_found)
        results.append('Found Formats: %s' % ', '.join(formats_found))

        #if len(legends_results):
            #status = all(legends_status) and len(formats_found) > 0
        #else:
            #status = False

        if number_legend_url == number_layers and len(formats_found) > 0:
            status = True
        else:
            status = False

        self.setResultsOverview("WMS-06", status, results)
        return ResponseDict("wms_LegendURL", results, status, hints)

    def wms_MetaDataURL(self):
        metadata_url_status = []
        metadata_urls = []
        gc_layer_v3 = self.wms_getLayers(version='1.3.0')
        #gc_layer = self.wms_getLayers()

        a = 0
        for layer in gc_layer_v3:
            # META
            a += 1
            #Comment the next two lines out to check the "root" layer
            if a == len(gc_layer_v3):
                continue

            if not isinstance(layer, dict):
                continue
            if not layer.has_key('Name'):
                name = "unnamed"
            else:
                name = _ns(layer.Name)

            #Comment the next two lines out to check the "container" layer
            if layer.has_key('Layer') and not layer.has_key('Name'):
                continue

            try:
                #meta_status = False
                metadata_url = _ns(layer.MetadataURL.OnlineResource.href)
                msg = "MetadataURL in layer '%s' found, but no type."%name
                _type = _ns(layer.MetadataURL.type)
                msg = "MetadataURL in layer '%s' found, but with type '%s'."%(name, _type)
                if ('GM03' in _type.upper()):
                    msg = "Found MetadataURL in layer '%s' with type '%s'"%(name, _type)
                    meta_status = True
                    metadata_url_status.append(meta_status)
                #    if DEBUG: print msg
                else:
                    metadata_url_status.append(False)
                metadata_urls.append(msg)

            except KeyError, e:
                metadata_urls.append("No MetadataURL in layer '%s' found" %name)
                metadata_url_status.append(False)

        if not len(gc_layer_v3):
            metadata_url_status.append(False)
            metadata_urls.append("WMS Version 1.3.0 not supported")

        if len(metadata_url_status):
            status = all(metadata_url_status)
        else:
            status = False

        if len(gc_layer_v3):
            self.setResultsOverview("WMS-07", status, metadata_urls)

        return ResponseDict("wms_MetaDataURL", metadata_urls, status)
    
    def wms_ImageFormats(self):
        """
        The Method :py:meth:`wms_ImageFormats <ows_checker._checker.OWSCheck.wms_ImageFormats>` compares the (from the
        GetCapabilities document) given Mime-Types with the Mime-Types defined in `settings/wms.xml`.

        See :py:meth:`meta_ServiceOperations <ows_checker._checker.OWSCheck.meta_ServiceOperations>` for an example.

        No ``GetMap`` Request is done here, this is done in
        :py:meth:`wms_GetMap <ows_checker._checker.OWSCheck.wms_GetMap>`.

        Process:

            1. Getting the ``GetMap`` URL from GetCapabilities document at
               ``Capability.Request.GetMap.DCPType.HTTP.Get.OnlineResource.href``
            2. Verify the URL with :py:meth:`base_URLSyntax <ows_checker._checker.OWSCheck.base_URLSyntax>`
            3. Getting the supported Formats from GetCapabilites document and from `settings/wms.xml`
            4. Counting supported Formats
            5. If all Formats found, :ref:`rili-wms-02` fulfilled

        .. seealso::

            * :ref:`rili-wms-02` throught lookup in GetCapabilities document

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """

        GetMap = self.gc_xmlroot.Capability.Request.GetMap
        get_map_url = _ns(GetMap.DCPType.HTTP.Get.OnlineResource.href)
        formats = [_ns(f) for f in GetMap.Format]

        minimum = 2
        supported = 0
        hints = ""
        results = []

        checkURL = self.base_URLSyntax(get_map_url)

        min_formats = [_ns(f.mime) for f in self.service_settings.Operations.GetMap.Format]
        
        if checkURL['status']:
            for format in formats:
                # Iterate through string and not list:
                for minformat in min_formats:
                    if _ns(format) in minformat:
                        supported += 1
                    elif minformat in _ns(format):
                        supported += 1
                    
            status = bool(supported >= minimum)
            if status:
                results.append("All Image Formats supported")
            else:
                results.append("Only %(supported)d of %(minimum)d Image Formats supported." % locals())
            results += formats
            self.setResultsOverview("WMS-02", status, formats)
            return ResponseDict('wms_ImageFormats', results, status, hints)
        
        else:
            checkURL['checker'] = 'base_URLSyntax @ wms_ImageFormats'
            return checkURL
        
    def wms_CRS(self):
        """
        Compares the CRS (read from :py:meth:`CRSHandler <ows_checker._checker.OWSCheck.CRSHandler>`) with the
        entries in the GetCapabilities document.

        Process:

            * Getting `CRS`/`SRS` from Root Layer
            * Getting `CRS`/`SRS` from Sublayers (only first Level)
            * Calling :py:meth:`checkCRS <ows_checker._checker.OWSCheck.checkCRS>`


        .. seealso::

            * :ref:`rili-crs-01`
            * :ref:`rili-crs-02`
            * :ref:`rili-crs-03`
            * :ref:`rili-crs-04` (3D)
            * :ref:`rili-crs-05`
            * :ref:`rili-crs-06`
            * :ref:`rili-crs-07` (3D)
            * :ref:`rili-crs-08` (3D)

        Todo:

            * Support Subsublayers

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        srs_all = []
        status = True
                
        """
        Liest alle im GC-XML verfügbaren Koordinatensysteme in 
        die Liste layer ein.
        """

        gc_layer = self.wms_getLayers()

        def getCRS4Layer(layer):
            """
            Supports ``CRS`` and ``SRS``.
            """
            if hasattr(layer, 'has_key'):
                if layer.has_key('SRS'):
                    return _value(layer.SRS)
                elif layer.has_key('CRS'):
                    return _value(layer.CRS)
            if DEBUG: print "getCRS4Layer layer=", layer
            return []
        
        for layer in gc_layer:
            srs_all += getCRS4Layer(layer)
            #if DEBUG: print "layer.has_key", layer, type(layer)
            if not hasattr(layer, 'has_key'):
                continue
            if layer.has_key('Layer'):                
                for sublayer in dict2list(layer.Layer):
                    srs_all += getCRS4Layer(sublayer)
                    
        self.gc_layers = gc_layer
        if DEBUG: print len(self.gc_layers), "Layers:" 
        for lyr in self.gc_layers:
            if DEBUG:
                try:
                    print("  - %s" % _ns(lyr.Name))
                except (AttributeError, KeyError):
                    print lyr, type(lyr)
            
        status, results = self.checkCRS(srs_all)
        return ResponseDict("wms_CRS", results, status)
    
    def wms_GetMap(self):
        """
        .. deprecated:: 1.0
            Deactivated in Workflow, too slow for stateless

        .. note::

            This method is deactivated in Workflow, too slow for stateless.

        Performs a GetMap-Request for every Layer and for every Format by

        * using the ``LAYERS`` Parameter
        * not using the ``LAYERS`` Parameter

        and compares the resulting Headerinformations.

        Process:

            1. Getting the Formats, see :ref:`rili-wms-02`
            2. Iterating through all Formats
            3. Getting all Layers
            4. Iterating through all Layers, see Description of
               :py:meth:`wms_CRS <ows_checker._checker.OWSCheck.wms_CRS>`
            5. Getting BoundingBox-Parameter (SRS, MinX, MaxX, MinY, MaxY)
            6. Construct GetMap Request Parameters
                * with ``LAYERS`` Parameter
                * without ``LAYERS`` Parameter
                * if an error occurs, an Service Exception (in XML) !!!wird erwartet!!!
            7. Expecting an Error on Requests without ``LAYERS`` Parameter, :ref:`rili-wms-03` is then fulfilled.
               Following Message is returned: "Missing LAYERS Parameter raises an exception as <Format>"
            8. If a Element could not be found, a Message "Element not found: <Elementname>" is given

        .. seealso::

            * :ref:`rili-wms-03` through two GetMap Requests

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        status = False
        results = []
        hints = ["CRS-01 bis CRS-08", "WMS-02"]
        
        layer_list = []
        
        for format in _ns(self.service_settings.Operations.GetMap.Format):
            for layer in self.gc_layers:
                if layer.has_key('Layer'):
                      layer_list = dict2list(layer.Layer)    
                else:
                    layer_list = self.gc_layers
                       
            for layer in layer_list:     
                try:                       
                    for lbbox in dict2list(layer.BoundingBox):
                        if lbbox.has_key('SRS'):  
                            bbox_crs = lbbox.SRS
                        else:                     
                            bbox_crs = lbbox.CRS
                        minx, miny, maxx, maxy = _ns(lbbox.minx),_ns(lbbox.miny),_ns(lbbox.maxx),_ns(lbbox.maxy)
                        bbox = "%s,%s,%s,%s" %(minx, miny, maxx, maxy)
                        params = {'request':'GetMap',
                                      'service':'WMS',
                                      'version':self.version,
                                      'bbox':bbox,
                                      'srs':bbox_crs,
                                      'width':100,
                                      'height':100,
                                      'format':_ns(format.mime),
                                      'exception':'text/xml'
                                    }
                        with_layer = {'layers':_ns(layer.Name),
                                      'request':'GetMap',
                                      'service':'WMS',
                                      'version':self.version,
                                      'bbox':bbox,
                                      'srs':bbox_crs,
                                      'width':100,
                                      'height':100,
                                      'format':_ns(format.mime),
                                      'exception':'text/xml'
                                    }
                   
                    request_url =  self.build_kvp_url(self.base_url, with_layer)
                    request_url_no_layer = self.build_kvp_url(self.base_url, params)
                    status, header = self.checkFileHeader(params['format'], request_url)
                    status_no_layer, header_no_layer = self.checkFileHeader(params['format'], request_url_no_layer)
                    version = self.version + ": "
                    if header in self.service_exceptions:
                        self.setResultsOverview("EXCE-01", True, version + header, data={'mime_type':header})
                        self.setResultsOverview("EXCE-02", True, version + "see EXCE-01")
                    
                    if header_no_layer in self.service_exceptions:
                        self.setResultsOverview("EXCE-01", True, version + header, data={'mime_type':header})
                        self.setResultsOverview("EXCE-02", True, version + "see EXCE-01")
                        msg = "Missing LAYERS Parameter raises an exception as %(header_no_layer)s"
                        msg = msg % {'header_no_layer': header_no_layer}
                        self.setResultsOverview("WMS-03", True, version + msg)
                    else:
                        msg = "Missing LAYERS Parameter raises no exception as %(header_no_layer)s"
                        msg = msg % { 'header_no_layer': header_no_layer }
                        self.setResultsOverview("WMS-03", False, version + msg)

                    mime_per_layer = "Layer %(name)s: %(mime)s" % {'name': layer.Name, 'mime': _removeCharsetFromMime(header)}
                    results.append(mime_per_layer)
                    self.setResultsOverview("WMS-02", status, version + mime_per_layer)

                except urllib2.HTTPError:
                    msg =  "Error: %s <> %s" %(params['format'], params['srs'])
                    results.append(msg)
                except urllib2.URLError, e:
                    results.append(str(e.reason))
                                            
                except KeyError, e:
                    msg = "Element not found: %s" %(str(e))
                    results.append(msg)
                    self.setResultsOverview("WMS-03", False, msg)
        
        return ResponseDict("wms_GetMap", results, status)
    
    def wms_SLD(self):
        """
        Check if WMS supports SLD (doesn't matter which version of SLD).

        Looks for XML Element ``Capability.UserDefinedSymbolization.SupportSLD``:

        Example in GetCapabilites document:

        .. code-block:: xml

            <UserDefinedSymbolization SupportSLD="1" UserLayer="0" UserStyle="1" RemoteWFS="0"/>
        
        .. note::

            * Seems to be not supported by GeoServer at the moment
            * Possible solution: Extend the GetMap Request with an SLD parameter pointing to a SLD document and
              then get the SLD Version out of the document

        .. seealso::

            * :ref:`rili-wms-11`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        sld_status = False
        sld_results = []
        # Read from setings/wms.xml
        try:
            v = self.service_settings.Version
            for version in v:
                if version.num == '1.3.0':
                    sld_settings = version.SLD
                    print "Version.SLD", version.SLD
                    break

        except KeyError:
            sld_settings = None

        if sld_settings and self.gc_by_versions.has_key('1.3.0'):
            try:
                schema_locations = self.gc_by_versions['1.3.0'].schemaLocation.value
                print "schemaLocation", schema_locations
                locs = schema_locations.split(" ")
                for sloc in locs:
                    if len(sloc):
                        if sloc in sld_settings:
                            msg = "Found %s" %(sloc)
                            sld_status = True
                            sld_results.append(msg)
                            break

            except KeyError:
                pass

            self.setResultsOverview("SLD-01",sld_status, sld_results)
            self.setResultsOverview("WMS-11", sld_status, sld_results)

        if not sld_status and self.gc_by_versions.has_key('1.3.0'):
            sld_results.append("WMS at Version 1.3.0: No SLD in schemaLocation found.")

        return ResponseDict("wms_SLD", sld_results, sld_status)
    
    def wms_GetFeatureInfoMIME(self):
        """
        Checks, if Format ``text/xml`` is present in ``Capability.Request.GetFeatureInfo.Format``.

        .. seealso::

            * :ref:`rili-wms-10`

        .. note::

            Needs decision, if Format ``gml`` is also a supported XML Format

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        found_formats_in_gc = []
        results = []
        
        #check Formats in GC:
        formats = self.gc_xmlroot.Capability.Request.GetFeatureInfo.Format
        if isinstance(formats, dict):
            formats = [formats,]
        if isinstance(formats, str):
            formats = [formats,]
        for format in formats:
            if DEBUG: print "Checking '%s'" %(format)
            if hasattr(format, 'value'):
                found_formats_in_gc.append('text/xml' in format.value)
            else:
                found_formats_in_gc.append('text/xml' in format)
            # Needs decision
            #found_formats_in_gc.append('gml' in format.value)

        if DEBUG: print "found_formats_in_gc", found_formats_in_gc
        status = any(found_formats_in_gc)
        if status:
            msg = 'Format text/xml found in GetCapabilities'
        else:
            msg = 'Format text/xml not found in GetCapabilities, check Capability.Request.GetFeatureInfo.Format'
        results.append(msg)
        self.setResultsOverview("WMS-10", status, msg)
        return ResponseDict("wms_GetFeatureInfoMIME", results, status)

    def wms_GetFeatureInfo(self):
        """
        Checking ``WMS``-Part of the SSXML, performs a Request for each Feature to check and validates the
        Returned results.

        Process:

            * Checking ``WMS``-Part of given SSXML (if present, else skip this check)
                * Following Elements must be present:
                    * ``GetFeatureInfo.Feature.Params``:
                        * ``REQUEST`` must be set to ``GetFeatureInfo``
                        * ``CRS``
                        * ``FORMAT``
                        * ``WIDTH``
                        * ``HEIGHT``
                        * ``BBOX``
                        * ``QUERY_LAYERS``
                        * ``LAYERS``
                        * ``STYLES``
                        * ``I``
                        * ``J``
                        * ``FEATURE_COUNT``
                        * ``INFO_FORMAT`` must be set to ``text/xml``
                        * ``EXCEPTIONS`` should be set to ``application/vnd.ogc.se_xml`` to return an Exception in XML
            * Performs a Request (Parameters build from ``GetFeatureInfo.Feature.Params``) for each ``Feature`` Element
            * Checks the given Attributes with XPath

        Quick Howto setup your own SSXML:

            * learn the `Syntax of XPath <http://www.w3schools.com/xpath/xpath_syntax.asp>`_
            * open `XPath Tester <http://xpath.online-toolz.com/tools/xpath-editor.php>`_
            * copy and paste the Code of a resulting GetFeatureInfo Request into the XPath Tester
            * Test your XPath Statement with the root-Element until the value is shown in the result textfield only
            * Paste the XPath Statement without the root-Element to the xpath-Attribute in your SSXML file

        Structure of the ``WMS``-Part:

        .. code-block:: xml

            <Layers>
                <Layer status="must">bodenbedeckung</Layer>
                <Layer status="must">gebaeude</Layer>
                <Layer status="optional">gewaesser</Layer>
            </Layers>
            <GetFeatureInfo>
                <Feature>
                    <Params>
                        <REQUEST>GetFeatureInfo</REQUEST>
                        <CRS>EPSG:900913</CRS>
                        <FORMAT>image/png</FORMAT>
                        <WIDTH>984</WIDTH>
                        <HEIGHT>60</HEIGHT>
                        <BBOX>-13042086.162853,3856412.296628,-13041792.35806,3856609.360842</BBOX>
                        <QUERY_LAYERS>TIN</QUERY_LAYERS>
                        <LAYERS>TIN</LAYERS>
                        <STYLES>GroundElevation</STYLES>
                        <I>745</I>
                        <J>0</J>
                        <FEATURE_COUNT>1</FEATURE_COUNT>
                        <INFO_FORMAT>text/xml</INFO_FORMAT>
                        <EXCEPTIONS>application/vnd.ogc.se_xml</EXCEPTIONS>
                    </Params>
                    <Attribute xpath="Features/FeatureInfo/Attributes/Attribute/FieldName[text()='Elevation (Z)']/../Value/text()">13.849</Attribute>
                    <Attribute xpath="Features/FeatureInfo/Attributes/Attribute/FieldName[text()='Slope (Degrees)']/../Value/text()">5</Attribute>
                    <Attribute xpath="Features/FeatureInfo/Attributes/Attribute/FieldName[text()='Aspect']/../Value/text()">359.073</Attribute>
                    <Attribute xpath="Features/FeatureInfo/Attributes/Attribute/FieldName[text()='Intensity']/../Value/text()">218</Attribute>
                </Feature>
                <Feature>
                    ...2nd Feature to check...
                </Feature>
            </GetFeatureInfo>

        .. seealso::

            * :ref:`rili-wms-50`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        results = []
        cfh_status = False
        cfh_status_list = []
        att_check_status = []
        att_check_results = []
        features = []
        status = False
        layers_in_ssxml = []
        found_layers = []
        layer_results = []
        
        if not self.getRiliResults('WMS-10').status:
            results = ['Skipped check for WMS-50 and WMS-51, because WMS-10 failed']
            #self.setResultsOverview("WMS-50", False, results)
            #self.setResultsOverview("WMS-51", False, results)
            return ResponseDict("wms_GetFeatureInfo", results, False)

        if not self.ssurl:
            results = ['No Attributes to check because no SSURL provided']
            #self.setResultsOverview("WMS-50", False, results)
            #self.setResultsOverview("WMS-51", False, results)
            return ResponseDict("wms_GetFeatureInfo", results, False)

        
        def checkAttributes(url, ssxml_att):
            att_failed = []
            ssxml_dict = {}
            if isinstance(ssxml_att, dict):
                ssxml_att = [ssxml_att]
            for attribute in ssxml_att:
                ssxml_dict.update({ attribute.xpath : attribute.value })
            
            
            f = URL2File(url)
            tree = etree.parse(f)
            e = etree.XPathEvaluator(tree)
            root = tree.getroot()
            ns = root.nsmap
            
            if None in ns.keys():
                ns['ogc'] = ns.pop(None)
            
            for xpath, value in ssxml_dict.items():
                # value = Wert, der erwartet wird (steht in ssxml)
                # response_value = Wert, der im Response-XML steht
                # xpath = XPath, der in der ssxml steht
                try:
                    response_value = root.xpath(xpath, namespaces=ns)
                except etree.XPathEvalError, e:
                    att_failed.append("Namespace Error, check your SSXML: %s" %(e))
                    break
                if value in response_value:
                    msg = "Found value %s" %(value)
                    if DEBUG: print msg
                    results.append(msg)
                else:
                    if len(response_value):
                        first_response_value =  response_value[0]
                        msg = "Given value %(value)s not equal to found value %(first_response_value)s" % locals()
                        att_failed.append(msg)
                    else:
                        msg = "No Attribute/Value found in xpath %(xpath)s" % locals()
                        att_failed.append(msg)
                    if DEBUG: print msg

            print "att_failed", att_failed
            #if not len(att_failed):
            #    return att_failed, True
            return att_failed, bool(not len(att_failed))
                        
        
        try:            
            wms = dict2list(self.ssxml.WMS)
            for w in wms:
                if w.has_key('GetFeatureInfo'):
                    features = dict2list(w.GetFeatureInfo.Feature)
                if w.has_key('Layers'):
                    layers_in_ssxml = dict2list(w.Layers.Layer)
              
            for feat in features:
                must_params = ['REQUEST', 'CRS', 'FORMAT', 'WIDTH',
                               'HEIGHT', 'BBOX', 'QUERY_LAYERS',
                               'LAYERS', 'STYLES', 'I', 'J', 
                               'FEATURE_COUNT', 'INFO_FORMAT',
                               'EXCEPTIONS', 'value']
                for param in must_params:
                    a = feat.Params[param]
                for att in feat.Attribute:
                    if isinstance(att, dict):
                        a = att.xpath
                        a = att.value

            ssxml_valid = True
        except KeyError, e:
            ssurl = self.ssurl
            attr = str(e)
            results.append('SSURL %(ssurl)s is not complete, Element or Attribute %(attr)s not found!' % locals())
            self.setResultsOverview("WMS-10", False, results)
            self.setResultsOverview("WMS-50", False, results)
            self.setResultsOverview("WMS-51", False, results)
            return ResponseDict("wms_GetFeatureInfo", results, False)

        if features and ssxml_valid:
            for feat in features:
                i, j, layers = feat.Params.I, feat.Params.J, feat.Params.LAYERS
                results.append('Checking Pos %(i)s,%(j)s @ Layer %(layers)s' % locals())
                x, y = feat.Params.I, feat.Params.J
                
                params = {
                    'REQUEST': feat.Params.REQUEST,
                    'SERVICE': self.service,
                    # Statt X, Y und CRS ist auch
                    # I, J, SRS möglich!!!!!!
                    'I': x,
                    'J': y,
                    'SRS': feat.Params.CRS,
                    'X': x,
                    'Y': y,
                    'CRS': feat.Params.CRS,
                    'STYLES': feat.Params.STYLES,
                    'FEATURE_COUNT': feat.Params.FEATURE_COUNT,
                    'VERSION': self.version,
                    'EXCEPTION': 'application/vnd.ogc.se_xml',
                    'LAYERS': feat.Params.LAYERS,
                    'QUERY_LAYERS': feat.Params.QUERY_LAYERS,
                    'WIDTH':feat.Params.WIDTH,
                    'HEIGHT': feat.Params.HEIGHT,
                    'BBOX': feat.Params.BBOX,
                    'INFO_FORMAT': feat.Params.INFO_FORMAT
                }
                
                request_url =  self.build_kvp_url(self.base_url, params)
                cfh_status, header = self.checkFileHeader(params['INFO_FORMAT'], request_url)
                if DEBUG:
                    print "Checking URL %s" % request_url
                    print "Got Header %s, Expected Header %s = %s" %(header, params['INFO_FORMAT'], cfh_status)
                cfh_status_list.append(cfh_status)
                i, j = feat.Params.I, feat.Params.J
                if cfh_status:
                    r = 'GetFeatureInfo done for %(i)s,%(j)s: got correct MIME-Type "%(header)s"' % locals()
                    if DEBUG: print r
                    check_results, check_status = checkAttributes(url=request_url, ssxml_att=feat.Attribute)
                    if DEBUG:
                        print "checkAttributes: Status:%s. Results: %s" %(check_status, check_results)
                    results += check_results
                    att_check_status.append(check_status)
                else:
                    r = 'GetFeatureInfo done for %(i)s,%(j)s: got wrong MIME-Type "%(header)s"' % locals()
                results.append(r)

            # Checking for Layers (WMS-50)
            layer_names = []
            def getSublayer(layer):
                if isinstance(layer, dict) and layer.has_key('Name'):
                    if (layer.Name not in layer_names) and (layer.Name):
                        return layer.Name

                else:
                    if isinstance(layer, list):
                        for sublayer in layer:
                            if sublayer.has_key('Name'):
                                return getSublayer(sublayer)


            layers = self.wms_getLayers()
            for layer in layers:
                layer_names.append(getSublayer(layer))

            for layer in layers_in_ssxml:
                if layer.status == 'must':
                    if layer.value in layer_names:
                        msg = "Found Layer %s (must)" %(layer.value)
                        found_layers.append(True)
                        layer_results.append(msg)
                    else:
                        msg = 'Mandatory Layer %s not found' %(layer.value)
                        found_layers.append(False)
                        layer_results.append(msg)


                
        else:
            ssurl = self.ssurl
            msg = 'No Features found in %(ssurl)s, skipping wms_GetFeatureInfo' % locals()
            results.append(msg)
            layer_results.append(msg)
        
        # SSXML
        status = ssxml_valid

        layer_status = all([status, all(cfh_status_list), all(found_layers)])
        print "att_check_status", att_check_status
        att_status = all([status, all(cfh_status_list), all(att_check_status)])
        full_status = all([layer_status, att_status])

        self.setResultsOverview("WMS-50", layer_status, layer_results)
        self.setResultsOverview("WMS-51", att_status, results)
        return ResponseDict("wms_GetFeatureInfo", results + layer_results, full_status)

    def wfs_CRS(self):
        """
        Checks CRS inside the GetCapabilities document at

        .. code-block:: xml

            <FeatureTypeList>
                <FeatureType>
                    <SRS>
                    
        and/or:

        .. code-block:: xml

            <FeatureTypeList>
                <FeatureType>
                    <DefaultSRS>

        and:

        .. code-block:: xml

            <FeatureTypeList>
                <FeatureType>
                    <OtherSRS>
                    
        Process:

            * Getting all CRS/SRS from the GetCapabilities document
            * Checking with :py:meth:`checkCRS <ows_checker._checker.OWSCheck.checkCRS>`

        .. seealso::

            * :ref:`rili-crs`
               
        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        srs_all = []
        status = False
        
        v = self.version
        
        try:
            if self.gc_by_versions.has_key('1.1.0'):
                root = self.gc_by_versions['1.1.0'].FeatureTypeList.FeatureType
                v = "1.1.0"
            elif self.gc_by_versions.has_key('1.0.0'):
                root = self.gc_by_versions['1.0.0'].FeatureTypeList.FeatureType
                v = "1.0.0"
            else:
                root = self.gc_xmlroot.FeatureTypeList.FeatureType
                
            if isinstance(root, dict):
                root = [root]
            
            for ft in root:                
                if ft.has_key("SRS"):
                    srs_all.append(ft.SRS.value)
                elif ft.has_key("CRS"):
                    srs_all.append(ft.SRS.value)
                elif ft.has_key("DefaultSRS"):
                    srs_all.append(ft.DefaultSRS.value)
                if ft.has_key("OtherSRS"):
                    if len(_ns(ft.OtherSRS)) > 1:
                        for x in range(len(_ns(ft.OtherSRS))):
                            srs_all.append(_ns(ft.OtherSRS)[x].value)
                    else:
                        srs_all.append(_ns(ft.OtherSRS))
            
            status, results = self.checkCRS(srs_all, for_version=v)
        except KeyError,e:
            results = "No Key %s found" %e
        
        return ResponseDict("wfs_CRS", results, status)

    
    def wfs_GetFeature(self):
        """
        Checking GetCapabilites document for ``GetFeature`` operation and supported Output Formats.

        * :ref:`rili-wfs-03`: Check that the capability document has the required MIME type
        * :ref:`rili-wfs-05`: check ``ows:OperationMetadata`` > ``ows:Operation name=”GetFeature”`` >
                              ``ows:Parameter name=outputFormat”`` > ``ows:Value text/xml, subtype=gml/3.2``
        * :ref:`rili-wfs-06`: same as WFS-05

        .. seealso::

            * :ref:`rili-wfs-03`
            * :ref:`rili-wfs-05`
            * :ref:`rili-wfs-06`


        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        results = []
        equals = []
        formats = []        
        found_gml = {}
        found_ili = {}

        if self.ows_common:
            #try:
            for operation in self.gc_xmlroot.OperationsMetadata.Operation:
                if _ns(operation.name) == "GetFeature":
                    parameter = dict2list(operation.Parameter)
                    for param in parameter:
                        if isinstance(param, dict):
                            if _ns(param.name) == "outputFormat":
                                pvalue = param.Value
                                for val in pvalue:
                                    formats.append(_ns(val))
                        else:
                            if DEBUG: print param

            #if DEBUG: print formats
            ftl = dict2list(self.gc_xmlroot.FeatureTypeList.FeatureType)
            for ft in ftl:                
                ft_formats = []
                if ft.has_key("Name"):
                    ft_name = ft.Name.value
                    # Init Lists
                    found_gml[ft_name] = []
                    found_ili[ft_name] = []
                    try:
                        if isinstance(ft.OutputFormats.Format, list):
                            ft_formats = [_ns(f) for f in ft.OutputFormats.Format]
                        else:
                            ft_formats.append(_ns(ft.OutputFormats.Format))
                    except KeyError: ft_formats = formats
                    formats += ft_formats
                    formats = unify(formats)
                    #if DEBUG: print formats
                    
                    # Workaround für text/xml;subtype=gml
                    #for format in formats:
                    #    if "subtype" in format:
                    #        format = format.split(";")[0]
                              
                    formats = unify(formats)


                    for format in formats:
                        # Check for GML
                        gml_status = False
                        gml_msg = '%s: GML3 not found' %(ft_name)

                        for gmlformat in _value(self.service_settings.Operations.GetFeature.Formats.GML.FormatString):
                            # look, if 'gml3' or 'gml/3.2' is in format
                            if gmlformat in format.lower():
                                if DEBUG: print "Found any gml in %s" %(ft_name)
                                gml_status = True
                                gml_msg = u'FeatureType %s supports "%s"' %(ft_name, format)

                        found_gml[ft_name].append(gml_status)

                        # Check for Interlis
                        ili_status = False
                        ili_msg = 'Interlis not found'
                        
                        for iliformat in _value(self.service_settings.Operations.GetFeature.Formats.Interlis.FormatString):
                            # look, if 'gml3' or 'gml/3.2' is in format
                            if iliformat in format.lower():
                                ili_status = True
                                ili_msg = u'FeatureType %s supports "%s"' %(ft_name, format)
                        
                        found_ili[ft_name].append(ili_status)

                else:
                    equals = [False]
                    results = "No OutputFormats defined"
        else:
            formats.extend(self.gc_xmlroot.Capability.Request.GetFeature.ResultFormat.keys())
            equals = [False]
            results = "Not implemented: should be outputFormat, see <i>OGC WFS 1.1.0 Implementation Specification</i>, page 39 pp"

            #for gml in gmls:
            #if "text/xml; subtype=gml/3.2" in gml or "application/gml+xml; version=3.2 " in gml:
            #gml_status = True
            #found_gml[3.2] = []
            #found_gml[3.2].append(gml_status)

        # Aggregate GML
        gml_results = []
        gml_status = []
        for k,v in found_gml.items():
            if any(v) and len(v):
                gml_status.append(True)
                #gml_results.append('Found GML in %s' %k)
            else:
                gml_status.append(False)
                gml_results.append('GML not supported for %s' %k)
                
        if not found_gml.items():
            gml_status = [False]
            gml_results = 'GML not supported / not found'
            
        self.setResultsOverview('WFS-05', status=all(gml_status), msg=gml_results)
        
        # Aggregate Interlis
        ili_results = []
        ili_status = []
        for k,v in found_ili.items():
            if any(v):
                ili_status.append(True)
                #ili_results.append('Found Interlis in %s' %k)
            else:
                ili_status.append(False)
                ili_results.append('Interlis not supported for %s' %k)
        
        if not found_ili.items():
            ili_status = [False]
            ili_results = 'Interlis not supported / not found'
        
        self.setResultsOverview('WFS-06', status=all(ili_status), msg=ili_results)
        
        status = all(equals)
        if status:
            msg = "All features okay"
        else:
            msg = "No Interlis/GML found"

        has_formats =  bool(len(formats))
        if has_formats:
            supported_formats = ', '.join(formats)
        else:
            supported_formats = 'No supported MIME Types found'
        self.setResultsOverview("WFS-03", status = has_formats, msg=supported_formats)
        return ResponseDict("wfs_GetFeature", results, status)

    def wfs_CheckFeatureTypes(self):
        """
        Implementation for :ref:`rili-wfs-50`. Reads the given FeatureTypes from SSXML and compares them with the
        listed FeatureTypes in the GetCapabilities document.

        .. code-block:: xml

            <ServerSettings>
                <!--- wms and other stuff here -->
                <WFS>
                    <FeatureTypes>
                        <FeatureType>kgcc:1901-1925</FeatureType>
                        <FeatureType>kgcc:1976-2000</FeatureType>
                        <FeatureType>kgcc:2001-2025_b1</FeatureType>
                    </FeatureTypes>
                    <GetFeature>
                        <!-- GetFeature stuff here -->
                    </GetFeature>
                </WFS>
            </ServerSettings>

        .. seealso::

            * :ref:`rili-wfs-50`


        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        results = []
        status = []
        ft_in_ssxml = []
        ft_in_gc = []

        def ssxml_check_failed(msg):
            return ResponseDict("wfs_CheckFeatureTypes", msg, False)

        if not self.ssurl:
            return ssxml_check_failed(msg='No ssurl provided')

        ftl = dict2list(self.gc_xmlroot.FeatureTypeList.FeatureType)
        ssxml = etree.parse(URL2File(self.ssurl))
        root = ssxml.getroot()
        ftl_ssxml = root.xpath('WFS/FeatureTypes')

        for fts in ftl_ssxml:
            ft = fts.xpath('FeatureType')
            for feattype in ft:
                ft_in_ssxml.append(feattype.text)

        for ft in ftl:
            ft_in_gc.append(_ns(ft.Name))

        for ft in ft_in_ssxml:
            s = ft in ft_in_gc
            status.append(s)
            if s:
                msg = "Found FeatureType '%s' in SSXML and GetCapabilities" % (ft)
            else:
                msg = "FeatureType '%s' not found in GetCapabilities"  % (ft)
            results.append(msg)

        status = all(status)
        self.setResultsOverview("WFS-50", status, results)
        return ResponseDict("wfs_CheckFeatureTypes", results, status)
    
    def wfs_CheckGetFeature(self):
        """
        Like :py:meth:`wms_GetFeatureInfo <ows_checker._checker.OWSCheck.wms_GetFeatureInfo>` it checks the
        Content of SSXML document and validates the given Attributes.

        Structure of the ``WFS``-Part:

        .. code-block:: xml

            <WFS>
                <FeatureTypes>
                    <FeatureType>medford:bikelanes</FeatureType>
                    <FeatureType>medford:buildings</FeatureType>
                    <FeatureType>medford:citylimits</FeatureType>
                    <FeatureType>usa:states</FeatureType>
                </FeatureTypes>
                <GetFeature>
                    <Feature fid="states.17">
                        <Params>
                            <REQUEST>GetFeature</REQUEST>
                            <TYPENAME>usa:states</TYPENAME>
                            <MAXFEATURES>1</MAXFEATURES>
                            <OUTPUTFORMAT>GML2</OUTPUTFORMAT>
                            <Filter>
                                <BBOX>
                                    <PropertyName>the_geom</PropertyName>
                                    <Envelope srsName="EPSG:4326">
                                        <lowerCorner>-88.169921588558 32.597655642372</lowerCorner>
                                        <upperCorner>-87.291015338558 33.476561892372</upperCorner>
                                    </Envelope>
                                </BBOX>
                            </Filter>
                        </Params>
                        <Attribute xpath="gml:featureMember/usa:states/@fid">states.17</Attribute>
                        <Attribute xpath="gml:featureMember/usa:states/usa:HOUSHOLD/text()">1506790.0</Attribute>
                        <Attribute xpath="gml:featureMember/usa:states/usa:STATE_NAME/text()">Alabama</Attribute>
                    </Feature>
                </GetFeature>
            </WFS>
        
        .. seealso::

            * :ref:`rili-wfs-51`
            * If Filters are used in the SSXML, OGC Filter Specification is also fulfilled but not mentioned in the results.

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        results = []
        att_check_status = []
        cfh_status_list = []
        status = True
        ssurl = self.ssurl
        
        def ssxml_check_failed(msg):
            #self.setResultsOverview("WFS-50", False, msg)
            #self.setResultsOverview("WFS-51", False, msg)
            return ResponseDict("wfs_CheckGetFeature", msg, False)

        if not self.ssurl:
            return ssxml_check_failed(msg='No ssurl provided')
        
        def checkAttributes(url, element):
            # element = Feature
            # Vars
            ssxml_dict = {}
            att_failed = []
            
            # Set up the given SSXML Attributes
            for att in element.xpath('Attribute'):
                k = att.xpath('@xpath').pop()
                ssxml_dict.update({k : att.text})
                
            # Download and parse url
            tree = etree.parse(URL2File(url))
            root = tree.getroot()
            
            # Use Namespaces
            ns = root.nsmap
            if None in ns.keys():
                ns['ogc'] = ns.pop(None)
            
            # Compare
            for xpath, value in ssxml_dict.items():
                # value = Wert, der erwartet wird (steht in ssxml)
                # response_value = Wert, der im Response-XML steht
                # xpath = XPath, der in der ssxml steht
                if DEBUG: print "Namespaces", ns
                #ns.pop(None, None)
                #if DEBUG: print "Cleaned Namespaces", ns
                #if DEBUG: print e(xpath)
                if DEBUG: print "value", value
                if DEBUG: print "xpath", xpath
                if DEBUG: print "ssxml_url", self.ssurl
                if DEBUG: print "url", url
                if DEBUG: print "ssxml_dict", ssxml_dict
                try:
                    response_value = root.xpath(xpath, namespaces=ns)
                except etree.XPathEvalError, e:
                    att_failed.append("Namespace Error, check your SSXML: %s" %(e))
                    break
                if value in response_value:
                    #found
                    pass
                else:
                    if len(response_value):
                        first_response_value = response_value[0]
                        att_failed.append("Given value %(value)s not equal to found value %(first_response_value)s" % locals())
                    else:
                        att_failed.append("No Attribute/Value found in xpath %s" %(xpath))
    
            return att_failed, not bool(att_failed)
        
        ssxml = etree.parse(URL2File(self.ssurl))
        root = ssxml.getroot()
        features = root.xpath('WFS/GetFeature/Feature')
        for feature in features:
            attributes = feature.xpath('Attribute')
            for att in attributes:
                if not len(att.xpath('@xpath')):
                    msg = 'No xpath found'
                    return ssxml_check_failed(msg)

        # Build requests for every feature
        if features:
            for feat in features:
                params = {}
                for param in feat.xpath('Params'):
                    for child in param.getchildren():
                        if child.tag == 'Filter':
                            # Removing double-Whitespaces and Newlines
                            a = etree.tostring(child)
                            a = a.replace("\n","").replace("  ","").replace('\t','')
                            params.update({child.tag: a})
                        else:
                            params.update({child.tag : child.text})
                params.update(service='WFS')
                
                request_url = self.build_kvp_url(self.base_url, params)
                cfh_status, header = self.checkFileHeader(['text/xml', 'application/xml'], request_url)
                cfh_status_list.append(cfh_status)
                if cfh_status:
                    check_results, check_status = checkAttributes(url=request_url, element=feat)
                    results += check_results
                    if check_status:
                        results.append('All checks for Feature %s passed' %(feat.xpath('@fid').pop()))
                        if DEBUG: print feat.getchildren()
                    att_check_status.append(check_status)
                else:
                    r = 'GetFeature done but got wrong MIME-Type "%s"' %(header)
                    results.append(r)       
                    
        else:
            msg = "%(ssurl)s invalid, no <WFS><GetFeature><Feature>-Element found" % locals()
            return ssxml_check_failed(msg)
        

        att_status = all([status, all(cfh_status_list), all(att_check_status)])

        self.setResultsOverview("WFS-51", att_status, results)
        return ResponseDict("wfs_CheckGetFeature", results, att_status)
    
    def check_wfs_serviceMeta(self, ExtendedCapabilities, found_ed, found_es):
        """
        Helper Function used in :py:meth:`wfs_ServiceMeta <ows_checker._checker.OWSCheck.wfs_ServiceMeta>`.
        """
        if ExtendedCapabilities.has_key('ExternalDataMetadata'):
            found_ed = True
        if ExtendedCapabilities.has_key('ExternalServiceMetadata'):
            found_es = True
        return found_ed, found_es

    def wfs_ServiceMeta(self):
        """
        WFS 1.0: Checking for existance of

            * ``Capability.VendorSpecificCapabilities.ExternalServiceMetadata``
            * ``FeatureTypeList.FeatureType.VendorSpecificCapabilities.ExternalDataMetadata``

        Elements.

        WFS > 1.0: Checking for existance of

            * ``ExtendedCapabilities.ExternalServiceMetadata``
            * ``FeatureTypeList.FeatureType.ExtendedCapabilities.ExternalDataMetadata``

        Elements.

        .. seealso::

            * :ref:`rili-meta-01` (commented out)
            * :ref:`rili-wfs-07`
            * :ref:`rili-wfs-08`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        results = []
        found_ec = False
        found_ed = False
        found_es = False
        msg_ec = ""
        #has_metadata = []
        #ftl = dict2list(self.gc_xmlroot.FeatureTypeList.FeatureType)
        #for ft in ftl:
        #    if ft.has_key("MetadataURL"):
        #        results.append("MetadataURL type: %s" %(_ns(ft.MetadataURL.type)))
        #        has_metadata.append(True)
        #    else:
        #        results.append("FeatureType %s has no MetadataURL" %ft.Name.value)
        #        has_metadata.append(False)
        #md_status = all(has_metadata)
        #self.setResultsOverview("META-01", md_status, "see WFS-05")

        if self.gc_dict.has_key('WFS_Capabilities'):
            if self.gc_dict.WFS_Capabilities.has_key('Capability'):
                found_ec = self.gc_dict.WFS_Capabilities.Capability.has_key('VendorSpecificCapabilities')
                if found_ec:
                    msg_ec = "Found Capability.VendorSpecificCapabilities!"
                    if DEBUG: print self.gc_dict.WFS_Capabilities.Capability.VendorSpecificCapabilities
                    found_ed, found_es = self.check_wfs_serviceMeta(self.gc_dict.WFS_Capabilities.Capability.VendorSpecificCapabilities, found_ed, found_es)
                else:
                    msg_ec = "No Capability.ExtendedCapabilities Element found"
            elif self.gc_dict.WFS_Capabilities.has_key('ExtendedCapabilities'):
                found_ec = self.gc_dict.WFS_Capabilities.has_key('ExtendedCapabilities')
                if found_ec:
                    msg_ec = "Found WFS_Capabilities.ExtendedCapabilities!"
                    if DEBUG: print self.gc_dict.WFS_Capabilities.ExtendedCapabilities
                    found_ed, found_es = self.check_wfs_serviceMeta(self.gc_dict.WFS_Capabilities.ExtendedCapabilities, found_ed, found_es)
                else:
                    msg_ec = "No WFS_Capabilities.ExtendedCapabilities Element found"
        else:
            found_ec = False
            msg_ec = "No Metadata Element found"

        if self.gc_dict.WFS_Capabilities.has_key('FeatureTypeList'):
            if self.gc_dict.WFS_Capabilities.FeatureTypeList.has_key('FeatureType'):
                try:
                    if self.gc_dict.WFS_Capabilities.FeatureTypeList.FeatureType.has_key('ExtendedCapabilities'):
                        found_ec = self.gc_dict.WFS_Capabilities.FeatureTypeList.FeatureType.has_key('ExtendedCapabilities')
                        if found_ec:
                            msg_ec = "Found Featuretype.FeatureType.ExtendedCapabilities!"
                            if DEBUG: print self.gc_dict.WFS_Capabilities.FeatureTypeList.FeatureType.ExtendedCapabilities
                            found_ed, found_es = self.check_wfs_serviceMeta(self.gc_dict.WFS_Capabilities.FeatureTypeList.FeatureType.ExtendedCapabilities, found_ed, found_es)
                    elif self.gc_dict.WFS_Capabilities.FeatureTypeList.FeatureType.has_key('VendorSpecificCapabilities'):
                        found_ec = self.gc_dict.WFS_Capabilities.FeatureTypeList.FeatureType.has_key('VendorSpecificCapabilities')
                        if found_ec:
                            msg_ec = "Found Featuretype.FeatureType.VendorSpecificCapabilities!"
                            if DEBUG: print self.gc_dict.WFS_Capabilities.FeatureTypeList.FeatureType.VendorSpecificCapabilities
                            found_ed, found_es = self.check_wfs_serviceMeta(self.gc_dict.WFS_Capabilities.FeatureTypeList.FeatureType.VendorSpecificCapabilities, found_ed, found_es)
                    else:
                        msg_ec = "No FeatureTypeList.FeatureType.ExtendedCapabilities Element found"
                except AttributeError:
                    pass
        else:
            found_ec = False
            msg_ec = "No FeatureTypelist Element found"

        self.setResultsOverview("WFS-07", status=found_ed, msg=msg_ec)
        self.setResultsOverview("WFS-08", status=found_es, msg=msg_ec)
        
        #status = all([md_status, found_ec])
        status = found_ec
        return ResponseDict("wfs_ServiceMeta", results, status)
    
    def wcs_CRS(self):
        """
        Checks the SRS/CRS given in the GetCapabilities document for the highest supported Version.

        .. code-block:: xml

            <OperationsMetadata>
                <Operation name="GetCoverage">
                    <Parameter name="GridBaseCRS>
                        <Value>...
            <Contents>
                <CoverageSummary>
                    <SupportedCRS>...

            or

            <Contents>
                <SupportedCRS>...

        Process:

            * Getting all CRS/SRS from the GetCapabilities document
            * Checking with :py:meth:`checkCRS <ows_checker._checker.OWSCheck.checkCRS>`

        Limitations:

            * No informations about CRS in non-OWS Common WCS found, if the WCS is non-OWS Common, following
              Messages will be returned: "No SRS in non-OWS-Common WCS defined".

        .. seealso::

            * :ref:`rili-crs`: see `Limitations`, all CRS will get ``False`` and the Message
              "No SRS in non-OWS-Common WCS defined"
        
        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        crs_all = []
        results = "no crs detected"
        status = False
        if self.ows_common \
           or self.gc_by_versions.has_key('1.1.0') \
           or self.gc_by_versions.has_key('1.1.1') \
           or self.gc_by_versions.has_key('1.1.2'):
            try:
                v = self.version
                if self.gc_by_versions.has_key('1.1.2'):
                    root = self.gc_by_versions['1.1.2']
                    v = "1.1.2"
                elif self.gc_by_versions.has_key('1.1.1'):
                    root = self.gc_by_versions['1.1.1']
                    v = "1.1.1"
                elif self.gc_by_versions.has_key('1.1.0'):
                    root = self.gc_by_versions['1.1.0']
                    v = "1.1.0"
                else:
                    root = self.gc_xmlroot
                print "Checking for Version", v
                operations = dict2list(root.OperationsMetadata.Operation)
                for operation in operations:
                    if _ns(operation.name) == "GetCoverage":
                        parameter = dict2list(operation.Parameter)
                        for param in parameter:
                            if _ns(param.name) == "GridBaseCRS":
                                if param.has_key('Value'):
                                    pvalue = param.Value
                                elif param.has_key('value'):
                                    pvalue = param.value
                                    
                                if param.has_key('Value') or param.has_key('value'):   
                                    if isinstance(pvalue, list):
                                        for val in _ns(pvalue):
                                            crs_all.append(_ns(val))
                                    else:
                                        crs_all.append(_ns(pvalue))
                                        #if DEBUG: print "val", _ns(pvalue)

                try:
                    try:
                        for scrs in root.Contents.CoverageSummary.SupportedCRS:
                            crs_all.append(_ns(root.Contents.CoverageSummary.SupportedCRS.value))
                    except KeyError, e:
                        print "KeyError", e
                        pass
                    except AttributeError, e:
                        for scrs in root.Contents.SupportedCRS:
                            crs_all.append(_ns(root.Contents.SupportedCRS.value))
                        pass
                except KeyError, e:
                    for scrs in root.Contents.CoverageSummary.SupportedCRS:
                        crs_all.append(_ns(scrs))
            except KeyError, e:
                if DEBUG: print "KeyError", e
            except AttributeError, e:
                if DEBUG: print "AttributeError", e
            if DEBUG: print "crs_all", crs_all
            status, results = self.checkCRS(crs_all, for_version=v)
        else:
            results = "No SRS in non-OWS-Common WCS (Version 1.0.0) defined"
            self.setResultsOverview("CRS-01", False, results)
            self.setResultsOverview("CRS-02", False, results)
            self.setResultsOverview("CRS-03", True, results)
            self.setResultsOverview("CRS-04", False, results)
            self.setResultsOverview("CRS-05", False, results)
            self.setResultsOverview("CRS-06", False, results)
            self.setResultsOverview("CRS-07", False, results)
            self.setResultsOverview("CRS-08", False, results)
        #if DEBUG: print crs_allW
        return ResponseDict("wcs_CRS", results, status)

    def wmts_RESTful(self):
        """
        If Flag ``restful`` not set and WMTS-01 is valid, we create a complete new OWSCheck-Instance with restful=True and
        check for WMTS-01.

        .. seealso::

            * :ref:`rili-wmts-02`
            * :ref:`rili-wmts-05`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        w = self.getRiliResults("WMTS-01")
        status = False
        kvp = False
        results = []
        if not self.restful:
            if w.status:
                try:
                    version = self.version or self.service_settings.minVersion
                    #base_url = urllib.basejoin(self.base_url, version + '/')
                    url = urllib.basejoin(self.base_url, version, self.service_settings.REST.GetCapabilities)
                    if DEBUG: print "RESTful URL: ", url
                    check = OWSCheck(service="WMTS", base_url=url, restful=True, auto=True, cwd=self.cwd)
                    if check.base_error:
                        results.append(check.base_error_msg)
                        status = False
                    else:
                        wmts_01 = check.getRiliResults("WMTS-01")
                        status = wmts_01.status
                        results = wmts_01.results
                except Exception, e:
                    status = False
                    results.append(str(e))

                # Matches WMTS-05
                kvp = True

            else:
                results.append("Could not check for RESTful, because WMTS-01 is not supported")


        else:
            if w.status:
                status = True
                results.append("RESTful flag set and WMTS-01 is supported")
            else:
                status = False
                results.append("RESTful flag set but WMTS-01 not supported")

            """
            try:
                version = self.version or self.service_settings.minVersion
                base_url = self.base_url.split(version)[0]
                check = OWSCheck(service="WMTS", base_url=url, restful=False, auto=True, cwd=self.cwd)
                if check.base_error:
                    results.append(check.base_error_msg)
                    kvp = False
                else:
                    wmts_01 = check.getRiliResults("WMTS-01")
                    kvp = wmts_01.status

            except Exception, e:
                status = False
                results.append(str(e))

                # Matches WMTS-05
            kvp = True
            """

        if kvp:
            kvp_msg = "Server supports KVP"
        else:
            kvp_msg = "WMTS-01 fails and/or Server does not support KVP"

        self.setResultsOverview("WMTS-02", status, results)
        self.setResultsOverview("WMTS-05", kvp, kvp_msg)


        return ResponseDict("wmts_RESTful", status=status, results=results)

    
    def wmts_CRS(self):
        """
        Getting CRS from ``Contents.TileMatrixSet.SupportedCRS``

        Process:

            * Getting all CRS/SRS from the GetCapabilities document
            * Checking with :py:meth:`checkCRS <ows_checker._checker.OWSCheck.checkCRS>`

        .. seealso::

            * :ref:`rili-crs`
            * :ref:`rili-wmts-04`
            * :ref:`rili-wmts-06`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        status = False
        srs_all = []
        TMS = self.gc_xmlroot.Contents.TileMatrixSet
        if isinstance(TMS, list):
            for tms in TMS:                
                results = tms.SupportedCRS.value
                srs_all.append(results)
                if DEBUG: print results
        else:
            results = TMS.SupportedCRS.value
            srs_all.append(results)
            if DEBUG: print results
            
        r, s = self.checkCRS(srs_all)
        if DEBUG: print r
        if DEBUG: print s
        
        return ResponseDict("wmts_CRS", results, status)

    def wmts_Formats(self):
        """
        Looks in GetCapabilities for supported Formats (defined in ``settings/wmts.xml``).

        .. seealso::

            * :ref:`rili-wmts-03`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        results = []
        status = []
        found_formats = []

        supported_formats_settings = [v.mime for v in self.service_settings.Operations.GetTile.Format]

        layers = self.gc_dict.Capabilities.Contents.Layer
        if not isinstance(layers, list): layers = [layers]
        for layer in layers:
            format = layer.Format
            if isinstance(format, list):
                for f in format:
                    if _ns(f) not in found_formats:
                        found_formats.append(_ns(f))
            elif isinstance(format, dict):
                if _ns(format) not in found_formats:
                    found_formats.append(_ns(format))

        for format in supported_formats_settings:
            if format in found_formats:
                status.append(True)
                results.append("Found Format %s" % format)
            else:
                status.append(False)
                results.append("Format %s not found" % format)
        status = all(status)
        self.setResultsOverview(rili='WMTS-03', status=status, msg=results )
        return ResponseDict("wmts_CRS", results, status)

    def wmts_TMS(self):
        """
        Checks the supported TileMatrixSets.

        .. seealso::

            * :ref:`rili-wmts-07`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        results = []
        status = []
        wmts_04 = self.getRiliResults("WMTS-04") # EPSG:21781
        wmts_06 = self.getRiliResults("WMTS-06") # EPSG:4326

        tms_settings = {}
        for set in self.service_settings.TMS.Set:
            values = set.ScaleDenominator
            tms_settings[set.crs] = _value(values)


        if wmts_04.status:
            pass

        tms_gc = self.gc_xmlroot.Contents.TileMatrixSet
        if isinstance(tms_gc, dict):
            tms_gc = [tms_gc]

        for tms in tms_gc:
            crs = _ns(tms.SupportedCRS)
            splitted = crs.split(":")[-1]
            crs = "EPSG:" + splitted
            sn_gc = [_ns(tm.ScaleDenominator) for tm in tms.TileMatrix]
            tms_status = []
            try:
                for sd in tms_settings[crs]:
                    if sd in sn_gc:
                        tms_status.append(True)
                    else:
                        tms_status.append(False)
                        results.append("Value '%s' not defined in TileMatrixSet for %s" %(sd, crs))

            except KeyError:
                results.append("Found TileMatrixSet for %s in GetCapabilites" % crs)

            tms_status = all(tms_status)
            if tms_status:
                results.append("Found TileMatrixSet for %s in GetCapabilites" % crs)

            status.append(tms_status)
        status = all(status)
        self.setResultsOverview("WMTS-07", status, results)
        return ResponseDict("wmts_TMS", results, status)
    
    def csw_Timestamp(self):
        """
        Performs a GetRecordByID Request and checks, if a Timestamp is ISO 8601 conform.

        .. note::

            * Needs translation
            * Depends on `OWSLib <http://owslib.sf.net>`_
            * see `Documentation about CSW <http://owslib.sourceforge.net/#csw>`_

        If a GetRecordByID Request is successful, following Operations are supported by the Server:

            * GetCapabilities
            * GetRecords
            * GetRecordById

        .. seealso::

            * :ref:`rili-allg-06`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        results = []
        ts_status = []
        try:
            from owslib.csw import CatalogueServiceWeb
            csw = CatalogueServiceWeb(self.base_url)
            csw.getrecords()
            records = csw.records.copy()
            for rid in records.keys():
                csw.getrecordbyid(id=[rid])
                recordsbyid = csw.records.copy()
                for rec_id, record in recordsbyid.items():
                    results.append("Got Record %s with title '%s'" %(rec_id, record.title))
                    if not record.date:
                        record.date = "No Date found"
                    s, msg = self.checkISO8601(timestamp=record.date)
                    results.append(msg)
                    ts_status.append(s)

        except ImportError:
            results.append("owslib not installed!")
            ts_status.append(False)
        except AttributeError, e:
            results.append("AttributeError: %s" %(e))
            ts_status.append(False)
        except Exception, e:
            results.append("Checking failed: %s" %(e))
            ts_status.append(False)

        status = all(ts_status)
        if not ts_status:
            results.append("No Records found")
        self.setResultsOverview("ALLG-06", status, results)
        return ResponseDict("csw_Timestamp", results, status)

    def csw_AppProfile(self):
        """
        Checks for

        .. code-block:: xml

            <ows:Constraint name="IsoProfiles">
                <ows:Value>
                    http://www.isotc211.org/2005/gmd
                </ows:Value>
            </ows:Constraint>

        .. seealso::

            * :ref:`rili-csw-02`

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        status = False
        results = []
        try:
            constraints = _ns(self.gc_xmlroot.OperationsMetadata.Constraint)
        except KeyError, e:
            msg = "Cound not found OperationsMetadata.Constraint in GetCapabilities: %s" % e
            results.append(msg)
            self.setResultsOverview("CSW-02", status, results)
            return ResponseDict("csw_AppProfile", results, status)

        if not isinstance(constraints, list):
            constraints = [constraints,]
        for con in constraints:
            if hasattr(con, 'name') and con.name == "IsoProfiles":
                v = _ns(con.Value)
                status = v == 'http://www.isotc211.org/2005/gmd'

        if status:
            results = 'Found IsoProfiles http://www.isotc211.org/2005/gmd'
        else:
            results = 'Couldn\'t find IsoProfiles http://www.isotc211.org/2005/gmd'

        self.setResultsOverview("CSW-02", status, results)
        return ResponseDict("csw_AppProfile", results, status)
    
    def csw_Meta(self):
        """
        Looking for GM03 in CSW GetCapabilites document. NOT IMPLEMENTED.

        .. seealso::

            * :ref:`rili-meta-01` (commented out)

        :rtype: :py:class:`ResponseDict <ows_checker._helpers.ResponseDict>` with results
                of the current method.
        """
        status = False
        results = []
        #for op in dict2list(self.gc_xmlroot.OperationsMetadata.Operation):
        #    if not op.has_key('Parameter'):
        #        # Nicht alle Operationen haben Parameter
        #        continue
        #    for param in dict2list(op.Parameter):
        #        if param.name.lower() == 'outputschema':
        #            for v in dict2list(param.Value):
        #                if 'gm03' in v.value.lower():
        #                    operation, paramname, value = op.name, param.name, v.value
        #                    r = "Found GM03 in Operation %(operation)s, Parameter %(paramname)s, Value %(value)s" % locals()
        #                    #if not r in results:
        #                    results.append(r)
        #                    status = True

        #self.setResultsOverview("META-01", status, results)
        return ResponseDict("csw_Meta", results, status)
