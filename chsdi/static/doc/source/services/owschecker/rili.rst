.. _rili:

Guidelines eCH-0056
===================

OWS Checker Status
------------------

* :py:meth:`base_GetCapHandler <ows_checker._checker.OWSCheck.base_GetCapHandler>`:
    * ``True``: -
    * ``False``:
        * "Returned files is not an XML file:"
        * "Request failed: Code "
        * "HTTP-Error"
        * "GetCapabilities not well-formed:"
        * "Server responded with a (Service)ExceptionReport XML Document: <value>, exceptionCode was: <code>"
    * ``value``: Value from Exception Text
    * ``code``: Value from exceptionCode

Base Errors
~~~~~~~~~~~

* :py:meth:`base_ServiceHandler <ows_checker._checker.OWSCheck.base_ServiceHandler>`:
    * "No Element WayToServiceTypeNode not found. Please add this Element to settings/<service>.xml at Operations.GetCapabilities.WayToServiceTypeNode"
    * "Definition not found in <node>, seems to be no <service>"
    * ``service``: Service Type, i.e. "wms".
    * ``node``: Current WayToServiceTypeNode

* :py:meth:`base_VersionHandler <ows_checker._checker.OWSCheck.base_VersionHandler>`:
    * "Unsupported XML Element Node found <element>"
    * "Version <version> not found in settings/<service>.xml!"
    * ``element``: Name of Root Node found in XML
    * ``version``: Service Version
    * ``service``: Service Type

* :py:meth:`base_SSXMLHandler <ows_checker._checker.OWSCheck.base_SSXMLHandler>`:
    * "Error reading ServerSetting file:",
    * "Element <element> not found!"
    * some HTTP / URL / XML Errors
    * ``element``: mandatory Element Name, should be defined in ssxml-File

.. _rili-allg:

ALLG
----

.. _rili-allg-01:

ALLG-01
~~~~~~~

* :py:meth:`base_SwapCases <ows_checker._checker.OWSCheck.base_SwapCases>`:
    * ``True`` and ``False``: Results of Header comparison or HTTP Errors


.. _rili-allg-02:

ALLG-02
~~~~~~~

* :py:meth:`base_GetCapHandler <ows_checker._checker.OWSCheck.base_GetCapHandler>`:
    * ``True``: "URL ok"
    * ``False``: "HTTP-Error"

.. _rili-allg-03:

ALLG-03
~~~~~~~

Checked and set in

* :py:meth:`base_RandomRequest <ows_checker._checker.OWSCheck.base_RandomRequest>`:
    * ``True``: On URLError or HTTPError, returns Headerinformation
    * ``False``: "No Header found"
* :py:meth:`base_GetCapHandler <ows_checker._checker.OWSCheck.base_GetCapHandler>`:
    * ``True``: "HTTP-Error" or "Anfrage erhalten"
    * ``False``: -

.. _rili-allg-04:

ALLG-04
~~~~~~~

Checked and set in

* :py:meth:`base_RandomRequest <ows_checker._checker.OWSCheck.base_RandomRequest>`:
    * ``True``: Encoding Status
    * ``False``: Encoding Status
* :py:meth:`xml_Encoding <ows_checker._checker.OWSCheck.xml_Encoding>`:
    * ``True``: Encoding Status
    * ``False``: Encoding Status or "No encoding detected"


.. _rili-allg-05:

ALLG-05
~~~~~~~

Checked and set in

* :py:meth:`base_VersionHandler <ows_checker._checker.OWSCheck.base_VersionHandler>`:
    * ``True``: "Service supports OWS Common"
    * ``False``: "Server doesn't support OWS Common"


.. _rili-allg-06:

ALLG-06
~~~~~~~

Checked through

* :py:meth:`checkISO8601 <ows_checker._checker.OWSCheck.checkISO8601>`:
    * ``True``: "Timestamp '<timestamp>' is ISO 8601 compilant"
    * ``False``: "Timestamp '<timestamp>' is not ISO 8601 compilant"
    * ``timestamp``: Timestamp to check

and set in

* :py:meth:`csw_Timestamp <ows_checker._checker.OWSCheck.csw_Timestamp>`

.. _rili-secu:

