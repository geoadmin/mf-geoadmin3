.. raw:: html

  <head>
    <link href="../_static/custom.css" rel="stylesheet" type="text/css" />
  </head>

.. _owschecker_settings:

Setting XML Files
=================

Example for WMS
---------------

Located in `settings/wms.xml`

.. code-block:: xml

    <wms>
    	<minVersion>1.1.1</minVersion>
    	<currVersion>1.3.0</currVersion>
    	<XML>
    		<Encoding>UTF-8</Encoding>

    		<Root></Root>
    	</XML>
    	<Version num="1.1.1">
    		<MIME>application/vnd.ogc.wms_xml</MIME>
    		<MIME>application/vnd.ogc.gml</MIME>
    		<Exception>application/vnd.ogc.se_xml</Exception>
    		<Exception>application/vnd.ogc.se_inimage</Exception>
    		<Exception>application/vnd.ogc.se_blank</Exception>
    		<Schema>http://schemas.opengis.net/wms/1.1.1/WMS_MS_Capabilities.dtd</Schema>
    		<Schema_local>schemas/wms_1_1_1.dtd</Schema_local>
    		<OWS_Common>0</OWS_Common>
    	</Version>
    	<Version num="1.3.0">
    		<MIME>text/xml</MIME>
    		<Exception>text/xml</Exception>
    		<Exception>application/xml</Exception>
    		<Exception>application/vnd.ogc.se_xml</Exception>
    		<Schema>http://schemas.opengis.net/wms/1.3.0/capabilities_1_3_0.xsd</Schema>
    		<Schema_local>schemas/wms_1_3_0.xsd</Schema_local>
    		<OWS_Common>0</OWS_Common>
    	</Version>
    	<RefSys>

    		<CRS status="must" rili="CRS-01">EPSG:21781</CRS>
    		<CRS status="must" rili="CRS-02">EPSG:4326</CRS>
    		<CRS status="not" rili="CRS-03">EPSG:9814</CRS>
    		<!-- no 3D -->
    		<CRS status="optional" rili="CRS-05">EPSG:2056</CRS>
    		<CRS status="optional" rili="CRS-06">EPSG:4258</CRS>
    		<!-- no 3D -->
    		<!-- no 3D -->
    		<CRS status="optional" rili="CRS-09">EPSG:21782</CRS>
    	</RefSys>
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
    </wms>

Structure
---------

* Root-Element Name: Service Type Name in lowercase, i.e. for `WMS` it's ``<wms>``.
* Node ``minVersion``: Minimal supported Version of Service
* Node ``currVersion``: Current highest supported Version of Service
* Node ``XML``: GetCapabilities XML Definition
    * Node ``Encoding``: Encoding of GetCapabilities document, default value is ``UTF-8``
* Nodes ``Version``: Version dependent Settings, Version String given by Attribute ``num``.
    * Nodes ``MIME``: Supported MIME-Types
    * Nodes ``Exception``: Supported Exception MIME-Types
    * Node ``Schema``: URL to DTD or XSD
    * Node
