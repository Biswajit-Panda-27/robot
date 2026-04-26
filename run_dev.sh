#!/bin/bash

export ENVIRONMENT=development

# Detect OS
OS_NAME="$(uname -s)"

if [[ "$OS_NAME" == "Linux"* ]]; then
    echo "🐧 Linux detected"
else
    echo "🪟 Project running on Windows."
fi

echo "🚀 Starting FastAPI server..."
python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
