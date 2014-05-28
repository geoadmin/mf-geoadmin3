#-*- coding: utf-8 -*-

from pyramid.httpexceptions import HTTPBadRequest

from chsdi.models.bod import Topics


class MapNameValidation(object):

    def hasMap(self, db, mapName):
        availableMaps = [q[0] for q in db.query(Topics.id)]
        # FIXME add this info in DB
        availableMaps.append('all')
        availableMaps.append('api')
        availableMaps.append('api-free')
        availableMaps.append('api-notfree')
        availableMaps.append('swissmaponline')

        if mapName not in availableMaps:
            raise HTTPBadRequest('The map you provided does not exist')
