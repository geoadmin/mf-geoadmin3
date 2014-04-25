.. _api:

OWS Checker API
===============

.. contents::
    :local:

Init of ``OWSCheck``
--------------------

.. autoclass:: ows_checker._checker.OWSCheck
   :members: __init__
   :undoc-members:
   :show-inheritance:
   :special-members:

OWSCheck Helper Methods
-----------------------

next
~~~~

.. automethod:: ows_checker._checker.OWSCheck.next

getResultsOverview
~~~~~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.getResultsOverview

getRiliResults
~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.getRiliResults

getRiliResults
~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.setResultsOverview

calculateProgress
~~~~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.calculateProgress

checkFileHeader
~~~~~~~~~~~~~~~
.. automethod:: ows_checker._checker.OWSCheck.checkFileHeader

CRSHandler
~~~~~~~~~~
.. automethod:: ows_checker._checker.OWSCheck.CRSHandler

checkCRS
~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.checkCRS

checkISO8601
~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.checkISO8601

``base``-Methods
-----------------

base_URLSyntax
~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.base_URLSyntax

base_RandomRequest
~~~~~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.base_RandomRequest

base_GetCapHandler
~~~~~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.base_GetCapHandler

base_ServiceHandler
~~~~~~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.base_ServiceHandler

base_VersionHandler
~~~~~~~~~~~~~~~~~~~
.. automethod:: ows_checker._checker.OWSCheck.base_VersionHandler

base_SwapCases
~~~~~~~~~~~~~~
.. automethod:: ows_checker._checker.OWSCheck.base_SwapCases

base_SSXMLHandler
~~~~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.base_SSXMLHandler

``security``-Methods
---------------------

security_HttpsHandler
~~~~~~~~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.security_HttpsHandler

``language``-Methods
--------------------

language_GetCapLang
~~~~~~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.language_GetCapLang

``vers``-Methods
----------------

vers_MinService
~~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.vers_MinService

vers_MaxService
~~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.vers_MaxService

``meta``-Methods
----------------

meta_MIMEHandler
~~~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.meta_MIMEHandler

meta_ServiceMeta
~~~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.meta_ServiceMeta

meta_ServiceOperations
~~~~~~~~~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.meta_ServiceOperations

``xml``-Methods
---------------

xml_DefinitionHandler
~~~~~~~~~~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.xml_DefinitionHandler

xml_Validate
~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.xml_Validate

xml_DTD
~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.xml_DTD

xml_XSD
~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.xml_XSD

xml_Encoding
~~~~~~~~~~~~

.. automethod:: ows_checker._checker.OWSCheck.xml_Encoding

Service Type dependent Methods
------------------------------

We split these Service Type dependent Methods with respect to readability.

``wms``-Methods
~~~~~~~~~~~~~~~

see :ref:`api-wms`.

``wfs``-Methods
~~~~~~~~~~~~~~~

see :ref:`api-wfs`.

``wcs``-Methods
~~~~~~~~~~~~~~~

see :ref:`api-wcs`.

``wmts``-Methods
~~~~~~~~~~~~~~~~

see :ref:`api-wmts`.


``csw``-Methods
~~~~~~~~~~~~~~~

see :ref:`api-csw`.





