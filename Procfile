web: cd backend && python manage.py migrate && python manage.py seed_jobs && gunicorn --bind 0.0.0.0:$PORT --timeout 120 --workers 1 api.wsgi:application
