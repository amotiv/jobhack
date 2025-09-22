web: cd backend && export DJANGO_SETTINGS_MODULE=api.settings_railway && python - <<'PY'
import os, dj_database_url
u=os.getenv("DATABASE_URL"); print("DATABASE_URL present:", bool(u))
if u:
    cfg=dj_database_url.parse(u); print("DB HOST:", cfg.get("HOST"))
PY
python manage.py migrate && python manage.py seed_jobs && gunicorn --bind 0.0.0.0:$PORT --timeout 120 --workers 1 api.wsgi:application
