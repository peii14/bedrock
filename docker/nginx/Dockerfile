# syntax=docker/dockerfile:1.7
# Build from the repo root: docker build -f docker/nginx/Dockerfile .
FROM nginx:1.31.6-alpine
RUN apk add --no-cache openssl \
  && rm -f /etc/nginx/conf.d/default.conf \
  && mkdir -p /var/www/acme /etc/nginx/certs
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/snippets/ /etc/nginx/snippets/
COPY docker/nginx/templates/ /etc/nginx/templates/
COPY --chmod=755 docker/nginx/entrypoint/40-certificates.sh /docker-entrypoint.d/40-certificates.sh
EXPOSE 80 443 443/udp
HEALTHCHECK --interval=15s --timeout=3s CMD wget -qO- http://127.0.0.1/nginx-health || exit 1
