<%doc>
    This is a Mako template that generates Angular code putting the
    contents of HTML partials into Angular's $templateCache. The
    generated code is then built with the rest of JavaScript code.
    The generated script is not used at all in development mode,
    where HTML partials are loaded through Ajax.
</%doc>
<%
  import re
  import os
  import sys
  _partials = {}
  for p in partials.split(' '):
      f = open(os.path.join(basedir, p), 'r')
      if sys.version_info[0] <= 2:
          content = unicode(f.read().decode('utf8'))
      else:
          content = f.read()
      content = re.sub(r'>\s*<' , '><', content)
      content = re.sub(r'\s\s+', ' ', content)
      content = re.sub(r'\n', '', content)
      content = re.sub(r"'", "\\'", content)
      _partials[p] = content
%>\
// Generated code. Do not edit.
(function() {
  goog.provide('__ga_template_cache__');
  goog.require('ga');
  angular.module('ga').run(['$templateCache', function($templateCache) {
% for partial in _partials:
  $templateCache.put('${partial}', '${_partials[partial]}');
%endfor
  }]);
})();
