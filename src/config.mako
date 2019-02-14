
<%!
  import re

  QUOTED_STRING_RE = re.compile(
    r"(?P<quote>['\"])(?P<string>.*?)(?<!\\)(?P=quote)")
    
  def quoting(search_string):
          match = QUOTED_STRING_RE.search(search_string)
          if match:
              return match.group('string')
          else:
              return "'" + search_string + "'"

  def camelcase(text):
      parts = text.split('_')
      if len(parts)>1:
         return parts[0] + "".join( [a.capitalize() for a in parts[1:]])
      return text

%>

       configs["${context['staging']}"] = 
       {
       % for key in [k for k in sorted(context.keys()) if k not in ['capture', 'self', 'caller', 'function', 'local'] ]:
         "${key}": ${context[key]| quoting },
       % endfor
       };

