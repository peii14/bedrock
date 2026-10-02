#!/bin/sh
# Points nginx at the Let's Encrypt certificate when it exists, otherwise at a self signed placeholder,
# so nginx can start before the first certificate is issued. Re-checks every 6 hours and reloads.
set -eu

LE_DIR="/etc/letsencrypt/live/${SERVER_NAME}"
SELF_DIR="/etc/nginx/certs/self-signed"
CURRENT="/etc/nginx/certs/current"

if [ ! -f "$SELF_DIR/fullchain.pem" ]; then
  mkdir -p "$SELF_DIR"
  openssl req -x509 -nodes -newkey rsa:2048 -days 30 -subj "/CN=${SERVER_NAME}" \
    -keyout "$SELF_DIR/privkey.pem" -out "$SELF_DIR/fullchain.pem" 2>/dev/null
fi

pick() {
  if [ -f "$LE_DIR/fullchain.pem" ]; then ln -sfn "$LE_DIR" "$CURRENT"; else ln -sfn "$SELF_DIR" "$CURRENT"; fi
}

pick
(while sleep 6h; do pick && nginx -s reload; done) &
