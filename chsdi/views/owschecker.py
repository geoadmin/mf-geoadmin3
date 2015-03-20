# -*- coding: utf-8 -*-

import os.path

from pyramid.view import view_config
from pyramid.renderers import render, render_to_response

from pyramid.httpexceptions import HTTPBadRequest
import ows_checker._checker


class Bunch(dict):

    def __init__(self, d):
        dict.__init__(self, d)
        self.__dict__.update(d)


def to_bunch(d):
    r = {}
    for k, v in d.items():
        if isinstance(v, dict):
            v = to_bunch(v)
        r[k] = v
    return Bunch(r)


def makotest(self):
        name = 'Pylons Developer'
        return render('/test.mako', extra_vars={'name': name})


@view_config(route_name='owschecker_bykvp', renderer='json')
def bykvp(request):
        base_url = request.params.get('base_url', "")
        service = request.params.get('service', "")
        if base_url == "" or service == "":
            raise HTTPBadRequest("Required parameters 'base_url' or 'service' are missing")

        restful = request.params.get('restful', False)
        ssurl = request.params.get('ssurl', "")
        if restful:
            restful = True
        else:
            restful = False
        c = ows_checker._checker.OWSCheck(base_url=base_url,
                                          service=service,
                                          # version='1.1.1',
                                          auto=True,
                                          cwd=os.path.join(request.registry.settings['install_directory'], "ows_checker/settings/"),
                                          ssurl=ssurl,
                                          restful=restful
                                          )
        return c.getResultsOverview(aggregate=True)


@view_config(route_name='owschecker_form', renderer='html')
def form(request):
        base_url = request.params.get('base_url', "")
        service = request.params.get('service', "WMS")
        restful = request.params.get('restful', False)
        ssurl = request.params.get('ssurl', "")

        if base_url and service:
            c = ows_checker._checker.OWSCheck(base_url=base_url,
                                              service=service,
                                              # version='1.1.1',
                                              auto=True,
                                              cwd=os.path.join(request.registry.settings['install_directory'], "ows_checker/settings/"),
                                              ssurl=ssurl,
                                              restful=restful
                                              )
            # see http://stackoverflow.com/questions/2352252/how-to-use-dicts-in-mako-templates
            #results_dict = to_bunch(c.getResultsOverview())
            results_dict = c.getResultsOverview(aggregate=True)

        else:
            results_dict = None
        return render_to_response('chsdi:templates/owschecker.mako', {
            'results_dict': results_dict,
            'base_url': base_url,
            'service': service,
            'restful': restful,
            'ssurl': ssurl
        })
