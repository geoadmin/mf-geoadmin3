#-*- coding: utf-8 -*-


import os.path
import urllib
import urllib2
import json
import copy
import datetime
import shutil
import multiprocessing
from urlparse import urlsplit
from httplib2 import Http
from collections import OrderedDict

from PyPDF2 import PdfFileMerger

from pyramid.view import view_config
from pyramid.httpexceptions import (HTTPForbidden, HTTPBadRequest,
                                    HTTPBadGateway, HTTPInternalServerError)
from pyramid.response import Response, FileResponse

import logging
log = logging.getLogger(__name__)


NUMBER_POOL_PROCESSES = 4
MAPFISH_FILE_PREFIX = 'mapfish-print'
USE_MULTIPROCESS = True
pdfs = []


def worker(job):
    ''' Print and dowload the indivialized PDFs'''

    timestamp = None
    (idx, url, headers, timestamp, layers, tmp_spec, print_temp_dir) = job

    h = {'Referer': headers.get('Referer')}
    http = Http(disable_ssl_certificate_validation=True)

    for layer in layers:
        try:
            tmp_spec['layers'][layer]['params']['TIME'] = str(timestamp)
        except:
            continue

    log.debug('spec: %s', json.dumps(tmp_spec))

    resp, content = http.request(url, method='POST',
                                 body=json.dumps(tmp_spec), headers=h)

    if int(resp.status) == 200:
    # GetURL '141028163227.pdf.printout', file 'mapfish-print141028163227.pdf.printout'
    # We only get the pdf name and rely on the fact that they are stored on Zadara
        try:
            pdf_url = json.loads(content)['getURL']
            log.debug('[Worker] pdf_url: %s', pdf_url)
            filename = os.path.basename(urlsplit(pdf_url).path)
            localname = os.path.join(print_temp_dir, MAPFISH_FILE_PREFIX + filename)
            pdfs.append((timestamp, localname))
        except:
            log.debug('[Worker] Failed timestamp: %s', timestamp)

            return (timestamp, None)

        return (timestamp, localname)
    else:
        log.debug('[Worker] Failed get/generate PDF for: %s. Error: %s', timestamp, resp.status)
        log.debug('[Worker] %s', content)
        return (timestamp, None)


