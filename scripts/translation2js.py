# -*- coding: utf-8 -*-
"""
translation2js.py
This script is used to translate the {lang}.json-files. The scripts uses the googlespreadsheet (key : 0AvgmqEgDEiu5dGpFRlpxTU9fVzN3cHNYbWtqOEtKbkE) 
to generate the {lang}.json-files.

Usage: ./env/bin/python translation2js.py /home/ltmoc/mf-geoadmin3/src/locales/ 
"""

import os, sys, codecs, re, gspread

# getting path for the input-file empty.js
try:
    if len(sys.argv) != 2:
         print "You have to specify the path to the directory locales containing empty.json"
         print "python translation2js.py <path to directory locales>"
         sys.exit()
    Path2emptyjs = sys.argv[1]
except:
        sys.exit()

try:
    import yaml
except ImportError:
    print "You need PyYaml. Try 'easy_install pyyaml'"
    sys.exit()

try:
    from yaml import CLoader as Loader
    from yaml import CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

print "Translating... "

class Ddict(dict):
    def __init__(self, default=None):
        self.default = default

    def __getitem__(self, key):
        if not self.has_key(key):
            self[key] = self.default()
        return dict.__getitem__(self, key)

try:
    f = open(__file__.replace('py','yaml'),'r')
    yml = f.read()
except:
    print "Critical error: Cannot read config file. Exit"
    sys.exit()
finally:
    f.close()

config = yaml.load(yml)

# Read GoogleSpreadsheet
print "Connection to GoogleSpreadSheet..."
if 'DRIVE_USER' in os.environ.keys() and  'DRIVE_PWD' in os.environ.keys():
    gc = gspread.login(os.environ['DRIVE_USER'],os.environ['DRIVE_PWD'])
else:
    print "DRIVE_USER and DRIVE_PWD are not set."
    sys.exit(1)

gsheet = gc.open_by_key('0AvgmqEgDEiu5dGpFRlpxTU9fVzN3cHNYbWtqOEtKbkE')
# Conexion sur la premiere feuille
worksheet = gsheet.get_worksheet(0)
list_of_lists = worksheet.get_all_values()
nb_translation_exist = len(list_of_lists)
print "Nb record : " + str(nb_translation_exist)

# Create a multinensional array [lang][msg-ud]  Example: translationDict["it"]["zoomin"]
translationDict = Ddict(dict)

for idRow in range(1,nb_translation_exist):
    for lang in config['langs']:
        if lang == 'de':
            idlang = 1
        elif lang == 'en':
            idlang = 2
        elif lang == 'fr':
            idlang = 3
        elif lang == 'it':
            idlang = 4
        elif lang == 'rm':
            idlang = 5
        translationDict[lang][list_of_lists[idRow][0]] = list_of_lists[idRow][idlang]

try:
    file_emptyjs = codecs.open(Path2emptyjs + config["emptyFilename"],'r', 'utf-8')
except:
    print "is the path to the directory locales correct?"
    sys.exit()

var_arr = []
pattern = r"""(["'])(\\\1|.*?)\1"""

for line in file_emptyjs:
    matches = re.findall(pattern, line)
    if len(matches) == 2:
        msgid, msgstr = matches
        var_arr.append(msgid[1].strip(msgid[0]))

# Writing the translated files
for lang in config["langs"]:
    print "Writing: " + lang + ".json"
    try:
        file_langjs = open(Path2emptyjs + lang + '.json','w')
        file_langcsv = open(Path2emptyjs + lang + '.csv','w')
    except:
        print "is the path to the directory i18n correct?"
        sys.exit()

    # Writing header
    file_langjs.write("{\n")

    int_counter = 1
    isTodo = True
    var_arr.sort()
    for var_msgid in var_arr:
        try:
            myString = "\t\"" + var_msgid + "\": \"" + \
                       translationDict[lang][unicode(var_msgid)] + "\""
            myStringCsv = var_msgid + "," + \
                       translationDict[lang][unicode(var_msgid)]
            file_langjs.write(myString.encode('utf-8'))
            file_langcsv.write(myStringCsv.encode('utf-8'))
            isTodo = False
        except:
            file_langjs.write("\t\"" + var_msgid + "\": \"" + var_msgid + "\"")
            file_langcsv.write(var_msgid + "," + var_msgid)
            isTodo = True

        if int_counter < len(var_arr):
            nextLine = ','
        else:
            nextLine = ''

        if isTodo:
            print var_msgid + " has not been translated in " + lang

        file_langjs.write(nextLine + '\n')
        file_langcsv.write('\n')
        int_counter += 1

     # Writing footer
    file_langjs.write("}\n")

    file_langjs.close()
    file_langcsv.close()

# Finishing
print "Translation accomplished. Verify the generated {lang}.json.files in " + Path2emptyjs 




