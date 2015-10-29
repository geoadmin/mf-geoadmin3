# -*- coding: utf-8 -*-

def intVersion(ver):
    pos = str.find(str(ver),'.')
    if pos > 0:
        ver_tmp = ver[0:pos]
        return int(ver_tmp)
    else:
        return int(ver)

def bCheckIfUrlHasChanged(driver):
    version = intVersion(driver.desired_capabilities['version'])
    if (driver.name == "internet explorer" and version == 9):
        # With IE 9, url never changed
        #print "IE 9, on ne cherche pas dans l'url"
        return 0
    else:
        return 1

