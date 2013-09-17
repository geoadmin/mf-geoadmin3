# -*- coding: utf-8 -*-

<% 
  c = pageargs['feature']
  lang = request.lang
  attribution = pageargs.get('attribution')
  fullName = pageargs.get('fullName')
%>

<div class="htmlpopup-content">
  <span style="font-weight:bold;">${fullName}</span> (${attribution})
</div>
<div class="htmlpopup-content">
  <span style="font-weight:bold;">${_('Information')}</span>
  <br>
  <table border="0" cellspacing="0" cellpadding="1" width="400px" style="font-size: 100%;" padding="1 1 1 1">
    ${self.table_body(c, lang)}
  </table>
</div>
