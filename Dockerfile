# nginx state for serving content
FROM nginx:alpine

COPY ./nginx /etc/nginx/conf.d
RUN rm -rf /usr/share/nginx/html/*
COPY ./dist /usr/share/nginx/html/
EXPOSE 80
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]