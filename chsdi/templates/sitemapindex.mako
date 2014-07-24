<?xml version="1.0" encoding="UTF-8"?>
<%
  host = pageargs['host']
  sitemaps = pageargs['sitemaps']
%>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  % for sm in sitemaps:
  <sitemap>
    <loc>http://${host}/${sm}</loc>
  </sitemap>
  % endfor
</sitemapindex>

