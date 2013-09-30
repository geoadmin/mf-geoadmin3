# -*- coding: utf-8 -*-

from pyramid.i18n import get_localizer, TranslationStringFactory
from chsdi.lib import helpers


def add_renderer_globals(event):
    request = event.get('request')
    if request:
        event['_'] = request.translate
        event['localizer'] = request.localizer
        event['h'] = helpers

tsf = TranslationStringFactory('chsdi')


def add_localizer(event):
    request = event.request
    request._LOCALE_ = helpers.locale_negotiator(request)
    localizer = get_localizer(request)
    request.lang = 'rm' if localizer.locale_name == 'fi' else localizer.locale_name
    request.lang = request.lang.encode('ascii','ignore')

    def auto_translate(string):
        return localizer.translate(tsf(string))
    request.localizer = localizer
    request.translate = auto_translate
