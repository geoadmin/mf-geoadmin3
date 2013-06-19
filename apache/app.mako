RewriteEngine On
ExpiresActive On

AddOutputFilterByType DEFLATE text/css 
AddOutputFilterByType DEFLATE text/html

RewriteRule ^/ltmoc/[0-9a-fA-F]*/(lib|build)(.*)$ /home/ltmoc/mf-geoadmin3/$1/$2
