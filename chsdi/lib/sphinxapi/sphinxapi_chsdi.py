# -*- coding: utf-8 -*-

from chsdi.lib.sphinxapi import sphinxapi

class ChsdiSphinxClient(sphinxapi.SphinxClient):
    ''' 
        This class is used to change the formatting of the results on the fly.
    '''

    def __init__(self):
        super(ChsdiSpinxClient, self).__init__()
