# -*- coding: utf-8 -*-

<% 
  c = pageargs['feature']
  lang = request.lang
%>
<table border="0" cellspacing="0" cellpadding="1" width="400px" style="font-size: 100%;" padding="1 1 1 1">
  ${self.table_body(c, lang)}
</table>
