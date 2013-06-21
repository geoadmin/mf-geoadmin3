RewriteEngine On
ExpiresActive On

AddOutputFilterByType DEFLATE text/css 
AddOutputFilterByType DEFLATE text/html

#non cached url's
RewriteRule ^${base_url}/(lib|build|css|app)(.*)$ ${base_dir}/$1/$2

#cached url's
RewriteRule ^${base_url}/[0-9a-fA-F]*/(lib|build|css|app)(.*)$ ${base_dir}/$1/$2
<LocationMatch ${base_url}/[0-9a-fA-F]*/(lib|build|css|app)>
    ExpiresDefault "now plus 1 year"
    Header merge Cache-Control "public"
</LocationMatch>
