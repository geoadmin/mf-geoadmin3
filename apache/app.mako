RewriteEngine On
ExpiresActive On

AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE text/html
AddOutputFilterByType DEFLATE application/javascript

Alias ${base_url} ${base_dir}/

#non cached url's
RewriteRule ^${base_url}/app/(lib|src|style)(.*)$ ${base_dir}/app/$1/$2

#cached url's
RewriteRule ^${base_url}/app-prod/[0-9a-fA-F]*/(lib|src|style)(.*)$ ${base_dir}/app-prod/$1/$2
<LocationMatch ${base_url}/app-prod/[0-9a-fA-F]*/(lib|src|style)>
   ExpiresDefault "now plus 1 year"
   Header merge Cache-Control "public"
</LocationMatch>


