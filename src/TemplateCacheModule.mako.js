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
  _partials = {}
  for p in partials.split(' '):
      f = file(os.path.join(basedir, p))
      content = unicode(f.read().decode('utf8'))
      content = re.sub(r'>\s*<' , '><', content)
      content = re.sub(r'\s\s+', ' ', content)
      content = re.sub(r'\n', '', content)
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
