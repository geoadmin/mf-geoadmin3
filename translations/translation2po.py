# -*- coding: utf-8 -*-
"""
translation2po.py
This script is used to translate the {lang}/chsdi.po-files of CHSDI (more about CHSDI: https://redmine.bgdi.admin.ch/projects/mf-chsdi3).

Author: Tobias Reber
Version: 0.7
Usage: /home/ltgal/mf-chsdi3/buildout/bin/python translation2po.py /home/ltret/mf-chsdi3/chsdi/i18n/
"""

import os, sys, codecs

# get yaml
try:
    import yaml
except ImportError:
    print 'You need PyYaml. Try \'easy_install pyyaml\''
    sys.exit()
try:
    f = open(__file__.replace('py','yaml'),'r')
    yml = f.read()
except:
    print "Critical error: Cannot read config file. Exit"
    sys.exit()
finally:
    f.close()

try:
    from yaml import CLoader as Loader
    from yaml import CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

config = yaml.load(yml)

# vars
var_arr = []
myLangDict = {"de":"German","fr":"French","it":"Italian","fi":"Finnish","en":"English"}

# getting path for the input-file empty_chsdi.po
try:
    if len(sys.argv) != 2:
         print 'You have to specify the path to the directory i18n containing empty_chsdi.po'
         print 'python translation2po.py <path to directory i18n>'
         sys.exit()
    Path2emptypo = sys.argv[1]
except:
        sys.exit()

try:
    import psycopg2
    import psycopg2.extras
    from psycopg2.extensions import register_type, UNICODE, connection
except ImportError:
    print 'You need psycopg2 to run this script. Try to install it with \'easy_install psycopg2\''
    sys.exit()

print 'Translating... '

class Ddict(dict):
    def __init__(self, default=None):
        self.default = default

    def __getitem__(self, key):
        if not self.has_key(key):
            self[key] = self.default()
        return dict.__getitem__(self, key)

try:
   conn=psycopg2.connect(config['dsn'])
   print 'Database connection established'
except:
   print 'Critical Error: Unable to connect to the database. Exit'
   sys.exit()

register_type(UNICODE)
conn.set_client_encoding('UTF8')

# Create a multinensional array [lang][msg-ud]  Example: translationDict["it"]["zoomin"]
translationDict = Ddict(dict)

for lang in config['langs']:
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(config['sql'])
    rows = cur.fetchall()
    for row in rows:
        translationDict[lang][row['msg_id']] = row[lang]

# parsing the file empty.js and write msgids into var_arr
try:
    file_emptypo = codecs.open(Path2emptypo + config['emptyFilename'],'r', 'utf-8')
except:
    print 'is the path to the directory i18n correct?'
    sys.exit()

for line in file_emptypo:
    if (line.startswith("msgid")):
        int_begin = line.find('"') + 1
        int_end = line.rfind('"')
        var_arr.append(line[int_begin:int_end])

# writting file
var_arr.sort()
config["langs"][4]="fi"

for lang in config["langs"]:
    try:
        file_langjs = open(Path2emptypo + lang + '/LC_MESSAGES/chsdi.po','w')
    except:
        print "is the path to the directory i18n correct?"
        sys.exit()

    # writing header
    myString = "# " + myLangDict[lang] + " translations for chsdi.\n"
    myString += "# Copyright (C) 2010 ORGANIZATION\n"
    myString += "# This file is distributed under the same license as the chsdi project.\n"
    myString += "# FIRST AUTHOR <EMAIL@ADDRESS>, 2010.\n"
    myString += "#\n"
    myString += "msgid \"\"\n"
    myString += "msgstr \"\"\n"
    myString += "\"Project-Id-Version: chsdi 0.1\\n\"\n"
    myString += "\"Report-Msgid-Bugs-To: EMAIL@ADDRESS\\n\"\n"
    myString += "\"POT-Creation-Date: 2010-08-03 12:20+0200\\n\"\n"
    myString += "\"PO-Revision-Date: 2010-09-02 10:50+0200\\n\"\n"
    myString += "\"Last-Translator: FULL NAME <EMAIL@ADDRESS>\\n\"\n"
    myString += "\"Language-Team: "+ lang +" <LL@li.org>\\n\"\n"
    myString += "\"Plural-Forms: nplurals=2; plural=(n != 1)\\n\"\n"
    myString += "\"MIME-Version: 1.0\\n\"\n"
    myString += "\"Content-Type: text/plain; charset=utf-8\\n\"\n"
    myString += "\"Content-Transfer-Encoding: 8bit\\n\"\n"
    myString += "\"Generated-By: Babel 0.9.5\\n\"\n\n"

    # switch fi<->rm
    if lang == "fi":
        lang = "rm"

    for var_msgid in var_arr:
        myMsgId = "msgid \"" + var_msgid + "\"\n"
        try:
            myMsgStr = "msgstr \"" + translationDict[lang][unicode(var_msgid)] + "\"\n\n"
        except:
            myMsgStr = "msgstr \"" + var_msgid + "\"\n\n"
            myString += "#. TODO\n"
        myString += myMsgId + myMsgStr

    if lang == "rm":
        lang = "fi"

    file_langjs.write(myString.encode('utf-8'))
    file_langjs.close()


    # written
    print 'Translation in ' + myLangDict[lang] + ' accomplished. Verify ' + Path2emptypo + lang + '/LC_MESSAGES/chsdi.po'

print 'Translation done'
