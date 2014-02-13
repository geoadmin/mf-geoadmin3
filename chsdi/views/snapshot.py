# -*- coding: utf-8 -*-
import selenium.webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pyramid.view import view_config
from pyramid.response import Response

class Snapshot(object):

    status_int = 200

    def __init__(self, request):
        self.request = request
        self.remoteUrl = request.registry.settings['geoadminhost']

    @view_config(route_name='snapshot')
    def home(self):
        querystring = ''
        for key in self.request.params.keys():
            querystring += key + '=' + self.request.params.get(key) + '&'
        querystring += 'snapshot=true'
        retval = 'OK'
        driver = selenium.webdriver.PhantomJS(service_log_path='/tmp/ghostdriver.log')
        driver.get('http://' + self.remoteUrl + '/?' + querystring)

        try:
            element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "seo-test")))

        finally:
            retval = driver.page_source
            driver.quit()
            return Response(body=retval, content_type='text/html', request=self.request)
        
