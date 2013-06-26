RewriteEngine On
ExpiresActive On

AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE text/html

#non cached url's
RewriteRule ^${base_url}/app/(css/lib/src)(.*)$ ${base_dir}/app/$1/$2

#cached url's
RewriteRule ^${base_url}/app-prod/[0-9a-fA-F]*/(css/lib/src)(.*)$ ${base_dir}/app-prod/$1/$2
<LocationMatch ${base_url}/app-prod/[0-9a-fA-F]*/(css/lib/src)>
   ExpiresDefault "now plus 1 year"
   Header merge Cache-Control "public"
</LocationMatch>


