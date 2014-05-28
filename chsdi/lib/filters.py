# -*- coding: utf-8 -*-

from sqlalchemy.sql.expression import cast
from sqlalchemy import Text, or_


def full_text_search(query, ormColumns, searchText):
    ''' Given a list of columns and a searchText, returns
    a filtered query '''
    def ilike_search(col):
        if col is not None:
            return cast(col, Text).ilike('%%%s%%' % searchText)
    return query.filter(or_(
        *map(ilike_search, ormColumns)
    ))


def filter_by_geodata_staging(query, ormColumn, staging):
    ''' Applies a filter on geodata based on application
    staging '''
    return {
        'test': query,
        'integration': query.filter(or_(
                                    ormColumn == 'integration',
                                    ormColumn == 'prod'
                                    )),
        'prod': query.filter(ormColumn == staging)
    }[staging]


def filter_by_map_name(query, ormColumn, mapName):
    ''' Applies a map/topic filter '''
    if mapName != 'all':
        return query.filter(or_(
            ormColumn.ilike('%%%s%%' % mapName),
            ormColumn.ilike('%%%s%%' % 'ech')  # ech whitelist hack
        ))
    return query
