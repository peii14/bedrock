# syntax=docker/dockerfile:1.7
# Build from the repo root: docker build -f docker/nginx/Dockerfile .
# Unprivileged image: runs as uid 101 and listens on 8080/8443; compose maps 80/443 onto them.
FROM nginxinc/nginx-unprivileged:1.31.6-alpine
USER root
RUN apk upgrade --no-cache \
  && apk add --no-cache openssl \
  && rm -f /etc/nginx/conf.d/default.conf \
  && mkdir -p /var/www/acme /etc/nginx/certs \
  && chown -R 101:101 /etc/nginx/certs /var/www/acme
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/snippets/ /etc/nginx/snippets/
COPY docker/nginx/templates/ /etc/nginx/templates/
COPY --chmod=755 docker/nginx/entrypoint/40-certificates.sh /docker-entrypoint.d/40-certificates.sh
USER 101
EXPOSE 8080 8443 8443/udp
HEALTHCHECK --interval=15s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/nginx-health || exit 1
