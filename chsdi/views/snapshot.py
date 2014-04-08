# -*- coding: utf-8 -*-
import os
from selenium.webdriver import PhantomJS
from selenium.common.exceptions import WebDriverException
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pyramid.view import view_config
from pyramid.response import Response
import pyramid.httpexceptions as exc


def _connect():
    try:
        driver = PhantomJS(service_log_path=os.devnull)
        return driver
    except WebDriverException as e:
        #Make sure to quite driver to stop process
        driver.quit()
        raise exc.HTTPInternalServerError(e)


@view_config(route_name='snapshot')
def home(request):

    #bail out directly with error
    raise exc.HTTPInternalServerError('Service is currently inactive')
    
#    querystring = ''
#    remoteUrl = request.registry.settings['geoadminhost']
#    build_query_string = lambda x: ''.join((x, '=', request.params.get(x), '&'))
#    for key in request.params.keys():
#        if (key != '_escaped_fragment_') and (key != 'snapshot'):
#            querystring += build_query_string(key)
#    querystring += 'snapshot=true'
#    driver = _connect()
#    try:
#        # FIXME: there's a need to specify protocol here.
#        driver.get('http://' + remoteUrl + '/?' + querystring)
#        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, 'seo-load-end')))
#        pageSource = driver.page_source
#    except TimeoutException:
#        raise exc.HTTPGatewayTimeout('Page could not be loaded in time')
#    except WebDriverException as e:
#        raise exc.HTTPInternalServerError(e)
#    finally:
#        driver.quit()
#
#    return Response(body=pageSource, content_type='text/html', request=request)
