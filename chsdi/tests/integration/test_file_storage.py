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
      <coordinates>7.0,46.0,0</coordinates>
    </Point>
  </Placemark>
</kml>'''

URLENCODED_KML = '%3Ckml+xmlns=%22http%3A%2F%2Fwww.opengis.net%2Fkml%2F2.2%22+xmlns%3Axsi%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema-instance%22+xsi%3AschemaLocation%3D%22http%3A%2F%2Fwww.opengis.net%2Fkml%2F2.2+https%3A%2F%2Fdevelopers.google.com%2Fkml%2Fschema%2Fkml22gx.xsd%22%3E%3CDocument%3E%3Cname%3EDrawing%3C%2Fname%3E%3CPlacemark%3E%3CStyle%3E%3CIconStyle%3E%3Cscale%3E0.25%3C%2Fscale%3E%3CIcon%3E%3Chref%3Ehttps%3A%2F%2Fmf-geoadmin3.dev.bgdi.ch%2Fltjeg%2F1432804593%2Fimg%2Fmaki%2Fcircle-24%402x.png%3C%2Fhref%3E%3Cgx%3Aw+xmlns%3Agx%3D%22http%3A%2F%2Fwww.google.com%2Fkml%2Fext%2F2.2%22%3E48%3C%2Fgx%3Aw%3E%3Cgx%3Ah+xmlns%3Agx%3D%22http%3A%2F%2Fwww.google.com%2Fkml%2Fext%2F2.2%22%3E48%3C%2Fgx%3Ah%3E%3C%2FIcon%3E%3ChotSpot+x%3D%2224%22+y%3D%2224%22+xunits%3D%22pixels%22+yunits%3D%22pixels%22+%2F%3E%3C%2FIconStyle%3E%3C%2FStyle%3E%3CPoint%3E%3Ccoordinates%3E6.724650291365927%2C46.804920188214076%3C%2Fcoordinates%3E%3C%2FPoint%3E%3C%2FPlacemark%3E%3CPlacemark%3E%3CStyle%3E%3CIconStyle%3E%3Cscale%3E0.25%3C%2Fscale%3E%3CIcon%3E%3Chref%3Ehttps%3A%2F%2Fmf-geoadmin3.dev.bgdi.ch%2Fltjeg%2F1432804593%2Fimg%2Fmaki%2Fcircle-24%402x.png%3C%2Fhref%3E%3Cgx%3Aw+xmlns%3Agx%3D%22http%3A%2F%2Fwww.google.com%2Fkml%2Fext%2F2.2%22%3E48%3C%2Fgx%3Aw%3E%3Cgx%3Ah+xmlns%3Agx%3D%22http%3A%2F%2Fwww.google.com%2Fkml%2Fext%2F2.2%22%3E48%3C%2Fgx%3Ah%3E%3C%2FIcon%3E%3ChotSpot+x%3D%2224%22+y%3D%2224%22+xunits%3D%22pixels%22+yunits%3D%22pixels%22+%2F%3E%3C%2FIconStyle%3E%3C%2FStyle%3E%3CPoint%3E%3Ccoordinates%3E6.728334379750007%2C46.52607115587267%3C%2Fcoordinates%3E%3C%2FPoint%3E%3C%2FPlacemark%3E%3C%2FDocument%3E%3C%2Fkml%3E'

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
        new_content = resp.body

        self.assertEqual(new_content, VALID_KML)
        self.assertNotEqual(new_content, modified_content)

    def test_file_ie9_fix(self):
        # No content-type default to 'application/vnd.google-earth.kml+xml'
        self.testapp.post('/files', VALID_KML, headers={'X-SearchServer-Authorized': 'true'}, status=200)
        # Having IE9 user-agent makes it working again
        self.testapp.post('/files', URLENCODED_KML, headers={'X-SearchServer-Authorized': 'true', 'User-Agent': 'MSIE 9.0'}, status=200)
