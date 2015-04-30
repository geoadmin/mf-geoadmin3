<?xml version="1.0" encoding="UTF-8"?>
<%
  host = pageargs['host']
  list = pageargs['list']
%>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  % for l in list:
  <url> <loc>https://${host}/${l|n,x,trim}</loc> <changefreq>weekly</changefreq> </url>
  % endfor
</urlset>

