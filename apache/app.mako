RewriteEngine On
ExpiresActive On

AddOutputFilterByType DEFLATE text/css 
AddOutputFilterByType DEFLATE text/html

#non cached url's
RewriteRule ^${base_href}(lib|build|css|app)(.*)$ ${base_path}mf-geoadmin3/$1/$2

#cached url's
RewriteRule ^${base_href}[0-9a-fA-F]*/(lib|build|css|app)(.*)$ ${base_path}mf-geoadmin3/$1/$2
<LocationMatch ${base_href}[0-9a-fA-F]*/(lib|build|css|app)>
    ExpiresDefault "now plus 1 year"
    Header merge Cache-Control "public"
</LocationMatch>
