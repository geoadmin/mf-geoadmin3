.. raw:: html

  <head>
    <link href="../../_static/custom.css" rel="stylesheet" type="text/css" />
  </head>

.. _checker_doc:

eCH-0056 Checker user documentation
====================================

1 Goal of the document
***********************
This document describes the service *eCH-0056 Checker* in terms of implementation and utilisation.


2 Background 
************

2.1 eCH-0056
------------
The Swiss norm eCH-0056 [1]_ defines a "geoservices application profile". The main objective of the norm is to enable interoperability in geoservices chaining, in the framework of the Swiss National Spatial Data Infrastructure. The norm contains mandatory and optional rules for services implementation.

.. [1] http://www.ech.ch/vechweb/page?p=dossier&documentNumber=eCH-0056&documentVersion=2.00

2.2 eCH-0056 Checker
-----------------------
The *eCH-0056 Checker* is a service aiming at analysing geoservices conformance versus the norm eCH-0056. 

2.3	Constraints and limitations
-----------------------------------
The eCH-0056 Checker is implemented within the swisstopo infrastructure: to enable this integration, the service has to be stateless.
The service retrieves a GetCapabilities document, and all possible checks are done analyzing the capabilities document.
The stateless requirement partially constraints the OWSChecker, and it has not been possible to check some (few) eCH-0056 rules.     

3 eCH-0056 Checker howto 
*************************
The eCH-0056 Checker can be used via a HTML form and as a web service.

3.1 HTML form
-------------
The HTML form is available at the following address:

 * http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/ech0056.html

