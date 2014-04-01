# -*- coding: utf-8 -*-
from selenium.webdriver import PhantomJS
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pyramid.view import view_config
from pyramid.response import Response
import pyramid.httpexceptions as exc


def _connect():
    try:
        # FIXME: Logs should not be overriden each time
        driver = PhantomJS(service_log_path='/tmp/ghostdriver.log')
        return driver
    except WebDriverException as e:
        raise exc.HTTPBadRequest(e)


@view_config(route_name='snapshot')
def home(request):
    querystring = ''
    remoteUrl = request.registry.settings['geoadminhost']
    build_query_string = lambda x : ''.join((x, '=', request.params.get(x), '&'))
    for key in request.params.keys():
        if (key != '_escaped_fragment_') and (key != 'snapshot'):
            querystring += build_query_string(key)
    querystring += 'snapshot=true'
    driver = _connect()
    driver.implicitly_wait(10)
    try:
        # FIXME: there's a need to specify protocol here.
        driver.get('http://' + remoteUrl + '/?' + querystring)
        driver.find_element_by_id('seo-popup')
        pageSource = driver.page_source
    except WebDriverException as e:
        raise exc.HTTPBadRequest(e)
    finally:
        driver.quit()

    return Response(body=pageSource, content_type='text/html', request=request)
