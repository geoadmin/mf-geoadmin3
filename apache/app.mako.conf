RewriteEngine On
ExpiresActive On

AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE text/html
AddOutputFilterByType DEFLATE application/javascript

Alias ${base_url}/app ${base_dir}/app
Alias ${base_url}/app-prod ${base_dir}/app-prod

# Cached resources
RewriteRule ^${base_url}/app-prod/[0-9a-fA-F]*/(lib|src|style)(.*)$ ${base_dir}/app-prod/$1/$2
<LocationMatch ${base_url}/app-prod/[0-9a-fA-F]*/(lib|src|style)>
   ExpiresDefault "now plus 1 year"
   Header merge Cache-Control "public"
</LocationMatch>
