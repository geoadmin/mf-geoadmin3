# -*- coding: utf-8 -*-

import unittest
import math
import random
from chsdi.lib import mortonspacekey as msk


class Test_Box(unittest.TestCase):

    def _callFUT(self):
        box = msk.BBox(420000, 30000, 900000, 510000)
        return box

    def test_contains(self):
        box = self._callFUT()
        self.assertTrue(box.contains(600000, 200000))
        self.assertFalse(box.contains(950000, 200000))
        self.assertFalse(box.contains(419999, 200000))
        self.assertFalse(box.contains(600000, 899999))
        self.assertFalse(box.contains(600000, 510001))
        self.assertEqual(480000, box.width())
        self.assertEqual(480000, box.height())

    def test_equality(self):
        box = self._callFUT()
        self.assertEqual(msk.BBox(420000, 30000, 900000, 510000), box)
        self.assertNotEqual(msk.BBox(420001, 30000, 900000, 510000), box)
        self.assertNotEqual(msk.BBox(420000, 30001, 900000, 510000), box)
        self.assertNotEqual(msk.BBox(420000, 30000, 900001, 510000), box)
        self.assertNotEqual(msk.BBox(420000, 30000, 900000, 510001), box)

    def test_createQuads(self):
        box = self._callFUT()
        box = box.create_quads()
        self.assertEqual(msk.BBox(420000, 270000, 660000, 510000), box[0])
        self.assertEqual(msk.BBox(660000, 270000, 900000, 510000), box[1])
        self.assertEqual(msk.BBox(420000, 30000, 660000, 270000), box[2])
        self.assertEqual(msk.BBox(660000, 30000, 900000, 270000), box[3])


