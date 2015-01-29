# -*- coding: utf-8 -*-

import re
from osgeo import osr, ogr
from pyramid.threadlocal import get_current_registry
from pyramid.i18n import get_locale_name
from pyramid.httpexceptions import HTTPBadRequest
import unicodedata
from urllib import quote
from urlparse import urlparse, urlunparse, urljoin


def versioned(path):
    version = get_current_registry().settings['app_version']
    entry_path = get_current_registry().settings['entry_path'] + '/'
    if version is not None:
        agnosticPath = make_agnostic(path)
        parsedURL = urlparse(agnosticPath)
        # we don't do version when behind pserve (at localhost)
        if 'localhost:' not in parsedURL.netloc:
            parts = parsedURL.path.split(entry_path, 1)
            if len(parts) > 1:
                parsedURL = parsedURL._replace(path=parts[0] + entry_path + version + '/' + parts[1])
                agnosticPath = urlunparse(parsedURL)
        return agnosticPath
    else:
        return path


def make_agnostic(path):
    handle_path = lambda x: x.split('://')[1] if len(x.split('://')) == 2 else path
    if path.startswith('http'):
        path = handle_path(path)
        return '//' + path
    else:
        return path


def make_api_url(request):
    base_path = request.registry.settings['apache_base_path']
    base_path = '' if base_path == 'main' else '/' + base_path
    host = request.host + base_path if 'localhost' not in request.host else request.host
    return ''.join((request.scheme, '://', host))


def check_url(url):
    if url is None:
        raise HTTPBadRequest('The parameter url is missing from the request')
    parsedUrl = urlparse(url)
    hostname = parsedUrl.hostname
    if hostname is None:
        raise HTTPBadRequest('Could not determine the hostname')
    domain = ".".join(hostname.split(".")[-2:])
    if all(('admin.ch' not in domain, 'swisstopo.ch' not in domain, 'bgdi.ch' not in domain)):
        raise HTTPBadRequest('Shortener can only be used for admin.ch, swisstopo.ch and bgdi.ch domains')
    return url


def sanitize_url(url):
    sanitized = url
    try:
        sanitized = urljoin(url, urlparse(url).path.replace('//', '/'))
    except:
        pass
    return sanitized


def locale_negotiator(request):
    lang = request.params.get('lang')
    settings = get_current_registry().settings
    languages = settings['available_languages'].split()
    if lang == 'rm':
        return 'fi'
    elif lang is None or lang not in languages:
        if request.accept_language:
            return request.accept_language.best_match(languages, 'de')
        # the default_locale_name configuration variable
        return get_locale_name(request)
    return lang


def check_even(number):
    if number % 2 == 0:
        return True
    return False


def round(val):
    import math
    return math.floor(val + 0.5)


def format_search_text(input_str):
    return remove_accents(
        escape_sphinx_syntax(input_str)
    )


def remove_accents(input_str):
    if input_str is None:
        return input_str
    input_str = input_str.replace(u'ü', u'ue')
    input_str = input_str.replace(u'Ü', u'ue')
    input_str = input_str.replace(u'ä', u'ae')
    input_str = input_str.replace(u'Ä', u'ae')
    input_str = input_str.replace(u'ö', u'oe')
    input_str = input_str.replace(u'Ö', u'oe')
    return ''.join(c for c in unicodedata.normalize('NFD', input_str) if unicodedata.category(c) != 'Mn')


def escape_sphinx_syntax(input_str):
    if input_str is None:
        return input_str
    input_str = input_str.replace('|', '\\|')
    input_str = input_str.replace('!', '\\!')
    input_str = input_str.replace('@', '\\@')
    input_str = input_str.replace('&', '\\&')
    input_str = input_str.replace('~', '\\~')
    input_str = input_str.replace('^', '\\^')
    input_str = input_str.replace('=', '\\=')
    input_str = input_str.replace('/', '\\/')
    input_str = input_str.replace('(', '\\(')
    input_str = input_str.replace(')', '\\)')
    input_str = input_str.replace(']', '\\]')
    input_str = input_str.replace('[', '\\[')
    input_str = input_str.replace('*', '\\*')
    input_str = input_str.replace('<', '\\<')
    input_str = input_str.replace('$', '\\$')
    input_str = input_str.replace('"', '\"')
    return input_str


def format_query(model, value):
    def escapeSQL(value):
        if u'ilike' in value:
            match = re.search(r'(.*ilike .*)(%.*%)(.*)', value)
            where = u''.join((
                match.group(1).replace(u'\'', u'E\''),
                match.group(2).replace(u'\\', u'\\\\')
                              .replace(u'\'', u'\\\'')
                              .replace(u'_', u'\\_'),
                match.group(3)
            ))
            return where
        return value

    def replacePropByColumnName(model, values):
        res = []
        for val in values:
            prop = val.split(' ')[0]
            columnName = model.get_column_by_name(prop).name.__str__()
            val = val.replace(prop, columnName)
            res.append(val)
        return res

    try:
        values = map(escapeSQL, value.split(' and '))
        values = replacePropByColumnName(model, values)
        where = u' and '.join(values)
    except:
        return None
    return where


def quoting(text):
    return quote(text.encode('utf-8'))


def parseHydroXML(id, root):
    html_attr = {'date_time': '-', 'abfluss': '-', 'wasserstand': '-', 'wassertemperatur': '-'}
    for child in root:
        fid = child.attrib['StrNr']
        if fid == id:
            if child.attrib['Typ'] == '10':
                for attr in child:
                    if attr.tag == 'Datum':
                        html_attr['date_time'] = attr.text
                    # Zeit is always parsed after Datum
                    elif attr.tag == 'Zeit':
                        html_attr['date_time'] = html_attr['date_time'] + ' ' + attr.text
                    elif attr.tag == 'Wert':
                        html_attr['abfluss'] = attr.text
                        break
            elif child.attrib['Typ'] == '02':
                for attr in child:
                    if attr.tag == 'Datum':
                        html_attr['date_time'] = attr.text
                    # Zeit is always parsed after Datum
                    elif attr.tag == 'Zeit':
                        html_attr['date_time'] = html_attr['date_time'] + ' ' + attr.text
                    elif attr.tag == 'Wert':
                        html_attr['wasserstand'] = attr.text
                        break
            elif child.attrib['Typ'] == '03':
                for attr in child:
                    if attr.tag == 'Datum':
                        html_attr['date_time'] = attr.text
                    # Zeit is always parsed after Datum
                    elif attr.tag == 'Zeit':
                        html_attr['date_time'] = html_attr['date_time'] + ' ' + attr.text
                    elif attr.tag == 'Wert':
                        html_attr['wassertemperatur'] = attr.text
                        break
    return html_attr


def transformCoordinate(wkt, srid_from, srid_to):
    srid_in = osr.SpatialReference()
    srid_in.ImportFromEPSG(srid_from)
    srid_out = osr.SpatialReference()
    srid_out.ImportFromEPSG(srid_to)
    geom = ogr.CreateGeometryFromWkt(wkt)
    geom.AssignSpatialReference(srid_in)
    geom.TransformTo(srid_out)
    return geom
