web: cd backend && python - <<'PY'
import os, dj_database_url
u=os.getenv("DATABASE_URL"); print("DATABASE_URL present:", bool(u))
print("DJANGO_SETTINGS_MODULE:", os.getenv("DJANGO_SETTINGS_MODULE"))
if u:
    cfg=dj_database_url.parse(u); print("DB HOST:", cfg.get("HOST"))
PY
python manage.py migrate && python manage.py seed_jobs && gunicorn --bind 0.0.0.0:$PORT --timeout 120 --workers 1 api.wsgi:application