class Test_QuadTree(unittest.TestCase):

    def _callFUT(self):
        box = msk.BBox(420000, 30000, 900000, 510000)
        quadtree = msk.QuadTree(box, 20)
        return quadtree

    def randBBox(self):
        box = msk.BBox(420000, 30000, 900000, 510000)
        f = 2000
        x = [random.random() * box.width(), random.random() * box.width() / f]
        y = [random.random() * box.height(), random.random() * box.height() / f]

        return msk.BBox(box.minx + x[0],
                        box.miny + y[0],
                        box.minx + sum(x),
                        box.miny + sum(y))

    def test_resolution(self):
        quadtree = self._callFUT()
        self.assertEqual(0.45, math.floor(quadtree.resolution() * 100) / 100)

    def test_single_algorithm(self):
        quadtree = self._callFUT()
        self.assertEqual('021211313131313131313', quadtree.xy_to_morton(600000, 200000))
        self.assertEqual('', quadtree.xy_to_morton(600000, 899999))
        teststring = '0' * (quadtree.levels + 1)
        self.assertEqual(teststring, quadtree.xy_to_morton(420000.3, 509999.7))
        teststring = ('0' * (quadtree.levels)) + '3'
        self.assertEqual(teststring, quadtree.xy_to_morton(420000.8, 509999.2))

        teststring = '0' + ('1' * (quadtree.levels))
        self.assertEqual(teststring, quadtree.xy_to_morton(899999.8, 509999.9))
        teststring = '0' + ('1' * (quadtree.levels - 1)) + '2'
        self.assertEqual(teststring, quadtree.xy_to_morton(899999.2, 509999.2))

        teststring = '0' + ('2' * (quadtree.levels))
        self.assertEqual(teststring, quadtree.xy_to_morton(420000.3, 30000.4))
        teststring = '0' + ('2' * (quadtree.levels - 1)) + '1'
        self.assertEqual(teststring, quadtree.xy_to_morton(420000.6, 30000.6))

        teststring = '0' + ('3' * (quadtree.levels))
        self.assertEqual(teststring, quadtree.xy_to_morton(899999.8, 30000.4))
        teststring = '0' + ('3' * (quadtree.levels - 1)) + '1'
        self.assertEqual(teststring, quadtree.xy_to_morton(899999.6, 30000.6))

    # 1ms per call
    def test_multialgorithm(self):
        quadtree = self._callFUT()
        self.assertEqual('', quadtree.points_to_morton([msk.Point(600000, 899999), msk.Point(420000.3, 509999.7)]))
        self.assertEqual('0', quadtree.points_to_morton([msk.Point(420000, 30000), msk.Point(900000, 510000)]))
        self.assertEqual('0', quadtree.points_to_morton([msk.Point(659999.8, 269999.8), msk.Point(660000.1, 270000.1)]))
        self.assertEqual('012222222222222222222', quadtree.points_to_morton([msk.Point(660000.2, 270000.2), msk.Point(660000.1, 270000.1)]))
        self.assertEqual('01222222222222222222', quadtree.points_to_morton([msk.Point(660000.2, 270000.2), msk.Point(660000.6, 270000.6)]))
        self.assertEqual('03333333333333333333',
                         quadtree.points_to_morton([msk.Point(900000, 30000), msk.Point(899999.2, 30000.8)]))

    def test_compare_single_to_multi_algorithm(self):
        quadtree = self._callFUT()
        self.assertEqual(quadtree.xy_to_morton(600000, 899999), quadtree.points_to_morton([msk.Point(600000, 899999)]))
        self.assertEqual(quadtree.xy_to_morton(420000.3, 509999.7), quadtree.points_to_morton([msk.Point(420000.3, 509999.7)]))
        self.assertEqual(quadtree.xy_to_morton(420000.6, 509999.4), quadtree.points_to_morton([msk.Point(420000.6, 509999.4)]))
        self.assertEqual(quadtree.xy_to_morton(420000.3, 30000.3), quadtree.points_to_morton([msk.Point(420000.3, 30000.3)]))
        self.assertEqual(quadtree.xy_to_morton(420000.6, 30000.6), quadtree.points_to_morton([msk.Point(420000.6, 30000.6)]))
        self.assertEqual(quadtree.xy_to_morton(899999.8, 30000.3), quadtree.points_to_morton([msk.Point(899999.8, 30000.3)]))
        self.assertEqual(quadtree.xy_to_morton(899999.4, 30000.6), quadtree.points_to_morton([msk.Point(899999.4, 30000.6)]))
        self.assertEqual(quadtree.xy_to_morton(899999.8, 509999.7), quadtree.points_to_morton([msk.Point(899999.8, 509999.7)]))
        self.assertEqual(quadtree.xy_to_morton(899999.4, 509999.4), quadtree.points_to_morton([msk.Point(899999.4, 509999.4)]))

    def test_single_points_all(self):
        quadtree = self._callFUT()
        bbox = msk.BBox(380000, 30000, 390000, 35000)
        self.assertEqual('', quadtree._single_points_all(bbox))
        bbox = msk.BBox(420000.1, 30000.1, 899999.9, 509999.9)
        self.assertEqual('0', quadtree._single_points_all(bbox))
        # that's the worst case...smalles bbox but biggest result
        bbox = msk.BBox(659999.9, 269999.9, 660000.1, 270000.1)
        self.assertEqual('0', quadtree._single_points_all(bbox))
        bbox = msk.BBox(420000, 30000, 420000.1, 30000.1)
        self.assertEqual('022222222222222222222', quadtree._single_points_all(bbox))
        bbox = msk.BBox(420000, 30000, 420000.9, 30000.9)
        self.assertEqual('02222222222222222222', quadtree._single_points_all(bbox))
        bbox = msk.BBox(660000.1, 30000.1, 899999.9, 269999.9)
        self.assertEqual('03', quadtree._single_points_all(bbox))
        bbox = msk.BBox(660000.1, 30000.1, 899999.1, 269999.1)
        self.assertEqual('03', quadtree._single_points_all(bbox))

    def _test_compare_with_bbox(self, bbox):
        quadtree = self._callFUT()
        ref = quadtree._single_points_all(bbox)
        self.assertEqual(ref, quadtree._single_points_dia1(bbox))
        self.assertEqual(ref, quadtree._single_points_dia2(bbox))
        self.assertEqual(ref, quadtree._multi_points_all(bbox))
        self.assertEqual(ref, quadtree._multi_points_dia1(bbox))
        self.assertEqual(ref, quadtree._multi_points_dia2(bbox))

    def tests_algo_random(self):
        self._test_compare_with_bbox(msk.BBox(380000, 30000, 390000, 35000))
        self._test_compare_with_bbox(msk.BBox(420000.1, 30000.1, 899999.9, 509999.9))
        self._test_compare_with_bbox(msk.BBox(659999.9, 269999.9, 660000.1, 270000.1))
        self._test_compare_with_bbox(msk.BBox(420000, 30000, 420000.1, 30000.1))
        self._test_compare_with_bbox(msk.BBox(420000, 30000, 420000.9, 30000.9))
        self._test_compare_with_bbox(msk.BBox(660000.1, 30000.1, 899999.9, 269999.9))
        self._test_compare_with_bbox(msk.BBox(660000.1, 30000.1, 899999.1, 269999.1))

        map(lambda x: self._test_compare_with_bbox(self.randBBox()), range(20))
