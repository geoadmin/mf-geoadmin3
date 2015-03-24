# -*- coding: utf-8 -*-

import math
from functools import reduce


class Point:

    def __init__(self, x, y):
        self.x = float(x)
        self.y = float(y)


class BBox:

    def __init__(self, minx, miny, maxx, maxy):
        self.minx = float(minx)
        self.miny = float(miny)
        self.maxx = float(maxx)
        self.maxy = float(maxy)

    def __repr__(self):
        return 'BBox(%s,%s,%s,%s)' % (self.minx, self.miny, self.maxx, self.maxy)

    def __eq__(self, other):
        if (self.minx == other.minx and
                self.miny == other.miny and
                self.maxx == other.maxx and
                self.maxy == other.maxy):
            return True
        return False

    def width(self):
        return self.maxx - self.minx

    def height(self):
        return self.maxy - self.miny

    def pointAt(self, i):
        if i == 0:
            return Point(self.maxx, self.maxy)
        if i == 1:
            return Point(self.maxx, self.miny)
        if i == 2:
            return Point(self.minx, self.miny)
        return Point(self.minx, self.maxy)

    def contains(self, x, y):
        if (self.minx <= x and self.maxx >= x and
                self.miny <= y and self.maxy >= y):
            return True
        return False

    def getIntersection(self, other):
        if (other.maxx < self.minx or
                other.minx > self.maxx or
                other.maxy < self.miny or
                other.miny > self.maxy):
            return other

        retBox = other

        if (other.maxx > self.maxx):
            retBox.maxx = self.maxx
        if (other.minx < self.minx):
            retBox.minx = self.minx
        if (other.maxy > self.maxy):
            retBox.maxy = self.maxy
        if (other.miny < self.miny):
            retBox.miny = self.miny

        return retBox

    def create_quads(self):
        newWidth = self.width() / 2
        newHeight = self.height() / 2
        quad0 = BBox(self.minx, self.miny + newHeight,
                     self.minx + newWidth, self.maxy)
        quad1 = BBox(self.minx + newWidth, self.maxy - newHeight,
                     self.minx + (2 * newWidth), self.maxy)
        quad2 = BBox(self.minx, self.maxy - (2 * newHeight),
                     self.minx + newWidth, self.maxy - newHeight)
        quad3 = BBox(self.minx + newWidth, self.maxy - (2 * newHeight),
                     self.minx + (2 * newWidth), self.maxy - newHeight)
        return [quad0, quad1, quad2, quad3]


class QuadTree:

    def __init__(self, bbox, levels):
        self.bbox = bbox
        self.levels = int(levels)

    def __repr__(self):
        return 'QuadTree(%s,%s)' % (self.bbox, self.levels)

    '''
    returns resolution of QuadTree.
    Represents the extend of smallest square
    '''

    def resolution(self):
        # assuming quadtree contains box which is a square
        return self.bbox.width() / math.pow(2, self.levels)

    '''
    creates the morton key space for a point
    returns empty string if point is not inside outer limits
    Note: returned key always has level length
    '''

    def xy_to_morton(self, x, y):
        res = '0'
        if not self.bbox.contains(x, y):
            return ''
        curQuads = self.bbox.create_quads()
        for i in range(self.levels):
            for j in range(4):
                if curQuads[j].contains(x, y):
                    res += str(j)
                    curQuads = curQuads[j].create_quads()
                    break
        return res

    '''
    takes array of points and returns morton space key
    which contains _all_ points
    Note: returned key can have any length up to level
    '''

    def points_to_morton(self, points):
        def contains_all_points(bbox, points):
            return reduce(lambda res, p: (res and bbox.contains(p.x, p.y)),
                          points, True)

        res = '0'
        if not contains_all_points(self.bbox, points):
            return ''

        curQuads = self.bbox.create_quads()
        for i in range(self.levels):
            has_quad = False
            for j in range(4):
                if contains_all_points(curQuads[j], points):
                    has_quad = True
                    res += str(j)
                    curQuads = curQuads[j].create_quads()
                if (len(res) > self.levels):
                    return res
            if not has_quad:
                return res
        return res

    def bbox_to_morton(self, bbox):
        '''
        We either take the intersection of bbox with
        own quadindex bbox or, when there's no
        intersection, we directly use the bbox
        '''
        intbox = self.bbox.getIntersection(bbox)
        return self._multi_points_dia1(intbox)

    '''
    next 6 functions should deliver the same result
      -> the morton space key of the the quad that fully contains the bbox
    functions written to
     a) verify different strategies (3 for each base algorithm)
     b) compare performance
    '''

    '''
    get key for each corner point of bounding box
    return key which is common to all results (from the start)
    '''

    def _getCommonKey(self, keys):
        res = ''
        for i in range(self.levels + 1):
            before = len(res)
            if not reduce(lambda has, k: (has and len(k) > i), keys, True):
                return res
            res += reduce(lambda char, k: '' if char != k[i] else k[i],
                          keys[1:], keys[0][i])
            if before == len(res):
                return res
        return res

    def _single_points_all(self, bbox):
        return self._getCommonKey(map(lambda i: self.xy_to_morton(bbox.pointAt(i).x, bbox.pointAt(i).y),
                                      range(4)))

    def _single_points_dia1(self, bbox):
        return self._getCommonKey([self.xy_to_morton(bbox.pointAt(0).x,
                                                     bbox.pointAt(0).y),
                                   self.xy_to_morton(bbox.pointAt(2).x,
                                                     bbox.pointAt(2).y)])

    def _single_points_dia2(self, bbox):
        return self._getCommonKey([self.xy_to_morton(bbox.pointAt(1).x,
                                                     bbox.pointAt(1).y),
                                   self.xy_to_morton(bbox.pointAt(3).x,
                                                     bbox.pointAt(3).y)])

    def _multi_points_all(self, bbox):
        return self.points_to_morton(map(lambda i: bbox.pointAt(i), range(4)))

    def _multi_points_dia1(self, bbox):
        return self.points_to_morton([bbox.pointAt(0), bbox.pointAt(2)])

    def _multi_points_dia2(self, bbox):
        return self.points_to_morton([bbox.pointAt(1), bbox.pointAt(3)])
