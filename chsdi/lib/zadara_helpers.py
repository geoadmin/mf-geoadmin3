# -*- coding: utf-8 -*-

import os
import glob

from chsdi.lib.helpers import make_api_url


def hbytes(num):
    for x in ['bytes', 'KB', 'MB', 'GB']:
        if num < 1024.0:
            return "%3.1f %s" % (num, x)
        num /= 1024.0
    return "%3.1f %s" % (num, 'TB')


def find_files(request, layerBodId, FilePattern):
    settings = request.registry.settings
    downloadFolder = ''.join((settings['zadara_dir'], layerBodId))
    for filePath in glob.glob('/'.join((downloadFolder, FilePattern))):
        fileName = os.path.basename(filePath)
        fileSize = os.path.getsize(filePath)
        fileApiUrl = ''.join((make_api_url(request, True), '/downloads/', layerBodId, '/', fileName))
        yield {'name': fileName, 'size': fileSize, 'url': fileApiUrl}