SECU
----

* :py:meth:`security_HttpsHandler <ows_checker._checker.OWSCheck.security_HttpsHandler>`:
    * Always ``False``
    * "Not checked"

.. _rili-crs:

CRS
---

Checked and set in

* :py:meth:`checkCRS <ows_checker._checker.OWSCheck.checkCRS>`:
    * for **must** CRS:
        * Status criteria: Depends on if the CRS is found in the GetCapabilites document or not
        * ``True``: "CRS <crs> found"
        * ``False``: "CRS <crs> not found, but must"
        * ``crs``: Current CRS
    * for **optional** CRS:
        * Status criteria: Depends on if the CRS is found in the GetCapabilites document or not
        * ``True``: "Optional <crs> found"
        * ``False``: "Optional <crs> not found"
        * ``crs``: Current CRS
    * for **must not** CRS:
        * Status criteria: Depends on if the CRS is found (bad) in the GetCapabilites document or not (good)
        * ``True``: "CRS <crs> not found (is okay)"
        * ``False``: "CRS <crs> found, but depreciated"
        * ``crs``: Current CRS
    * if no/zero CRS found:
        * ``False``: "No SRS found" or "No SRS in non-OWS-Common WCS defined"

* :py:meth:`checkCRS <ows_checker._checker.OWSCheck.checkCRS>` called by:
    * :py:meth:`wms_CRS <ows_checker._checker.OWSCheck.wms_CRS>`
    * :py:meth:`wfs_CRS <ows_checker._checker.OWSCheck.wfs_CRS>`
    * :py:meth:`wcs_CRS <ows_checker._checker.OWSCheck.wcs_CRS>`
    * :py:meth:`wmts_CRS <ows_checker._checker.OWSCheck.wmts_CRS>`

.. _rili-crs-01:

CRS-01
~~~~~~

* Take a look at :ref:`rili-crs` first.

.. _rili-crs-02:

CRS-02
~~~~~~

* Take a look at :ref:`rili-crs` first.

.. _rili-crs-03:

CRS-03
~~~~~~

* Take a look at :ref:`rili-crs` first.

.. _rili-crs-04:

CRS-04
~~~~~~

* Take a look at :ref:`rili-crs` first.

.. _rili-crs-05:

CRS-05
~~~~~~

* Take a look at :ref:`rili-crs` first.

.. _rili-crs-06:

CRS-06
~~~~~~

* Take a look at :ref:`rili-crs` first.

.. _rili-crs-07:

CRS-07
~~~~~~

* Take a look at :ref:`rili-crs` first.

.. _rili-crs-08:

CRS-08
~~~~~~

* Take a look at :ref:`rili-crs` first.

.. _rili-crs-09:

CRS-09
~~~~~~

* Take a look at :ref:`rili-crs` first.

.. _rili-meta:

META
----

.. _rili-meta-01:

META-01
~~~~~~~

Commented out due to stateless:

* :py:meth:`wms_LegendURL <ows_checker._checker.OWSCheck.wms_LegendURL>`:
    * ``True``: "See WMS-07"
    * ``False``: "See WMS-07"
    * see :ref:`rili-wms-07`
* :py:meth:`wfs_ServiceMeta <ows_checker._checker.OWSCheck.wfs_ServiceMeta>`:
    * ``True``: "See WFS-05"
    * ``False``: "See WFS-05"
    * see :ref:`rili-wfs-05`
* :py:meth:`csw_Meta <ows_checker._checker.OWSCheck.csw_Meta>`:
    * ``True``: "Found GM03 in Operation <operation>, Parameter <paramname>, Value <value>"
    * ``False``: -


.. _rili-meta-02:

META-02
~~~~~~~

Not checked.


.. _rili-exce:

EXCE
----

.. _rili-exce-01:

EXCE-01
~~~~~~~

Checked and set in

* :py:meth:`base_RandomRequest <ows_checker._checker.OWSCheck.base_RandomRequest>`:
    * ``True``: Headerinformation
    * ``False``: "Header <header> not in <se> - EXCE-02"
    * ``header``: Headerinformation
    * ``se``: List of Service Exceptions
