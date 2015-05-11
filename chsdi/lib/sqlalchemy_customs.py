# -*- coding: utf-8 -*-

from sqlalchemy.ext.compiler import compiles
from sqlalchemy.sql.expression import FunctionElement

"""
-- custom postgres sql function remove_accents

CREATE OR REPLACE FUNCTION public.remove_accents(string character varying)
  RETURNS character varying AS
$BODY$
    DECLARE
        res varchar;
    BEGIN
        res := replace(string, 'ü', 'ue');
        res := replace(res, 'Ü', 'ue');
        res := replace(res, 'ä', 'ae');
        res := replace(res, 'Ä', 'ae');
        res := replace(res, 'ö', 'oe');
        res := replace(res, 'Ö', 'oe');
        res := replace(res, '(', '_');
        res := replace(res, ')', '_');


        res:= translate(res, 'àáâÀÁÂ', 'aaaaaa');
        res:= translate(res, 'èéêëÈÉÊË', 'eeeeeeee');
        res:= translate(res, 'ìíîïÌÍÎÏ', 'iiiiiiii');
        res:= translate(res, 'òóôÒÓÔ', 'oooooo');
        res:= translate(res, 'ùúûÙÚÛ', 'uuuuuu');
        res:= translate(res, 'ç', 'c');

        RETURN trim(lower(res));
    END;
$BODY$
  LANGUAGE plpgsql IMMUTABLE
  COST 100;
"""
class remove_accents(FunctionElement):
    name = "remove_accents"


@compiles(remove_accents)
def compile(element, compiler, **kw):
    return "remove_accents(%s)" % compiler.process(element.clauses)
