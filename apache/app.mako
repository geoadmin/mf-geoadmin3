RewriteEngine On
ExpiresActive On

AddOutputFilterByType DEFLATE text/css 
AddOutputFilterByType DEFLATE text/html

RewriteRule ^${base_href}[0-9a-fA-F]*/(lib|build)(.*)$ ${base_path}mf-geoadmin3/$1/$2
