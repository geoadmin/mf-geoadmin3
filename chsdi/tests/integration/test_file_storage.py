# -*- coding: utf-8 -*-

import os
from chsdi.tests.integration import TestsBase


WRONG_CONTENT_TYPE = 'nasty type'


VALID_KML = '''<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Placemark>
    <name>Simple placemark</name>
    <description>Attached to the ground. Intelligently places itself
       at the height of the underlying terrain.</description>
    <Point>
      <coordinates>-122.0822035425683,37.42228990140251,0</coordinates>
    </Point>
  </Placemark>
</kml>'''

NOT_WELL_FORMED_KML = '''<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
    <name>Simple placemark</name
    <description>Attached to the ground. Intelligently places itself
       at the height of the underlying terrain.</description>
      <coordinates>-122.0822035425683,37.42228990140251,0</coordinates>
    </Point>
  <Placemark>
</kml>'''


class TestFileView(TestsBase):

    def setUp(self):
        super(TestFileView, self).setUp()
        self.headers = {'Content-Type': 'application/vnd.google-earth.kml+xml',
                        'X-SearchServer-Authorized': 'true'}

    def test_create_kml(self):
        resp = self.testapp.post('/files', VALID_KML, headers=self.headers, status=200)
        self.assertIn('adminId', resp.json)

    def test_file_not_authorized(self):
        self.testapp.post('/files', VALID_KML, headers={'X-SearchServer-Authorized': 'false',
                                                        'Content-Type': 'application/vnd.google-earth.kml+xml'}, status=403)

    def test_file_invalid_content_type(self):
        self.testapp.post('/files', VALID_KML, headers={'X-SearchServer-Authorized': 'true',
                                                        'Content-Type': WRONG_CONTENT_TYPE}, status=415)

    def test_file_not_well_formed_kml(self):
        self.testapp.post('/files', NOT_WELL_FORMED_KML, headers=self.headers, status=415)

    def test_update_kml(self):
        resp = self.testapp.post('/files', VALID_KML, headers=self.headers, status=200)
        admin_id = resp.json['adminId']

        resp = self.testapp.post('/files/%s' % admin_id, VALID_KML, headers=self.headers, status=200)
        self.assertTrue(resp.json['status'], 'updated')
        self.assertEqual(admin_id, resp.json['adminId'])

    def test_forked_kml(self):
        resp = self.testapp.post('/files', VALID_KML, headers=self.headers, status=200)
        admin_id = resp.json['adminId']
        file_id = resp.json['fileId']

        resp = self.testapp.post('/files/%s' % file_id, VALID_KML, headers=self.headers, status=200)
        self.assertEqual(resp.json['status'], 'copied')
        self.assertNotEqual(admin_id, resp.json['adminId'])
        self.assertNotEqual(file_id, resp.json['fileId'])

    def test_delete_kml(self):
        resp = self.testapp.post('/files', VALID_KML, headers=self.headers, status=200)
        admin_id = resp.json['adminId']
        file_id = resp.json['fileId']

        # delete with file_id
        resp = self.testapp.delete('/files/%s' % file_id, headers=self.headers, status=401)

        # Delete with admin_id
        resp = self.testapp.delete('/files/%s' % admin_id, headers=self.headers, status=200)
        self.assertTrue(resp.json['success'])

        resp = self.testapp.delete('/files/%s' % 'this-file-is-nothing', headers=self.headers, status=404)

    def test_file_too_big_kml(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        with open(os.path.join(current_dir, 'big.kml')) as f:
            data = f.read()
        resp = self.testapp.post('/files', data, headers=self.headers, status=413)
        self.assertIn('File size exceed', resp.body)

    def test_update_copy_kml(self):
        # First request, to get ids
        resp = self.testapp.post('/files', VALID_KML, headers=self.headers, status=200)
        admin_id = resp.json['adminId']
        file_id = resp.json['fileId']

        # get file
        resp = self.testapp.get('/files/%s' % file_id, headers=self.headers, status=200)
        orig_data = resp.body
        self.assertEqual(orig_data, VALID_KML)

        # update with file_id, should copy
        new_content = VALID_KML.replace('Simple placemark', 'Not so simple placemark')
        resp = self.testapp.post('/files/%s' % file_id, new_content, headers=self.headers, status=200)
        new_admin_id = resp.json['adminId']
        new_file_id = resp.json['fileId']
        modified_content = resp.body

        self.assertNotEqual(admin_id, new_admin_id)
        self.assertNotEqual(file_id, new_file_id)

        # re-get first file
        resp = self.testapp.get('/files/%s' % file_id, headers=self.headers, status=200)
        orig_data = resp.body

        self.assertEqual(orig_data, VALID_KML)
        self.assertNotEqual(orig_data, modified_content)
