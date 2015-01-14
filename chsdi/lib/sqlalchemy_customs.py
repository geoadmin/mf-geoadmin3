# -*- coding: utf-8 -*-

from sqlalchemy.ext.compiler import compiles
from sqlalchemy.sql.expression import FunctionElement


class remove_accents(FunctionElement):
    name = "remove_accents"


@compiles(remove_accents)
def compile(element, compiler, **kw):
    return "remove_accents(%s)" % compiler.process(element.clauses)
