#!/usr/bin/env bash
# Run on wol-server from the repo root to deploy the latest version.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Pulling latest code"
git fetch --all --prune
git reset --hard origin/main

echo "==> Building images"
docker compose -f docker-compose.prod.yaml build --pull

echo "==> Bringing services up"
docker compose -f docker-compose.prod.yaml up -d --remove-orphans

echo "==> Service status"
docker compose -f docker-compose.prod.yaml ps

echo "==> Pruning unused images (volumes are never touched)"
docker image prune -a -f

echo "==> Deploy complete"
