Swisstopo Environment
=====================

The OWS Checker is ment to run in a Cloud of Swisstopo Servers.

Server Components
-----------------

* Apache Web Server 2 with mod_wsgi

  Managing Request via mod_wsgi to Pylons Framework

* Pylons Web Framework

  Managing Request, calls OWS Checker and returns results in JSON

Config of Pylons App
--------------------

* View
* Controller

Development
-----------

* Login via SSH

    * ``ssh -Av ckarrie@ssh0.bgdi.admin.ch``
    * ``ssh ckarrie@mf1t.bgdi.admin.ch``

    or with seperate Identity File:

    .. note:: chmod 0600 to files first

    * ``ssh -Av ckarrie@ssh0.bgdi.admin.ch -i .ssh/id_rsa_swisstopo``
    * ``ssh ckarrie@mf1t.bgdi.admin.ch``

* Development URL

    * Doc: http://mf-chsdi0t.bgdi.admin.ch/ckarrie/wsgi/doc/build/
    * owschecker: http://mf-chsdi0t.bgdi.admin.ch/ckarrie/wsgi/owschecker

* Apache Server

    .. note::

        Restart of Apache required after code change

    * Restart with

      .. code-block:: none

        sudo apache2ctl -t && sudo apache2ctl graceful


* Python

    * use with

      .. code-block:: none

        cd /home/ckarrie/chsdi/karrie-django-owschecker
        ~/chsdi/buildout/bin/python ~/chsdi/karrie-django-owschecker/start_checker_test.py


* Pylons MVC

    * Configuration Mapping
        * ``/home/ckarrie/chsdi/chsdi/config``
            * ``routing.py``: Mapping URL -> Controller (Python files living
              in ``/home/ckarrie/chsdi/chsdi/controllers``) and Action (Methods)

    * Managing Controllers
        * ``/home/ckarrie/chsdi/chsdi/controllers``

