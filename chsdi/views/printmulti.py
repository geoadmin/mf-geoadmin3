# -*- coding: utf-8 -*-


import os.path
import urllib
import json
import re
import copy
import datetime
import time
import multiprocessing
import random
from urlparse import urlparse, parse_qs, urlsplit, urlunparse
from urllib import urlencode, quote_plus, unquote_plus

from httplib2 import Http
from collections import OrderedDict

from PyPDF2 import PdfFileMerger

from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPInternalServerError
from pyramid.response import Response
from chsdi.lib.decorators import requires_authorization

import logging
log = logging.getLogger(__name__)


NUMBER_POOL_PROCESSES = multiprocessing.cpu_count()
MAPFISH_FILE_PREFIX = 'mapfish-print'
MAPFISH_MULTI_FILE_PREFIX = MAPFISH_FILE_PREFIX + '-multi'
USE_MULTIPROCESS = True


def _zeitreihen(d, api_url):
    '''Returns the timestamps for a given scale and location for ch.swisstopo.zeitreihen
    '''

    timestamps = []

    http = Http(disable_ssl_certificate_validation=True)

    params = urllib.urlencode(d)
    url = 'http:' + api_url + '/rest/services/ech/MapServer/ch.swisstopo.zeitreihen/releases?%s' % params

    try:
        resp, content = http.request(url)
        if int(resp.status) == 200:
            timestamps = json.loads(content)['results']
    except:
        return timestamps

    return timestamps


def _get_extent_around_center(display, bbox, center, pixels):
    xPerPixel = abs(bbox[0] - bbox[2]) / display[0]
    yPerPixel = abs(bbox[1] - bbox[3]) / display[1]
    xCorr = xPerPixel * pixels
    yCorr = yPerPixel * pixels
    return [
        center[0] - xCorr,
        center[1] - yCorr,
        center[0] + xCorr,
        center[1] + yCorr
    ]


def _increment_info(l, filename):
    l.acquire()
    try:
        with open(filename, 'r') as infile:
            data = json.load(infile)

        data['done'] = data['done'] + 1

        with open(filename, 'w+') as outfile:
            json.dump(data, outfile)
    except:
        pass

    finally:
        l.release()


def _get_timestamps(spec, api_url):
    '''Returns the layers indices to be printed for each timestamp
    For instance (u'19971231', [1, 2]), (u'19981231', [0, 1, 2])  '''

    results = {}
    lyrs = spec.get('layers', [])
    log.debug('[_get_timestamps] layers: %s', lyrs)
    for idx, lyr in enumerate(lyrs):
        # For zeitreihen, we always get the timestamps from the service
        if lyr.get('layer') == 'ch.swisstopo.zeitreihen':
            try:
                page = spec['pages'][0]
                display = page['display']
                bbox = page['bbox']
                center = page['center']
                mapExtent = _get_extent_around_center(display, bbox, center, 0.5)
                imageDisplay = '1,1,96'
                timestamps = _zeitreihen({'mapExtent': ','.join(map(str, mapExtent)), 'imageDisplay': imageDisplay}, api_url)
                log.debug('[_get_timestamps] Zeitreichen %s', timestamps)
            except:
                timestamps = lyr['timestamps'] if 'timestamps' in lyr.keys() else None
        else:
            timestamps = lyr['timestamps'] if 'timestamps' in lyr.keys() else None

        if timestamps is not None:
            for ts in timestamps:
                if len(timestamps) > 1 and ts.startswith('9999'):
                    continue
                if ts in results.keys():
                    results[ts].append(idx)
                else:
                    results[ts] = [idx]

    return OrderedDict(sorted(results.items(), key=lambda t: t[0]))


def _qrcodeurlparse(raw_url):
    ''' Parse an qrcodegenerator ready link '''

    pattern = re.compile(ur'(https?:\/\/.*)\?url=(.*)')

    m = re.search(pattern, raw_url)

    try:
        (qrcode_service_url, qs) = m.groups()

        rawurl_to_shorten = unquote_plus(qs)
        scheme, netloc, path, params, query, fragment = urlparse(rawurl_to_shorten)
        map_url = urlunparse((scheme, netloc, path, None, None, None))
        parsed_params = parse_qs(query)
        params = dict([(key, ','.join(parsed_params[key])) for key in parsed_params.keys() if isinstance(parsed_params[key], list)])
        log.debug('map params=%s', params)

        return (qrcode_service_url, map_url, params)
    except:
        return False


def _qrcodeurlunparse(url_tuple):
    (qrcode_service_url, map_url, params) = url_tuple

    try:
        str_params = dict(map(lambda x: (x[0], unicode(x[1]).encode('utf-8')), params.items()))
    except UnicodeDecodeError:
        str_params = params
    quoted_map_url = quote_plus(map_url + "?url=" + unquote_plus(urlencode(str_params)))

    return qrcode_service_url + "?url=" + quoted_map_url