* :py:meth:`wms_GetMap <ows_checker._checker.OWSCheck.wms_GetMap>`:
    * ``True``: Headerinformation
    * ``False``: - (Won't be set)

.. _rili-exce-02:

EXCE-02
~~~~~~~

Checked and set in

* :py:meth:`base_RandomRequest <ows_checker._checker.OWSCheck.base_RandomRequest>`:
    * ``True``: Encoding Status or "see EXCE-01 (Service supports Service Exceptions)"
    * ``False``: Encoding Status or "<header> could not be read"
    * ``header``: Headerinformation
* :py:meth:`wms_GetMap <ows_checker._checker.OWSCheck.wms_GetMap>`
    * ``True``: "see EXCE-01"
    * ``False``: "see EXCE-01"

.. _rili-exce-03:

EXCE-03
~~~~~~~

Not checked.

.. _rili-exce-04:

EXCE-04
~~~~~~~

Not checked.

.. _rili-exce-05:

EXCE-05
~~~~~~~

Not checked.

.. _rili-capa:

CAPA
----

.. _rili-capa-01:

CAPA-01
~~~~~~~

Checked and set in

* :py:meth:`meta_MIMEHandler <ows_checker._checker.OWSCheck.meta_MIMEHandler>`:
    * ``True``: "<service>: <header> (file-header) - <mime> (capabilities) - <settings> (settings)"
    * ``False``: "<service>: <header> (file-header) - <mime> (capabilities) - <settings> (settings)" or "Could not determine header type: "
    * ``service``: Service Type
    * ``header``: Headerinformation from GetCapabilities file
    * ``mime``: Mimeinformation from GetCapabilities document
    * ``settings``: Mimeinformation set in `settings/*.xml`

.. _rili-capa-02:

CAPA-02
~~~~~~~

Checked and set in

* :py:meth:`meta_ServiceMeta <ows_checker._checker.OWSCheck.meta_ServiceMeta>`:
    * ``True``: "All descriptions found"
    * ``False``: "Description <descr> not found" or "No description found"
    * ``descr``: XML Node of Description

.. _rili-wfs:

WFS
---

.. _rili-wfs-01:

WFS-01
~~~~~~

Checked and set in

* :py:meth:`vers_MinService <ows_checker._checker.OWSCheck.vers_MinService>`:
    * ``True``: "<currentVersion> >= <minVersion>"
    * ``False``: "<currentVersion> < <minVersion>"
    * ``currentVersion``: current Version (default from Server)
    * ``minVersion``: minimal Version set in `settings/wfs.xml`

.. _rili-wfs-02:

WFS-02
~~~~~~

Checked and set in

* :py:meth:`meta_ServiceOperations <ows_checker._checker.OWSCheck.meta_ServiceOperations>`

.. _rili-wfs-03:

WFS-03
~~~~~~

Checked and set in

* :py:meth:`wfs_GetFeature <ows_checker._checker.OWSCheck.wfs_GetFeature>` (deactivated)


.. _rili-wfs-04:

WFS-04
~~~~~~

Checked and set in

* :py:meth:`vers_MaxService <ows_checker._checker.OWSCheck.vers_MaxService>`:
    * ``True``: "Server supports version: "
    * ``False``: "Server supports version: "

.. _rili-wfs-05:

WFS-05
~~~~~~

Checked and set in

* :py:meth:`wfs_GetFeature <ows_checker._checker.OWSCheck.wfs_GetFeature>` (deactivated)

.. _rili-wfs-06:

WFS-06
~~~~~~

Checked and set in

* :py:meth:`wfs_GetFeature <ows_checker._checker.OWSCheck.wfs_GetFeature>` (deactivated)

.. _rili-wfs-07:

WFS-07
~~~~~~

* :py:meth:`wfs_ServiceMeta <ows_checker._checker.OWSCheck.wfs_ServiceMeta>`:
    * ``True``: "Found OperationsMetadata.ExtendedCapabilities!"
    * ``False``: "No OperationsMetadata.ExtendedCapabilities Element found" or "No OperationsMetadata Element found"

.. _rili-wfs-08:

WFS-08
~~~~~~

* :py:meth:`wfs_ServiceMeta <ows_checker._checker.OWSCheck.wfs_ServiceMeta>`:
    * ``True``: "Found OperationsMetadata.ExtendedCapabilities!"
    * ``False``: "No OperationsMetadata.ExtendedCapabilities Element found" or "No OperationsMetadata Element found"

.. _rili-wfs-50:

WFS-50
~~~~~~

Checked and set in

* :py:meth:`wfs_CheckGetFeature <ows_checker._checker.OWSCheck.wfs_CheckGetFeature>`
    * ``True``: "All checks for Feature <feature> passed"
    * ``False``:
        * "GetFeature done but got wrong MIME-Type"
        * "<ssurl> invalid, no <Feature>-Element found"
        * "No xpath found"
        * "Given value <value> not equal to found value <first_response_value>"
        * "No Attribute/Value found in xpath"
        * "No ssurl provided"

.. _rili-wms:

WMS
---

.. _rili-wms-01:

WMS-01
~~~~~~

Checked and set in

* :py:meth:`vers_MinService <ows_checker._checker.OWSCheck.vers_MinService>`:
    * ``True``: "<currentVersion> >= <minVersion>"
    * ``False``: "<currentVersion> < <minVersion>"
    * ``currentVersion``: current Version (default from Server)
    * ``minVersion``: minimal Version set in `settings/wms.xml`

.. _rili-wms-02:

WMS-02
~~~~~~

Checked and set in

* :py:meth:`wms_GetMap <ows_checker._checker.OWSCheck.wms_GetMap>`:
    * ``True`` or ``False``: Depends on Results of :py:meth:`checkFileHeader <ows_checker._checker.OWSCheck.checkFileHeader>`
    * Message: "Layer <name>: <mime>"
    * ``name``: Name of Layer
    * ``mime``: Mimetype of Layer
* :py:meth:`wms_ImageFormats <ows_checker._checker.OWSCheck.wms_ImageFormats>`:
    * ``True``: "All Image Formats supported"
    * ``False``: "Only <supported> of <minimum> Image Formats supported."

.. _rili-wms-03:

WMS-03
~~~~~~

Checked and set in

* :py:meth:`wms_GetMap <ows_checker._checker.OWSCheck.wms_GetMap>`:
    * ``True``: "Missing LAYERS Parameter raises an exception as <header_no_layer>"
    * ``False``: "Missing LAYERS Parameter raises no exception as <header_no_layer>" or "Element not found:"
    * ``header_no_layer``: Headerinformations of Requests without ``LAYER`` Parameter

.. _rili-wms-04:

WMS-04
~~~~~~

Checked and set in

* :py:meth:`wms_ServiceMeta <ows_checker._checker.OWSCheck.wms_ServiceMeta>`:
    * ``True``: "All descriptions found"
    * ``False``: "Description <descr> not found"
    * ``descr``: XML Node

.. _rili-wms-05:

WMS-05
~~~~~~

Checked and set in

* :py:meth:`vers_MaxService <ows_checker._checker.OWSCheck.vers_MaxService>`:
    * ``True``: "Server supports version: "
    * ``False``: "Server supports version: "

.. _rili-wms-06:

WMS-06
~~~~~~

Checked and set in

* :py:meth:`wms_LegendURL <ows_checker._checker.OWSCheck.wms_LegendURL>`:
    * ``True``: "Found MetadataURL in layer <layer>' with type <type>"
    * ``False``:
        * "MetadataURL in layer <layer> found, but with type <type>."
        * "No MetadataURL in layer <layer> found"
    * ``layer``: Name of Layer
    * ``type``: ``type``-Attribute given for ``MetadataURL``-Element


.. _rili-wms-07:

WMS-07
~~~~~~

Checked and set in

* :py:meth:`wms_LegendURL <ows_checker._checker.OWSCheck.wms_LegendURL>`:
    * ``True``: Layername with Headercheck informations
    * ``False``:
        * "No layer name found. Not OGC conform." or
        * "No Style with a name found in layer " or/and
        * "No element Style in layer %s found"
        * HTTP Errors

.. _rili-wms-08:

WMS-08
~~~~~~

Checked and set in

* :py:meth:`OWSCheck.wms_ServiceMeta <ows_checker._checker.OWSCheck.wms_ServiceMeta>`
* :py:meth:`wms_ServiceMeta <ows_checker._checker.OWSCheck.wms_ServiceMeta>`:
    * ``True``: "Found VendorSpecificCapabilities.ExternalServiceMetadata" or "Found _ExtendedCapabilities.ExternalServiceMetadata"
    * ``False``: "No Vendor Specific Capabilities found"

.. _rili-wms-09:

WMS-09
~~~~~~

Checked and set in

* :py:meth:`OWSCheck.meta_ServiceOperations <ows_checker._checker.OWSCheck.meta_ServiceOperations>`

.. _rili-wms-10:

WMS-10
~~~~~~

Checked and set in

* :py:meth:`wms_GetFeatureInfoMIME <ows_checker._checker.OWSCheck.wms_GetFeatureInfoMIME>`:
    * ``True``: "Format XML found in GetCapabilities"
    * ``False``: "Format XML not found in GetCapabilities, check Capability.Request.GetFeatureInfo.Format"
* :py:meth:`wms_GetFeatureInfo <ows_checker._checker.OWSCheck.wms_GetFeatureInfo>`:
    * ``True``: "No Attributes to check because no SSURL defined", Status of Headercheck
    * ``False``: "No Features found in <ssurl>, skipping wms_GetFeatureInfo", Status of Headercheck

.. _rili-wms-11:

WMS-11
~~~~~~

Checked and set in

* :py:meth:`wms_SLD <ows_checker._checker.OWSCheck.wms_SLD>`:
    * ``True``: "SLD supported, found in GetCapabilites-Element UserDefinedSymbolization"
    * ``False``: "No SLD supported, not found in GetCapabilites-Element UserDefinedSymbolization"


.. _rili-wms-50:

WMS-50
~~~~~~

Checked and set in

* :py:meth:`wms_GetFeatureInfo <ows_checker._checker.OWSCheck.wms_GetFeatureInfo>`:
    * ``True``:
        * "No Attributes to check because no SSURL defined",
        * Status of Headercheck
        * "GetFeatureInfo done for <i>,<j>: got correct MIME-Type <header>"
    * ``False``:
        * "No Features found in <ssurl>, skipping wms_GetFeatureInfo",
        * Status of Headercheck
        * "GetFeatureInfo done for <i>,<j>: got wrong MIME-Type <header>"
        * "No Features found in <ssurl>, skipping wms_GetFeatureInfo"
        * "SSURL <ssurl> is not complete, Element or Attribute <attr> not found!"

.. _rili-wcs:

WCS
---


.. _rili-wcs-01:

WCS-01
~~~~~~

Checked and set in

* :py:meth:`vers_MinService <ows_checker._checker.OWSCheck.vers_MinService>`:
    * ``True``: "<currentVersion> >= <minVersion>"
    * ``False``: "<currentVersion> < <minVersion>"
    * ``currentVersion``: current Version (default from Server)
    * ``minVersion``: minimal Version set in `settings/wcs.xml`
* :py:meth:`OWSCheck.meta_ServiceOperations <ows_checker._checker.OWSCheck.meta_ServiceOperations>`

.. _rili-wcs-02:

WCS-02
~~~~~~

* :py:meth:`vers_MaxService <ows_checker._checker.OWSCheck.vers_MaxService>`:
    * ``True``: "Server supports version: "
    * ``False``: "Server supports version: "

.. _rili-wmts:

WMTS
----

.. _rili-wmts-01:

WMTS-01
~~~~~~~

Checked and set in

* :py:meth:`vers_MinService <ows_checker._checker.OWSCheck.vers_MinService>`:
    * ``True``: "<currentVersion> >= <minVersion>"
    * ``False``: "<currentVersion> < <minVersion>"
    * ``currentVersion``: current Version (default from Server)
    * ``minVersion``: minimal Version set in `settings/wmts.xml`
* :py:meth:`OWSCheck.meta_ServiceOperations <ows_checker._checker.OWSCheck.meta_ServiceOperations>`

.. _rili-wmts-02:

WMTS-02
~~~~~~~

Checked and set in

* :py:meth:`wmts_RESTful <ows_checker._checker.OWSCheck.wmts_RESTful>`

.. _rili-wmts-03:

WMTS-03
~~~~~~~

Checked and set in

* :py:meth:`wmts_Formats <ows_checker._checker.OWSCheck.wmts_Formats>`

.. _rili-wmts-04:

WMTS-04
~~~~~~~

Checked and set in

* :py:meth:`wmts_CRS <ows_checker._checker.OWSCheck.wmts_CRS>`

.. _rili-wmts-05:

WMTS-05
~~~~~~~

Checked and set in

* :py:meth:`wmts_RESTful <ows_checker._checker.OWSCheck.wmts_RESTful>`

.. _rili-wmts-06:

WMTS-06
~~~~~~~

Checked and set in

* :py:meth:`wmts_CRS <ows_checker._checker.OWSCheck.wmts_CRS>`

.. _rili-wmts-07:

WMTS-07
~~~~~~~

Checked and set in


.. _rili-csw:

CSW
---

.. _rili-csw-01:

CSW-01
~~~~~~

Checked and set in

* :py:meth:`vers_MinService <ows_checker._checker.OWSCheck.vers_MinService>`:
    * ``True``: "<currentVersion> >= <minVersion>"
    * ``False``: "<currentVersion> < <minVersion>"
    * ``currentVersion``: current Version (default from Server)
    * ``minVersion``: minimal Version set in `settings/csw.xml`
* :py:meth:`meta_ServiceOperations <ows_checker._checker.OWSCheck.meta_ServiceOperations>`

.. _rili-csw-02:

CSW-02
~~~~~~

Checked and set in

* :py:meth:`csw_AppProfile <ows_checker._checker.OWSCheck.csw_AppProfile>`

.. _rili-lang:

LANG
----

Sprachunterstützung in OWS.

.. _rili-lang-01:

LANG-01
~~~~~~~

Checked and set in

* :py:meth:`language_GetCapLang <ows_checker._checker.OWSCheck.language_GetCapLang>`:
    * ``True``: see :ref:`rili-lang-02`, :ref:`rili-lang-03` and :ref:`rili-lang-04`
    * ``False``: "Service does not support languages"

.. note::

    Die Richtlinie LANG-01 fordert die Verifikation nach IETF RFC 5646. IETF RFC 5646 fordert
    ein `two-letters`-Code (`de`), bzw. ein `four-letters`-Code (`de-CH`). Die Anmerkungen
    zu der Sprachunterstützung im eCH-0056 fordert jedoch ein `tree-letters`-Code (`deu`).
    Um diesem Widerspruch gerecht zu werden, wurden alle drei Fälle für die Sprachen Deutsch,
    Französisch, Italienisch und Englisch modelliert.


.. _rili-lang-02:

LANG-02
~~~~~~~

Checked and set in

* :py:meth:`language_GetCapLang <ows_checker._checker.OWSCheck.language_GetCapLang>`:
    * ``True``: "Found following languages: "
    * ``False``: "Found no languages in Parameters"

.. _rili-lang-03:

LANG-03
~~~~~~~

Checked and set in

* :py:meth:`language_GetCapLang <ows_checker._checker.OWSCheck.language_GetCapLang>`:
    * ``True``: "Supports languages via URL-Path"
    * ``False``: "Service does not support languages (via URL)"

.. _rili-lang-04:

LANG-04
~~~~~~~

Checked and set in

* :py:meth:`language_GetCapLang <ows_checker._checker.OWSCheck.language_GetCapLang>`:
    * ``True``: "Server responded with HTTP status code 300 (multiple choices)"
    * ``False``: "Server responded with HTTP status code <code> (should be 300)" or "Service does not support redirection (HTTP Status Code 300)"

.. _rili-vers:

VERS
----

.. _rili-vers-01:

VERS-01
~~~~~~~

Checked and set in

* :py:meth:`vers_MaxService <ows_checker._checker.OWSCheck.vers_MaxService>`:
    * ``True``: "Requested Version: <req> - got Version <ver>"
    * ``False``: "Requested Version: <req> - got Version <ver>"
    * ``req``: requested Version
    * ``ver``: returned Version

.. _rili-vers-02:

VERS-02
~~~~~~~

Not checked.
