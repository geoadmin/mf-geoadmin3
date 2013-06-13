# -*- coding: utf-8 -*-

import unittest
import math
import random
import time

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
        return 'BBox(%s,%s,%s,%s)' % (self.minx,self.miny,self.maxx,self.maxy)

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
            self.miny <= y and self.maxy >=y):
            return True
        return False

    def create_quads(self):
        newWidth = self.width()/2
        newHeight = self.height()/2
        quad0 = BBox(self.minx, self.miny + newHeight,
                     self.minx + newWidth, self.maxy)
        quad1 = BBox(self.minx + newWidth, self.maxy - newHeight,
                     self.minx + (2*newWidth), self.maxy)
        quad2 = BBox(self.minx, self.maxy - (2*newHeight),
                     self.minx + newWidth, self.maxy - newHeight)
        quad3 = BBox(self.minx + newWidth, self.maxy - (2*newHeight),
                     self.minx + (2*newWidth), self.maxy - newHeight)
        return [quad0, quad1, quad2, quad3]

          

class QuadTree:
    def __init__(self,bbox,levels):
        self.bbox = bbox
        self.levels = int(levels)

    def __repr__(self):
        return 'QuadTree(%s,%s)' % (self.bbox,self.levels)

    '''
    returns resolution of QuadTree.
    Represents the extend of smallest square
    '''
    def resolution(self):
        #assuming quadtree contains box which is a square
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
        return self._multi_points_dia1(bbox)

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
        

_gbox = BBox(420000,30000,900000,510000)
_gqt = QuadTree(_gbox, 20)

def randBBox():
    bb = _gbox
    f = 2000
    x = [random.random() * bb.width(), random.random() * bb.width() / f]
    y = [random.random() * bb.height(), random.random() * bb.height() / f]

    return BBox(bb.minx + x[0],
                bb.miny + y[0],
                bb.minx + sum(x),
                bb.miny + sum(y))
 
class TestBBox(unittest.TestCase):

    def test_contains(self):
        box = _gbox
        self.assertTrue(box.contains(600000,200000))
        self.assertFalse(box.contains(950000,200000))
        self.assertFalse(box.contains(419999,200000))
        self.assertFalse(box.contains(600000,899999))
        self.assertFalse(box.contains(600000,510001))
        self.assertEqual(480000, box.width())
        self.assertEqual(480000, box.height())

    def test_equality(self):
        self.assertEqual(BBox(420000,30000,900000,510000), _gbox)
        self.assertNotEqual(BBox(420001,30000,900000,510000), _gbox)
        self.assertNotEqual(BBox(420000,30001,900000,510000), _gbox)
        self.assertNotEqual(BBox(420000,30000,900001,510000), _gbox)
        self.assertNotEqual(BBox(420000,30000,900000,510001), _gbox)

    def test_createQuads(self):
        box = _gbox.create_quads()
        self.assertEqual(BBox(420000,270000,660000,510000), box[0])
        self.assertEqual(BBox(660000,270000,900000,510000), box[1])
        self.assertEqual(BBox(420000,30000,660000,270000), box[2])
        self.assertEqual(BBox(660000,30000,900000,270000), box[3])

