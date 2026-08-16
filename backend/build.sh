#!/usr/bin/env bash
# build.sh - Render runs this script every time it deploys.
# It installs dependencies, collects static files, and runs migrations.

set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py load_surahs