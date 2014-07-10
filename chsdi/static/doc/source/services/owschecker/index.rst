.. OWS Checker documentation master file, created by
   sphinx-quickstart on Sat Aug 18 16:31:13 2012.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to OWS Checker's documentation!
=======================================

Hi. This is the documentation of the OWS Checker.

The first developement was done in the Bachelor Thesis `Konformitätsprüfung nach eCH-0056` by `Christian Karrie` and `Michel Würsten` in 2010 
at the `FHNW Nordwestschweiz <http://www.fhnw.ch>`_ and improved for production by a team of the `Institute of Geomatics Engineering <http://www.fhnw.ch/habg/ivgi/>`_ at 
`University of Applied Sciences and Arts Northwestern Switzerland <http://www.fhnw.ch>`_ in 2012.

How to start
------------

* Try to read the :ref:`api`
* Try to understand the :ref:`the-workflow`
* List of Error Messages in the :ref:`rili`

.. _the-workflow:

The Workflow
------------

The main principe of the validation process is doing some tests step by step. These steps are stored
in a workflow.

Here you find the method call order:

**Base Work**

    * :py:meth:`base_URLSyntax <ows_checker._checker.OWSCheck.base_URLSyntax>`
    * :py:meth:`base_SSXMLHandler <ows_checker._checker.OWSCheck.base_SSXMLHandler>`
    * :py:meth:`base_GetCapHandler <ows_checker._checker.OWSCheck.base_GetCapHandler>`
    * :py:meth:`base_ServiceHandler <ows_checker._checker.OWSCheck.base_ServiceHandler>`
    * :py:meth:`base_VersionHandler <ows_checker._checker.OWSCheck.base_VersionHandler>`
    * :py:meth:`base_RandomRequest <ows_checker._checker.OWSCheck.base_RandomRequest>`
    * :py:meth:`base_SwapCases <ows_checker._checker.OWSCheck.base_SwapCases>`
    * :py:meth:`security_HttpsHandler <ows_checker._checker.OWSCheck.security_HttpsHandler>`
    * :py:meth:`language_GetCapLang <ows_checker._checker.OWSCheck.language_GetCapLang>`
    * :py:meth:`vers_MaxService <ows_checker._checker.OWSCheck.vers_MaxService>`
    * :py:meth:`meta_MIMEHandler <ows_checker._checker.OWSCheck.meta_MIMEHandler>`
    * :py:meth:`meta_ServiceMeta <ows_checker._checker.OWSCheck.meta_ServiceMeta>`
    * :py:meth:`vers_MinService <ows_checker._checker.OWSCheck.vers_MinService>`
    * :py:meth:`xml_DefinitionHandler <ows_checker._checker.OWSCheck.xml_DefinitionHandler>` (deactivated, too slow for stateless)
    * :py:meth:`meta_ServiceOperations <ows_checker._checker.OWSCheck.meta_ServiceOperations>`
    
**WMS Work**

    * :py:meth:`wms_ServiceMeta <ows_checker._checker.OWSCheck.wms_ServiceMeta>`
    * :py:meth:`wms_LegendURL <ows_checker._checker.OWSCheck.wms_LegendURL>`
    * :py:meth:`wms_ImageFormats <ows_checker._checker.OWSCheck.wms_ImageFormats>`
    * :py:meth:`wms_CRS <ows_checker._checker.OWSCheck.wms_CRS>`
    * :py:meth:`wms_GetMap <ows_checker._checker.OWSCheck.wms_GetMap>` (deactivated, too slow for stateless)
    * :py:meth:`wms_SLD <ows_checker._checker.OWSCheck.wms_SLD>`
    * :py:meth:`wms_GetFeatureInfo <ows_checker._checker.OWSCheck.wms_GetFeatureInfo>`
    * :py:meth:`wms_GetFeatureInfoMIME <ows_checker._checker.OWSCheck.wms_GetFeatureInfoMIME>`
    
**WFS Work**

    * :py:meth:`wfs_CheckGetFeature <ows_checker._checker.OWSCheck.wfs_CheckGetFeature>`
    * :py:meth:`wfs_CRS <ows_checker._checker.OWSCheck.wfs_CRS>`
    * :py:meth:`wfs_GetFeature <ows_checker._checker.OWSCheck.wfs_GetFeature>` (deactivated)
    * :py:meth:`wfs_ServiceMeta <ows_checker._checker.OWSCheck.wfs_ServiceMeta>`

**WCS Work**

    * :py:meth:`wcs_CRS <ows_checker._checker.OWSCheck.wcs_CRS>`

**WMTS Work**

    * :py:meth:`wmts_CRS <ows_checker._checker.OWSCheck.wmts_CRS>`
    * some more, needs integration

**CSW Work**

    * :py:meth:`csw_AppProfile <ows_checker._checker.OWSCheck.csw_AppProfile>`
    * :py:meth:`csw_Meta <ows_checker._checker.OWSCheck.csw_Meta>`

Contents
--------

.. toctree::
   :maxdepth: 2

   api
   api_wms
   api_wfs
   api_wcs
   api_wmts
   api_csw
   helpers
   webgui
   rili
   environment


Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

