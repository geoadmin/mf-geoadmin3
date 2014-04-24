#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Das Modul L{xml2dict} implementiert einen objektorientierten Ansatz
für XML-Dateien. Der Quellcode wurde von URL [1] übernommen und wurde
für die Bedürfnisse minimal angepasst.

@see:
    - URL [1]: U{http://code.google.com/p/xml2dict/}
@copyright: Thunder Chen<nkchenz@gmail.com> 2007.9.1
@author: Thunder Chen
@contact: U{mailto:nkchenz@gmail.com}
"""
try:
    import xml.etree.ElementTree as ET
except:
    import cElementTree as ET # for 2.5
    
try:
    from django.utils.encoding import smart_str, smart_unicode
    has_django = True
except ImportError:
    has_django = False

from object_dict import object_dict 
import re

class XML2Dict(object):

    def __init__(self):
        pass

    def _parse_node(self, node):
        node_tree = object_dict()
        # Save attrs and text, hope there will not be a child with same name
        if node.text:
            node_tree.value = node.text
        for (k,v) in node.attrib.items():
            k,v = self._namespace_split(k, object_dict({'value':v}))
            node_tree[k] = v
        #Save childrens
        for child in node.getchildren():
            tag, tree = self._namespace_split(child.tag, self._parse_node(child))
            if  tag not in node_tree: # the first time, so store it in dict
                node_tree[tag] = tree
                continue
            old = node_tree[tag]
            if not isinstance(old, list):
                node_tree.pop(tag)
                node_tree[tag] = [old] # multi times, so change old dict to a list       
            node_tree[tag].append(tree) # add the new one      

        return  node_tree


    def _namespace_split(self, tag, value):
        """
        Split the tag  '{http://cs.sfsu.edu/csc867/myscheduler}patients'
        C{ns = http://cs.sfsu.edu/csc867/myscheduler}
        C{name = patients}
        """
        result = re.compile("\{(.*)\}(.*)").search(tag)
        if result:
            value.namespace, tag = result.groups()    
        return (tag, value)

    def parse(self, file):
        """parse a xml file to a dict"""
        f = open(file, 'r')
        return self.fromstring(f.read()) 

    def fromstring(self, s):
        """parse a string"""
        if has_django:
            s = smart_str(s)
        t = ET.fromstring(s)
        root_tag, root_tree = self._namespace_split(t.tag, self._parse_node(t))
        return object_dict({root_tag: root_tree})

