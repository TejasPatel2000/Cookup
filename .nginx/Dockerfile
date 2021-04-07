FROM nginx:stable-alpine
WORKDIR /etc/nginx/

COPY nginx-default.conf.template /etc/nginx/conf.d/default.conf.template

COPY ./docker-entrypoint.sh ./
RUN chmod +x /etc/nginx/docker-entrypoint.sh

ENTRYPOINT ["/etc/nginx/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
