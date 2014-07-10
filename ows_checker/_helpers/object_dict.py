#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Das Modul L{object_dict} implementiert einen objektorientierten Ansatz
für C{dict}-Objekte. Der Quellcode wurde von URL [1] übernommen.

@see:
    - URL [1]: U{http://code.google.com/p/xml2dict/}

@copyright: Thunder Chen<nkchenz@gmail.com> 2007.9.1
@author: Thunder Chen
@contact: U{mailto:nkchenz@gmail.com}
@note: Provided as-is; use at your own risk; no warranty; no promises; enjoy!
"""

class object_dict(dict):
    """
    object view of dict, you can
     
    >>> a = object_dict()
    >>> a.fish = 'fish'
    >>> a['fish']
    'fish'
    >>> a['water'] = 'water'
    >>> a.water
    'water'
    >>> a.test = {'value': 1}
    >>> a.test2 = object_dict({'name': 'test2', 'value': 2})
    >>> a.test, a.test2.name, a.test2.value
    (1, 'test2', 2)
    """
    def __init__(self, initd=None):
        if initd is None:
            initd = {}
        dict.__init__(self, initd)

    def __getattr__(self, item):
        d = self.__getitem__(item)
        # if value is the only key in object, you can omit it
        if isinstance(d, dict) and 'value' in d and len(d) == 1:
            return d['value']
        
        else:
            return d

    def __setattr__(self, item, value):
        self.__setitem__(item, value)
        
    # Fuer pickle
    
    def __getstate__(self):
        result = self.__dict__.copy()
        return result
    
    def __setstate__(self, dict):
        self.__dict__ = dict

def _test():
    import doctest
    doctest.testmod()

if __name__ == "__main__":
    _test()
