#!/usr/bin/env bash

# Запуск uvicorn на порту, который предоставляет Render
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
