#!/usr/bin/env bash
set -euo pipefail
pnpm --filter @pariconnect/db migrate
pnpm --filter @pariconnect/db seed