The form inputs are:

 * *Service URL*: this is the address of the server providing the service. Rules for service URL are:

    * It starts with http:// or https://
    * It can contain HTTP Basic Authentication (e.g. http://user:password@server.com)
    * It can contain vendor specific parameters, but no OWS specific parameter (e.g. request=GetCapabilities), e.g.:
       * http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/Vettoriali/Accelerazioni_Confronto_ERS_ENVISAT_Ascending.map is a valid URL
       * http://wms.geo.admin.ch/?request=GetCapailities is not a valid URL
    * It can contain port number
    * User should not use tailing "?", e.g.:
        * http://wms.geo.admin.ch/? is an invalid URL
        * http://wms.geo.admin.ch/ is a valid URL
 * *Service type*: this is a list box containing the service types that can be checked. If a server does not support the service selected in "Service type", the *eCH-0056 Checker* returns an error
 * *Server Settings URL*: same rules as for "Service URL", but should point to an existing web accessible XML file containing server specific settings for checking WMS and WFS thematic content (see Check thematic content). This file has to be created by the user according to the examples in Annex A.
 * *Service Restful-Only*: the checkbox should be activated if the server offers a Restful-only implementation of a WMTS. If this is the case, use only the base URL in "Service URL", e.g.:

    * http://wmts.geo.admin.ch/ is a valid URL
    * http://wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml is not a valid URL

3.1.1 HTML results
^^^^^^^^^^^^^^^^^^^^^

The HTML form returns the results in HTML format: this is a list of all eCH-0056 rules with results of the test. Returned messages are highlighted in different colors, whose meaning is as follows:

 * *green*: test passed (both mandatory and optional rules)
 * *red*: test not passed (mandatory rule)
 * *yellow*: test not passed (optional rule)
 * *white*: rule not checked

Before the list of all checked rules a "Status" message returns the overall result (compliance to eCH-0056).

3.2 Web service
----------------
The *eCH-0056 Checker* can be consumed as web service at the following address:
 * https://api3.geo.admin.ch/owschecker/bykvp 

using the following Key-Value parameters:

 * *base_url*: same specification as for "Service URL"
 * *service*: the service to be checked (same as for "Service Type")
 * *ssurl*: same specification as for "Service Settings URL"
 * *restful*: same specification as for "Service Restful-Only"

Example: 
 * https://api3.geo.admin.ch/owschecker/bykvp?base_url=http://wms.geo.admin.ch/&service=WMS  

4 eCH-0056 Rules 
******************

.. note:: **If not differently required by a specific rule, all results are given about the service version indicated as "MUST" ("MUSS", "DOIT") in eCH-0056.**

Some eCH-0056 rules are not checked for different reasons or are checked only for specific services and/or service versions:
 
 * *ALLG-01*: is not checked. This rule is linked to the OGC statement: *"Parameter names shall not be case sensitive, but parameter values shall be case sensitive"* (see for example WMS 1.3.0 § 6.8.1, WFS 2.0 § 6.2.5.2, OWS Common 2 § 11.5.2). This convention is only supported by very few software (e.g. GeoNetwork). Furthermore, by analysing OGC CITE test assertions for main services, such as WMS and WFS, the rule is not checked so far. It has been decided to not implement this check.
 * *ALLG-06*: is checked only if service=CSW
 * *SECU (all)*: are not checked. Security is an overall feature of a system, not only a matter of services. Since SECU assertions do not imply system security and since the rules are recommended, it has been decided to not implement the check
 * *LANG-02*: is not checked. The aim of the rule is to verify that a service supports the parameter LANGUAGE in requests to select a specific language. The test of this feature is not straightforward; a request like:

    * http://wms.geo.admin.ch/?service=wms&request=GetCapabilities&language=de

   should return a valid capabilities document in German and German should not be the default server language. For the stateless requirement and for performance reasons this test is skipped. It should also be considered that attaching something like "&parameter=xxx" to a GetCapabilities request will generally return a valid capabilities document: one can hardly distinguish if the feature is really supported by a server or not. On the other hand the fact that a server supports the "language" parameter does not guarantee a meaningful result; for example the following request:

    * http://www.geocat.ch/geonetwork/srv/csw?SERVICE=CSW&VERSION=2.0.2&REQUEST=GetCapabilities&language=ita

   returns a capabilities document with the following information:
   
   ::

       <ows:Operation name="GetCapabilities">
      	   <ows:DCP>
        	      <ows:HTTP>
                   <ows:Get xlink:href="http://www.geocat.ch/geonetwork/srv/ita/csw" />
                   <ows:Post xlink:href="http://www.geocat.ch/geonetwork/srv/ita/csw" />
                </ows:HTTP>
            </ows:DCP>
   
   that lets presume a resource in Italian. The document, instead, is not in Italian: it just means that the software behind the implementation of this service supports the parameter “language”.

 * *META-01*: is not checked. The implementation of this test would require:
    * That the service to be checked is documented in a catalog server and according to the GM03 norm;
    * A request other than GetCapabilities (GetRecordsByID against a catalog service)
   
   For the stateless requirement the rule is not checked.

 * *CRS (all)*: not checked if service=CSW
 * *WMS-03*: is not checked for the stateless requirement. Would require and additional GetMap request
 * *WMS-07*: checked only if service=WMS&version=1.3.0
 * *WMS-11*: checked only if service=WMS&version=1.3.0
 * *WFS-03*: for the stateless requirement, information here are related to the capabilities document
 * *SLD-01*: checked only if service=WMS&version=1.3.0
 * *SE-01*: not checked. Cannot check in capabilities document
 * *FE-01*: not checked. Cannot check in capabilities document

As far as language is concerned, the following codes are checked:

 * *German*: de, deu, de-CH, ger
 * *French*: fr, fra, fr-CH, fre
 * *Italian*: it, ita, it-CH
 * *Rumantsch*: roh, rm
 * *English*: en, eng, en-US, en-GB, en-CA

4.1 *e* CH-0056 compliance
--------------------------------
The following table shows, per service type, which rules are considered in the evaluation of the compliance towards eCH-0056. The meaning of the text is as follows:
 * True: the rule is checked and should return *True*
 * Neutral: the rule is checked, but, it does not matter the result, it has no impact on the final evaluation of the eCH-0056 compliance
 * Not checked: the rule is not checked 

+------------+------------+-----------+-----------+------------+-----------+ 
| Rule       | WMS        | WMTS      | WFS       | WCS        | CSW       |
+============+============+===========+===========+============+===========+ 
|**ALLG-01** |Not checked |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**ALLG-02** | True       | True      | True      | True       | True      |
+------------+------------+-----------+-----------+------------+-----------+ 
|**ALLG-03** | True       | True      | True      | True       | True      |
+------------+------------+-----------+-----------+------------+-----------+
|**ALLG-04** | True       | True      | True      | True       | True      |
+------------+------------+-----------+-----------+------------+-----------+
|ALLG-05     | Neutral    | Neutral   | Neutral   | Neutral    | Neutral   |
+------------+------------+-----------+-----------+------------+-----------+
|ALLG-06     | Not checked|Not checked|Not checked|Not checked | True      |
+------------+------------+-----------+-----------+------------+-----------+
|SECU-01     | Not checked|Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|SECU-02     | Not checked|Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|SECU-03     | Not checked|Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**LANG-01** | Neutral    | Neutral   | Neutral   | Neutral    | Neutral   |
+------------+------------+-----------+-----------+------------+-----------+
|LANG-02     | Not checked|Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|LANG-03     | Neutral    | Neutral   | Neutral   | Neutral    | Neutral   |
+------------+------------+-----------+-----------+------------+-----------+
|LANG-04     | Neutral    | Neutral   | Neutral   | Neutral    | Neutral   |
+------------+------------+-----------+-----------+------------+-----------+
|**CAPA-01** | True       | True      | True      | True       | True      |
+------------+------------+-----------+-----------+------------+-----------+
|**CAPA-02** | True       | True      | True      | True       | True      |
+------------+------------+-----------+-----------+------------+-----------+
|**EXCE-01** | True       | True      | True      | True       | True      |
+------------+------------+-----------+-----------+------------+-----------+
|**EXCE-02** | True       | True      | True      | True       | True      |
+------------+------------+-----------+-----------+------------+-----------+
|**VERS-01** | True       | True      | True      | True       | True      |
+------------+------------+-----------+-----------+------------+-----------+
|META-01     | Not checked|Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**CRS-01**  | True       | True      | True      | True       |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**CRS-02**  | True       | Neutral   | True      | True       |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**CRS-03**  | True       | True      | True      | True       |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**CRS-04**  | Neutral    | Neutral   | Neutral   | Neutral    |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|CRS-05      | Neutral    | Neutral   | Neutral   | Neutral    |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|CRS-06      | Neutral    | Neutral   | Neutral   | Neutral    |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|CRS-07      | Neutral    | Neutral   | Neutral   | Neutral    |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|CRS-08      | Neutral    | Neutral   | Neutral   | Neutral    |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|CRS-09      | Neutral    | Neutral   | Neutral   | Neutral    |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**WMS-01**  |True        |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**WMS-02**  |True        |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**WMS-03**  |Not checked |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**WMS-04**  |True        |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WMS-05      |Neutral     |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WMS-06      |Neutral     |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WMS-07      |Neutral     |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WMS-08      |Neutral     |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WMS-09      |Neutral     |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WMS-10      |Neutral     |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WMS-11      |Neutral     |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**WMTS-01** |Not checked |True       |Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**WMTS-02** |Not checked |True       |Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**WMTS-03** |Not checked |True       |Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**WMTS-04** |Not checked |True       |Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WMTS-05     |Not checked |Neutral    |Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WMTS-06     |Not checked |Neutral    |Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WMTS-07     |Not checked |Neutral    |Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**WFS-01**  |Not checked |Not checked|True       |Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**WFS-02**  |Not checked |Not checked|True       |Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**WFS-03**  |Not checked |Not checked|True       |Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WFS-04      |Not checked |Not checked|Neutral    |Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WFS-05      |Not checked |Not checked|Neutral    |Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WFS-06      |Not checked |Not checked|Neutral    |Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WFS-07      |Not checked |Not checked|Neutral    |Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WFS-08      |Not checked |Not checked|Neutral    |Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**WCS-01**  |Not checked |Not checked|Not checked|True        |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WCS-02      |Not checked |Not checked|Not checked|Neutral     |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|**CSW-01**  |Not checked |Not checked|Not checked|Not checked |True       |
+------------+------------+-----------+-----------+------------+-----------+
|**CSW-02**  |Not checked |Not checked|Not checked|Not checked |True       |
+------------+------------+-----------+-----------+------------+-----------+
|SE-01       | Not checked|Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|SLD-01      | Neutral    |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|FE-01       | Not checked|Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|POS-01      | Not checked|Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|POS-02      | Not checked|Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WMS-50      | Neutral    |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WMS-51      | Neutral    |Not checked|Not checked|Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WFS-50      | Not checked|Not checked|Neutral    |Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+
|WFS-51      | Not checked|Not checked|Neutral    |Not checked |Not checked|
+------------+------------+-----------+-----------+------------+-----------+

5 Constraints and limitations 
********************************

5.1 LANG-01
----------------
The rule states that language specifications should follow IETF RFC 5646. Anyway when  the test of this rule return "false" not necessarily the service can be considered not eCH-0056 compliant; in fact it can easily be the case that a service is just available in one language and does not support multilingualism.

For this reason, the rules is considered **neutral** for the overall evaluation of the eCH-0056 compliance of a service. 

5.2	CAPA-02
----------------
The rule states that information about the service, the service provider and the service usage must be given **as long as** enabled by a specific standard; this can lead to different interpretations. In order to constraint the interpretation, the following has been taken into account:

 * WMS-04: defines in details, for a WMS service, the elements that have to be taken in-to consideration for the service, service provider and service usage information
 * Section A 2.1 of eCH-0056: similar information

As a result the following set of elements has been defined:

 * Name
 * Title
 * Abstract
 * Organization Name
 * Organization web site (OnlineResource)
 * Organization email address 
 * Fees
 * Access Constraints   

This set of elements has been considered as a good balance among different requirements (OWS Common, service specific specifications, eCH-0056), and is taken as reference for the implementation of CAPA-02. **With the only exception of WFS 1.0.0: no contact information elements are available for this version of WFS**.

5.3	CRS-04&07&08
------------------------
CRS-04, 07, and 08 are coordinate reference systems for tridimensional data. The *eCH-0056 Checker* just verifies the presence/absence of these reference systems: the result is by no way related to the availability of 3D data.
More specifically, CRS-04 is considered **neutral** for the overall evaluation (eCH-0056 compliance) of a service. It is often the case that a service does not provide 3D data, so a non-compliance result cannot be given for this rule.  

5.4	WMS-06&07
---------------------
In WMS very often the root "Layer" is not really an actual layer, but rather a container for the actual layers. Information common to all layers are put within the root layer and are inherited by the "leaves" layers.
For this reason, as far as WMS-06 and WMS-07 are concerned, the check within the root layer is skipped.

5.5	WFS-07&08
---------------------
WFS-07 requires the use of the element "ech0056:ExternalDataMetadata", inside the element "ExtendedCapabilities", for linking to data metadata.
WFS-07 is checked against WFS version 1.0.0 (see 4 eCH-0056 Rules), and in WFS 1.0.0 schemas there is no "ExtendedCapabilities" element available; there is instead "Vendor-SpecificCapabilities". The element "ech0056:ExternalDataMetadata" is searched inside the element "VendorSpecificCapabilities". The same applies to WFS-08. Anyway, the *eCH-0056 Checker* searches also for "ExtendedCapabilities" when the service to check only implements version > 1.0.0

5.6	VERS-01 and WMS-01, WFS-01, WMTS-01, WCS-01, CSW-01
----------------------------------------------------------------
It could happen that VERS-01 is true and the '*'-01 rules are false, e.g.:.

 * VERS-01: "The following version(s) 1.0.0 is/are supported"
 * WCS-01: "The service does not support the mandatory WCS version 1.0.0"

This could appear a contradiction, but it is not the case. VERS-01 just checks for service version: for the example above, a GetCapabilities request with the parameter version=1.0.0 is done; the server returns a valid capabilities document.
In '*'-01, instead, it is checked that the service supports all mandatory operations of the related service specification: in the example above, the specific WCS server does not implement all mandatory operations (e.g. "DescribeCoverage").

5.7	CRS and WCS
-----------------------
For WCS services the CRS information are given about the highest WCS version supported by a server, and not the **MUST** version. WCS version 1.0.0 (mandatory for eCH-0056) does not support spatial reference systems information in the capabilities document.

5.8	CRS and WFS
-----------------------
For WFS services the CRS information are given about the highest WFS version supported by a server, and not the **MUST** version. WFS version 1.0.0 (mandatory for eCH-0056) supports only one spatial reference system at a time, so that CRS-01 and CRS-02 would never be both true.

6 Check thematic content 
**************************

In addition to the rules in eCH-0056 the checker performs two more types of test, in order to verify the thematic content of WMS and WFS services. These tests correspond to the following rules:

 * WMS-50: test the layer structure of a WMS in terms of completeness and naming
 * WMS-51: test the content on a GetFeatureInfo request at a reference point. INFO_FORMAT should be set to text/xml. 
 * WFS-50: test the layer structure of a WFS in terms of completeness and naming
 * WFS-51: test the content on a GetFeature request at a reference point (unlike GetFeatureInfo, the GetFeature request does not foresee the use of XY coordinates to specify a point of interest. As a workaround, a spatial filter with BBOX (bounding box) is used. OUTPUTFORMAT should be set to GML2.

These tests are performed against a server settings XML file, which has to be created by the user and has to be a web accessible resource. Examples of server settings files are in Annex A.


Annex A
*********

Server Settings file for WMS 
-----------------------------
`http://api3.geo.admin.ch/demo/owschecker/ssurl/ssurl_wms.xml </demo/owschecker/ssurl/ssurl_wms.xml>`_

This file can be tested against the server: http://lidarserver.com/sandiego 

 .. note:: If you want to create your own server settings file, copy/paste the example file and change the information according to your service. For more details on this have a look at the API documentation: http://api3.geo.admin.ch/doc/build/owschecker/. Take into consideration that: 'Request' must be set to 'GetFeatureInfo', 'INFO_FORMAT' to 'text/xml' and 'EXCEPTIONS' to 'application/vnd.ogc.se_xml'.



Server Settings file for WFS
-----------------------------
`http://api3.geo.admin.ch/demo/owschecker/ssurl/ssurl_wfs.xml </demo/owschecker/ssurl/ssurl_wfs.xml>`_

This file can be tested against the server: http://v2.suite.opengeo.org/geoserver/ows 

 .. note:: If you want to create your own server settings file, copy/paste the example file and change the information according to your service. For more details on this have a look at the API documentation: http://api3.geo.admin.ch/doc/build/owschecker/. Take into consideration that: 'Request' must be set to 'GetFeature' and 'OUTPUTFORMAT' to 'GML2'.
 .. note:: If you want to create your own server settings file, copy/paste the example file and change the information according to your service. For more details on this have a look at the API documentation: http://api3.geo.admin.ch/main/wsgi/doc/build/owschecker/. Take into consideration that: 'Request' must be set to 'GetFeature' and 'OUTPUTFORMAT' to 'GML2'.