def _shorten(url, api_url='http://api3.geo.admin.ch'):
    ''' Shorten a possibly long url '''

    http = Http(disable_ssl_certificate_validation=True)

    shorten_url = api_url + '/shorten.json?url=%s' % quote_plus(url)

    try:
        resp, content = http.request(shorten_url)
        if int(resp.status) == 200:
            shorturl = json.loads(content)['shorturl']
            return shorturl
    except:
        return url


def create_pdf_path(print_temp_dir, unique_filename):
    return os.path.join(print_temp_dir, MAPFISH_MULTI_FILE_PREFIX + unique_filename + '.pdf.printout')


def create_info_file(print_temp_dir, unique_filename):
    return os.path.join(print_temp_dir, MAPFISH_MULTI_FILE_PREFIX + unique_filename + '.json')


def create_cancel_file(print_temp_dir, unique_filename):
    return os.path.join(print_temp_dir, MAPFISH_MULTI_FILE_PREFIX + unique_filename + '.cancel')


def worker(job):
    ''' Print and dowload the indivialized PDFs'''

    timestamp = None
    (idx, url, headers, timestamp, layers, tmp_spec, print_temp_dir, infofile, cancelfile, lock) = job

    for layer in layers:
        try:
            tmp_spec['layers'][layer]['params']['TIME'] = str(timestamp)
        except:
            continue

    log.debug('spec: %s', json.dumps(tmp_spec))

    # Before launching print request, check if process is canceled
    if os.path.isfile(cancelfile):
        return (timestamp, None)

    h = {'Referer': headers.get('Referer')}
    http = Http(disable_ssl_certificate_validation=True)
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
        except:
            log.debug('[Worker] Failed timestamp: %s', timestamp)

            return (timestamp, None)
        _increment_info(lock, infofile)
        return (timestamp, localname)
    else:
        log.debug('[Worker] Failed get/generate PDF for: %s. Error: %s', timestamp, resp.status)
        log.debug('[Worker] %s', content)
        return (timestamp, None)


# Function to be used on process to create all
# pdfs and merge them
def create_and_merge(info):

    lock = multiprocessing.Manager().Lock()

    (spec, print_temp_dir, scheme, api_url, headers, unique_filename) = info

    def _isMultiPage(spec):
        isMultiPage = False
        if 'movie' in spec.keys():
            isMultiPage = spec['movie']
        return isMultiPage

    def _merge_pdfs(pdfs, infofile):
        '''Merge individual pdfs into a big one'''
        '''We assume this happens in one process'''

        with open(infofile, 'r') as data_file:
            info_json = json.load(data_file)

        info_json['merged'] = 0

        def write_info():
            with open(infofile, 'w+') as outfile:
                json.dump(info_json, outfile)

        log.info('[_merge_pdfs] Starting merge')
        merger = PdfFileMerger()
        expected_file_size = 0
        for pdf in sorted(pdfs, key=lambda x: x[0]):

            ts, localname = pdf
            if localname is not None:
                try:
                    path = open(localname, 'rb')
                    expected_file_size += os.path.getsize(localname)
                    merger.append(fileobj=path)
                    info_json['merged'] += 1
                    write_info()
                except:
                    return None

        try:
            info_json['filesize'] = expected_file_size
            info_json['written'] = 0
            write_info()
            filename = create_pdf_path(print_temp_dir, unique_filename)
            log.info('[_merge_pdfs] Writing file.')
            out = open(filename, 'wb')
            merger.write(out)
            log.info('[_merge_pdfs] Merged PDF written to: %s', filename)
        except:
            return False

        finally:
            out.close()
            merger.close()

        return True

    jobs = []
    all_timestamps = []

    create_pdf_url = 'http:' + api_url + '/print/create.json'

    url = create_pdf_url + '?url=' + urllib.quote_plus(create_pdf_url)
    infofile = create_info_file(print_temp_dir, unique_filename)
    cancelfile = create_cancel_file(print_temp_dir, unique_filename)

    if _isMultiPage(spec):
        all_timestamps = _get_timestamps(spec, api_url)
        log.debug('[print_create] Going multipages')
        log.debug('[print_create] Timestamps to process: %s', all_timestamps.keys())

    if len(all_timestamps) < 1:
        job = (0, url, headers, None, [], spec, print_temp_dir)
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
                qrcodeurl = spec['qrcodeurl']
                tmp_spec['pages'][0]['timestamp'] = str(ts[0:4]) + "\n"

                ''' Adapteds the qrcode url and shortlink to match the timestamp
                    on every page of the PDF document'''

                parsed_qrcode_url = _qrcodeurlparse(qrcodeurl)
                if parsed_qrcode_url:
                    (qrcode_service_url, map_url, map_params) = parsed_qrcode_url
                    if 'time' in map_params:
                        map_params['time'] = ts[0:4]
                    if 'layers_timestamp' in map_params:
                        map_params['layers_timestamp'] = ts

                    time_updated_qrcodeurl = _qrcodeurlunparse((qrcode_service_url, map_url, map_params))
                    shortlink = _shorten(map_url + "?" + urlencode(map_params))

                    tmp_spec['qrcodeurl'] = time_updated_qrcodeurl
                    tmp_spec['pages'][0]['shortLink'] = shortlink
                    log.debug('[print_create] QRcodeURL: %s', time_updated_qrcodeurl)
                    log.debug('[print_create] shortLink: %s', shortlink)

            if 'legends' in tmp_spec.keys() and ts != last_timestamp:
                del tmp_spec['legends']
                tmp_spec['enableLegends'] = False

            log.debug('[print_create] Processing timestamp: %s', ts)

            job = (idx, url, headers, ts, lyrs, tmp_spec, print_temp_dir, infofile, cancelfile, lock)

            jobs.append(job)

    with open(infofile, 'w+') as outfile:
        json.dump({'status': 'ongoing', 'done': 0, 'total': len(jobs)}, outfile)

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
            log.error('Error while generating the partial PDF: %s', e)
            return 1
    else:
        pdfs = []
        for j in jobs:
            pdfs.append(worker(j))
            _increment_info(lock, infofile)

    # Check if canceled, then we don't merge pdf's
    # We don't/can't cancel the merge process itself
    if os.path.isfile(cancelfile):
        return 0

    log.debug('pdfs %s', pdfs)
    if len([i for i, v in enumerate(pdfs) if v[1] is None]) > 0:
        log.error('One or more partial PDF is missing. Cannot merge PDF')
        return 2

    if _merge_pdfs(pdfs, infofile) is False:
        log.error('Something went wrong while merging PDFs')
        return 3

    pdf_download_url = scheme + ':' + api_url + '/print/-multi' + unique_filename + '.pdf.printout'
    with open(infofile, 'w+') as outfile:
        json.dump({'status': 'done', 'getURL': pdf_download_url}, outfile)

    log.info('[create_pdf] PDF ready to download: %s', pdf_download_url)

    return 0


