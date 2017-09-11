# Builds a Docker to deliver dist/
FROM garlictech2/angular2-app-server:v2.1.24
COPY dist/ /usr/share/nginx/html
