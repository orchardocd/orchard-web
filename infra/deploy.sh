#!/usr/bin/env bash
set -euo pipefail

# Builds the site and ships it to the Hetzner server, along with the Caddyfile
# the server runs on. Uploads and the database live outside the app directory
# and are symlinked in, so a redeploy never touches editor content.

cd "$(dirname "$0")"
INFRA=$PWD
WEB=$INFRA/../web
KEY=$INFRA/deploy_key
REGION=us-east-1

tofu init -input=false >/dev/null

HCLOUD_TOKEN=$(aws secretsmanager get-secret-value --region $REGION \
  --secret-id prod/orchard-web/hetzner --query SecretString --output text \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")
export HCLOUD_TOKEN

IP=$(tofu output -raw ipv4)

# The Caddyfile opens with the site address, the hostname the server answers on.
HOST=$(awk 'NR == 1 { print $1 }' "$INFRA/Caddyfile")

SSH="ssh -i $KEY -o StrictHostKeyChecking=no root@$IP"
RSH="ssh -i $KEY -o StrictHostKeyChecking=no"

if [ -z "${PREBUILT:-}" ]; then
  echo "==> building"
  (cd "$WEB" && pnpm build >/dev/null)
fi

echo "==> syncing application to $IP"
$SSH 'install -d -o orchard -g orchard /srv/orchard/app'
rsync -az --delete --exclude media --exclude documents --exclude videos --exclude '.next/static' \
  -e "$RSH" "$WEB/.next/standalone/" "root@$IP:/srv/orchard/app/"
rsync -az -e "$RSH" "$WEB/.next/static/" "root@$IP:/srv/orchard/app/.next/static/"
rsync -az -e "$RSH" "$WEB/public/" "root@$IP:/srv/orchard/app/public/"

echo "==> relinking persistent data"
$SSH 'cd /srv/orchard/app && for d in media documents videos; do rm -rf $d; ln -s /srv/orchard/data/$d $d; done; chown -R orchard:orchard /srv/orchard'

echo "==> updating the web server configuration"
$SSH 'cat > /etc/caddy/Caddyfile && chmod 644 /etc/caddy/Caddyfile' < "$INFRA/Caddyfile"
$SSH 'caddy validate --config /etc/caddy/Caddyfile && systemctl reload caddy'

echo "==> restarting"
$SSH 'systemctl restart orchard-web && sleep 5 && systemctl is-active orchard-web'
$SSH 'curl -s -o /dev/null -w "app responds %{http_code}\n" http://127.0.0.1:3000/'

echo "==> checking what search engines are told"
PAGE_HEADERS=$(curl -fsS -o /dev/null -D - "https://$HOST/")
ADMIN_HEADERS=$(curl -fsS -o /dev/null -D - "https://$HOST/admin")

if grep -qi '^x-robots-tag' <<<"$PAGE_HEADERS"; then
  echo "the home page is still blocked from indexing" >&2
  exit 1
fi

if ! grep -qi '^x-robots-tag: *noindex' <<<"$ADMIN_HEADERS"; then
  echo "the admin panel is no longer hidden from search engines" >&2
  exit 1
fi

echo "==> done: https://$HOST"