def delete_old_files(path):
    now = time.time()
    # older than 1 hour
    cutoff = now - 3600
    files = os.listdir(path)
    for xfile in files:
        if MAPFISH_MULTI_FILE_PREFIX not in xfile:
            continue
        fn = path + '/' + xfile
        if os.path.isfile(fn):
            t = os.stat(fn)
            c = t.st_ctime
            if c < cutoff:
                os.remove(fn)


class PrintMulti(object):

    ''' Print proxy to the MapFish Print Server to deal with time series

    If at least a layer hast an attributes 'timestamps' holding an array
    of timestamps to print, one page per timestamp will be generated and
    merged.'''

    def __init__(self, request):
        self.request = request

    @requires_authorization()
    @view_config(route_name='print_cancel', renderer='jsonp')
    def print_cancel(self):
        print_temp_dir = self.request.registry.settings['print_temp_dir']
        fileid = self.request.params.get('id')
        cancelfile = create_cancel_file(print_temp_dir, fileid)
        with open(cancelfile, 'a+'):
            pass

        if not os.path.isfile(cancelfile):
            raise HTTPInternalServerError('Could not create cancel file with given id')

        return Response(status=200)

    @requires_authorization()
    @view_config(route_name='print_progress', renderer='jsonp')
    def print_progress(self):
        print_temp_dir = self.request.registry.settings['print_temp_dir']
        fileid = self.request.params.get('id')
        filename = create_info_file(print_temp_dir, fileid)
        pdffile = create_pdf_path(print_temp_dir, fileid)

        if not os.path.isfile(filename):
            raise HTTPBadRequest()

        with open(filename, 'r') as data_file:
            data = json.load(data_file)

        # When file is written, get current size
        if os.path.isfile(pdffile):
            data['written'] = os.path.getsize(pdffile)

        return data

    @requires_authorization()
    @view_config(route_name='print_create', renderer='jsonp')
    def print_create(self):

        if self.request.method == 'OPTIONS':
            return Response(status=200)

        # delete all child processes that have already terminated
        # but are <defunct>. This is a side_effect of the below function
        multiprocessing.active_children()

        # IE is always URLEncoding the body
        jsonstring = urllib.unquote_plus(self.request.body)

        try:
            spec = json.loads(jsonstring, encoding=self.request.charset)

        except:
            raise HTTPBadRequest()

        print_temp_dir = self.request.registry.settings['print_temp_dir']

        # Remove older files on the system
        delete_old_files(print_temp_dir)

        scheme = self.request.headers.get('X-Forwarded-Proto',
                                          self.request.scheme)
        api_url = self.request.registry.settings['api_url']
        headers = dict(self.request.headers)
        headers.pop("Host", headers)
        unique_filename = datetime.datetime.now().strftime("%y%m%d%H%M%S") + str(random.randint(1000, 9999))

        with open(create_info_file(print_temp_dir, unique_filename), 'w+') as outfile:
            json.dump({'status': 'ongoing'}, outfile)

        info = (spec, print_temp_dir, scheme, api_url, headers, unique_filename)
        p = multiprocessing.Process(target=create_and_merge, args=(info,))
        p.start()
        response = {'idToCheck': unique_filename}

        return response
