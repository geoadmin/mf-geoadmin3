# -*- coding: utf-8 -*-
from selenium.webdriver import PhantomJS
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pyramid.view import view_config
from pyramid.response import Response

class Snapshot(object):

    def __init__(self, request):
        self.request = request
        self.remoteUrl = request.registry.settings['geoadminhost']

    @view_config(route_name='snapshot')
    def home(self):
        querystring = ''
        for key in self.request.params.keys():
            if (key != '_escaped_fragment_') and (key != 'snapshot'):
                querystring += key + '=' + self.request.params.get(key) + '&'
        querystring += 'snapshot=true'
        retval = 'OK'
        #FIXME: where to put the log? I think it's re-created on every request
        driver = PhantomJS(service_log_path='/tmp/ghostdriver.log')
        #FIXME: there's a need to specify protocol here.
        driver.get('http://' + self.remoteUrl + '/?' + querystring)

        try:
            #It seems that in this context, the second parameter passed
            #to the WebDriverWait constructor does not have any influence
            element = WebDriverWait(driver, 0).until(EC.presence_of_element_located((By.ID, "seo-test")))

        finally:
            retval = driver.page_source
            driver.quit()
            return Response(body=retval, content_type='text/html', request=self.request)
        