class PrintProxy(object):

    ''' Print proxy to the MapFish Print Server to deal with time series

    If at least a layer hast an attributes 'timestamps' holding an array
    of timestamps to print, one page per timestamp will be generated and
    merged.'''

    def __init__(self, request):
        self.request = request

    def _zeitreiehen(self, d):
        '''Returns the timestamps for a given scale and location for ch.swisstopo.zeitreiehen
        http://api.geo.admin.ch/zeitreihen?scale=200000000000&easting=573600&northing=180900
        '''

        timestamps = map(str, range(18441231, 20121231, 10000))

        http = Http(disable_ssl_certificate_validation=True)

        params = urllib.urlencode(d)
        # old mf-chsdi api!
        api_url = self.request.registry.settings['api_url']
        scheme = 'http'
        url = scheme + ':' + api_url + '/rest/services/ech/MapServer/ch.swisstopo.zeitreihen/releases?%s' % params

        print params

        try:
            resp, content = http.request(url)
            if int(resp.status) == 200:
                timestamps = json.loads(content)['results']
        except:
            return timestamps

        return timestamps

    def _get_timestamps(self, spec):
        '''Returns the layers indices to be printed for each timestamp
        For instance (u'19971231', [1, 2]), (u'19981231', [0, 1, 2])  '''

        results = {}
        lyrs = spec.get('layers', [])
        log.debug('[_get_timestamps] layers: %s', lyrs)
        for idx, lyr in enumerate(lyrs):
            if 'timestamps' in lyr.keys():
                if lyr.get('layer') == 'ch.swisstopo.zeitreihen':
                    try:
                        page = spec['pages'][0]
                        display = page['display']
                        bbox = page['bbox']
                        dpi = spec['dpi']
                        imageDisplay = "%s,%s,%s" % (display[0], display[1], dpi)
                        timestamps = self._zeitreiehen({'mapExtent': ",".join(map(str, bbox)), 'imageDisplay': imageDisplay})
                        log.debug('[_get_timestamps] Zeitreichen %s', timestamps)
                    except:
                        timestamps = lyr['timestamps']

                for ts in timestamps:
                    if len(timestamps) > 1 and ts.startswith('9999'):
                        continue
                    if ts in results.keys():
                        results[ts].append(idx)
                    else:
                        results[ts] = [idx]

        return OrderedDict(sorted(results.items(), key=lambda t: t[0]))

    def _merge_pdfs(self, pdfs):
        '''Merge individual pdfs into a big one'''

        unique_filename = None
        merger = PdfFileMerger()
        for pdf in sorted(pdfs, key=lambda x: x[0]):

            ts, localname = pdf
            if localname is not None:
                log.debug('[_merge_pdfs] Appending: %s', ts)
                try:
                    path = open(localname, 'rb')
                    merger.append(fileobj=path)
                except:
                    return None
                finally:
                    path.close()

        try:
            unique_filename = datetime.datetime.now().strftime("%y%m%d%H%M%S")
            filename = os.path.join(self.print_temp_dir, 'mapfish-print' + unique_filename + '.pdf.printout')
            out = open(os.path.join(self.print_temp_dir, filename), 'wb')
            merger.write(out)
            log.info('[_merge_pdfs] Merged PDF written to: %s', filename)
        except:
            return None

        finally:
            out.close()
            merger.close()

        return unique_filename

    def _isMultiPage(self, spec):
        isMultiPage = False
        if 'movie' in spec.keys():
            isMultiPage = spec['movie']
        return isMultiPage

    @view_config(route_name='print_info')
    def print_info(self):
        scheme = self.request.headers.get('X-Forwarded-Proto',
                                          self.request.scheme)

        url = self.request.params.get("url")
        if url is None:
            return HTTPBadRequest("Missing parameter 'url'")

        api_url = self.request.registry.settings['api_url']
        backend_info_json_url = scheme + ':' + api_url + '/print/info.json'
        url = backend_info_json_url + '?url=' + urllib.quote_plus(backend_info_json_url)

        http = Http(disable_ssl_certificate_validation=True)

        h = dict(self.request.headers)
        h.pop("Host", h)

        try:
            resp, content = http.request(url, method=self.request.method,
                                         body=self.request.body, headers=h)
            info_json = content.replace("/print/", "/printproxy/")
        except:
            raise HTTPBadGateway()

        if "content-type" in resp:
            ct = resp["content-type"]
        response = Response(info_json, status=resp.status,
                            headers={"Content-Type": ct})

        return response

    @view_config(route_name='print_create', renderer='jsonp')
    def print_create(self):

        jobs = []
        all_timestamps = []
        self.print_temp_dir = self.request.registry.settings['print_temp_dir']
        scheme = self.request.headers.get('X-Forwarded-Proto',
                                          self.request.scheme)

        if self.request.method == 'OPTIONS':
            return Response(status=200)

        try:
            spec = json.loads(self.request.body)

        except:
            raise HTTPBadRequest()

        layers = spec.get('layers', [])
        api_url = self.request.registry.settings['api_url']

        create_pdf_url = 'http:' + api_url + '/print/create.json'

        url = create_pdf_url + '?url=' + urllib.quote_plus(create_pdf_url)

        h = dict(self.request.headers)
        h.pop("Host", h)

        http = Http(disable_ssl_certificate_validation=True)

        if self._isMultiPage(spec):
            all_timestamps = self._get_timestamps(spec)
            log.debug('[print_create] Timestamps to process: %s', all_timestamps.keys())

        if len(all_timestamps) < 1:
            job = (0, url, h, None, [], spec, self.print_temp_dir)
            jobs.append(job)
        else:
            last_timestamp = all_timestamps.keys()[-1]

            for idx, ts in enumerate(all_timestamps):
                lyrs = all_timestamps[ts]

                tmp_spec = copy.deepcopy(spec)
                for lyr in lyrs:
                    try:
                        tmp_spec['layers'][lyr]['params']['TIME'] = str(ts)
                    except KeyError:
                        pass

                if ts is not None:
                    tmp_spec['pages'][0]['timestamp'] = str(ts[0:4]) + "\n"
                if 'legends' in tmp_spec.keys() and ts != last_timestamp:
                    del tmp_spec['legends']
                    tmp_spec['enableLegends'] = False

                log.debug('[print_create] Processing timestamp: %s', ts)

                job = (idx, url, h, ts, lyrs, tmp_spec, self.print_temp_dir)

                jobs.append(job)

        if USE_MULTIPROCESS:
            pool = multiprocessing.Pool(NUMBER_POOL_PROCESSES)
            pdfs = pool.map(worker, jobs)
            pool.close()
            try:
                pool.join()
                pool.terminate()
            except Exception as e:
                for i in reversed(range(len(pool._pool))):
                    p = pool._pool[i]
                    if p.exitcode is None:
                        p.terminate()
                    del pool._pool[i]
                raise HTTPInternalServerError('Error while generating the partial PDF: %s', e)
        else:
            pdfs = []
            for j in jobs:
                pdfs.append(worker(j))

        log.debug('pdfs %s', pdfs)
        if len([i for i, v in enumerate(pdfs) if v[1] is None]) > 0:
            msg = 'One or more partial PDF is missing. Cannot merge PDF'
            raise HTTPInternalServerError(msg)

        unique_filename = self._merge_pdfs(pdfs)
        if unique_filename is None:
            raise HTTPInternalServerError('Something went wrong while merging PDFs')

        pdf_download_url = scheme + ':' + api_url + '/print/' + unique_filename + '.pdf.printout'
        response = {'getURL': pdf_download_url}

        log.info('[create_pdf] PDF ready to download: %s', pdf_download_url)

        return response