class TestQuadTree(unittest.TestCase):

    def test_resolution(self):
        self.assertEqual(0.45, math.floor(_gqt.resolution()*100)/100)

    #1.4ms per call
    def test_single_algorithm(self):
        #sql test
        self.assertEqual('021211313131313131313', _gqt.xy_to_morton(600000, 200000))

        self.assertEqual('', _gqt.xy_to_morton(600000,899999))
        teststring = '0' * (_gqt.levels + 1)
        self.assertEqual(teststring, _gqt.xy_to_morton(420000.3, 509999.7))
        teststring = ('0' * (_gqt.levels)) + '3'
        self.assertEqual(teststring, _gqt.xy_to_morton(420000.8, 509999.2))

        teststring = '0' + ('1' * (_gqt.levels))
        self.assertEqual(teststring, _gqt.xy_to_morton(899999.8, 509999.9))
        teststring = '0' + ('1' * (_gqt.levels - 1)) + '2'
        self.assertEqual(teststring, _gqt.xy_to_morton(899999.2, 509999.2))

        teststring = '0' + ('2' * (_gqt.levels))
        self.assertEqual(teststring, _gqt.xy_to_morton(420000.3, 30000.4))
        teststring = '0' + ('2' * (_gqt.levels - 1)) + '1'
        self.assertEqual(teststring, _gqt.xy_to_morton(420000.6, 30000.6))

        teststring = '0' + ('3' * (_gqt.levels))
        self.assertEqual(teststring, _gqt.xy_to_morton(899999.8, 30000.4))
        teststring = '0' + ('3' * (_gqt.levels - 1)) + '1'
        self.assertEqual(teststring, _gqt.xy_to_morton(899999.6, 30000.6))

    #1ms per call
    def test_multialgorithm(self):
        self.assertEqual('', _gqt.points_to_morton([Point(600000, 899999), Point(420000.3, 509999.7)]))
        self.assertEqual('0', _gqt.points_to_morton([Point(420000, 30000), Point(900000, 510000)]))
        self.assertEqual('0', _gqt.points_to_morton([Point(659999.8, 269999.8), Point(660000.1, 270000.1)]))
        self.assertEqual('012222222222222222222', _gqt.points_to_morton([Point(660000.2, 270000.2), Point(660000.1, 270000.1)]))
        self.assertEqual('01222222222222222222', _gqt.points_to_morton([Point(660000.2, 270000.2), Point(660000.6, 270000.6)]))
        self.assertEqual('03333333333333333333',
        _gqt.points_to_morton([Point(900000, 30000), Point(899999.2, 30000.8)]))
 
    def test_compare_single_to_multi_algorithm(self):
        self.assertEqual(_gqt.xy_to_morton(600000,899999), _gqt.points_to_morton([Point(600000,899999)]))
        self.assertEqual(_gqt.xy_to_morton(420000.3, 509999.7), _gqt.points_to_morton([Point(420000.3, 509999.7)]))
        self.assertEqual(_gqt.xy_to_morton(420000.6, 509999.4), _gqt.points_to_morton([Point(420000.6, 509999.4)]))
        self.assertEqual(_gqt.xy_to_morton(420000.3, 30000.3),  _gqt.points_to_morton([Point(420000.3, 30000.3)]))
        self.assertEqual(_gqt.xy_to_morton(420000.6, 30000.6),  _gqt.points_to_morton([Point(420000.6, 30000.6)]))
        self.assertEqual(_gqt.xy_to_morton(899999.8, 30000.3),  _gqt.points_to_morton([Point(899999.8, 30000.3)]))
        self.assertEqual(_gqt.xy_to_morton(899999.4, 30000.6),  _gqt.points_to_morton([Point(899999.4, 30000.6)]))
        self.assertEqual(_gqt.xy_to_morton(899999.8, 509999.7), _gqt.points_to_morton([Point(899999.8, 509999.7)]))
        self.assertEqual(_gqt.xy_to_morton(899999.4, 509999.4), _gqt.points_to_morton([Point(899999.4, 509999.4)]))

    def test_single_points_all(self):
        bbox = BBox(380000, 30000, 390000, 35000)
        self.assertEqual('', _gqt._single_points_all(bbox))
        bbox = BBox(420000.1, 30000.1, 899999.9, 509999.9)
        self.assertEqual('0', _gqt._single_points_all(bbox))
        #that's the worst case...smalles bbox but biggest result
        bbox = BBox(659999.9, 269999.9, 660000.1, 270000.1)
        self.assertEqual('0', _gqt._single_points_all(bbox))
        bbox = BBox(420000, 30000, 420000.1, 30000.1)
        self.assertEqual('022222222222222222222', _gqt._single_points_all(bbox))
        bbox = BBox(420000, 30000, 420000.9, 30000.9)
        self.assertEqual('02222222222222222222', _gqt._single_points_all(bbox))
        bbox = BBox(660000.1, 30000.1, 899999.9, 269999.9)
        self.assertEqual('03', _gqt._single_points_all(bbox))
        bbox = BBox(660000.1, 30000.1, 899999.1, 269999.1)
        self.assertEqual('03', _gqt._single_points_all(bbox))

    def _test_compare_with_bbox(self, bbox):
        ref = _gqt._single_points_all(bbox)
        self.assertEqual(ref, _gqt._single_points_dia1(bbox))
        self.assertEqual(ref, _gqt._single_points_dia2(bbox))
        self.assertEqual(ref, _gqt._multi_points_all(bbox))
        self.assertEqual(ref, _gqt._multi_points_dia1(bbox))
        self.assertEqual(ref, _gqt._multi_points_dia2(bbox))

    def tests_algo_random(self):
        self._test_compare_with_bbox(BBox(380000, 30000, 390000, 35000))
        self._test_compare_with_bbox(BBox(420000.1, 30000.1, 899999.9, 509999.9))
        self._test_compare_with_bbox(BBox(659999.9, 269999.9, 660000.1, 270000.1))
        self._test_compare_with_bbox(BBox(420000, 30000, 420000.1, 30000.1))
        self._test_compare_with_bbox(BBox(420000, 30000, 420000.9, 30000.9))
        self._test_compare_with_bbox(BBox(660000.1, 30000.1, 899999.9, 269999.9))
        self._test_compare_with_bbox(BBox(660000.1, 30000.1, 899999.1, 269999.1))

        #well, random in unit tests...i know
        #reasonable here because of extensive tests above
        map(lambda x: self._test_compare_with_bbox(randBBox()), range(20))

    '''
    def test_performance(self):
        boxes = map(lambda x: randBBox(), range(20000))

        t = time.time()
        r = map(lambda bbox: _gqt._single_points_all(bbox), boxes)
        print 'single_points_all took ' + str(time.time() - t)
        
        t = time.time()
        r = map(lambda bbox: _gqt._single_points_dia1(bbox), boxes)
        print 'single_points_dia1 took ' + str(time.time() - t)

        t = time.time()
        r = map(lambda bbox: _gqt._single_points_dia2(bbox), boxes)
        print 'single_points_dia2 took ' + str(time.time() - t)

        t = time.time()
        r = map(lambda bbox: _gqt._multi_points_all(bbox), boxes)
        print 'multi_points_all took ' + str(time.time() - t)

        t = time.time()
        r = map(lambda bbox: _gqt._multi_points_dia1(bbox), boxes)
        print 'multi_points_dia2 took ' + str(time.time() - t)

        t = time.time()
        r = map(lambda bbox: _gqt._multi_points_dia2(bbox), boxes)
        print 'multi_points_dia2 took ' + str(time.time() - t)
    '''

if __name__ == "__main__":
    unittest.main()
    

