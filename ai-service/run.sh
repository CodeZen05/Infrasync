#!/usr/bin/env bash
# InfraSync AI Microservice Runner
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

PORT="${AI_SERVICE_PORT:-8000}"

echo "=================================================="
echo "🤖 Starting InfraSync AI Site Evidence Service"
echo "📡 Port: $PORT"
echo "=================================================="

exec python3 -m uvicorn app.main:app --host 0.0.0.0 --port "$PORT" --reload
