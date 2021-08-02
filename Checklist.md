# Checklist before pushing to production 

1. Flask api: app.py
   1. Change flask cors settings in app.py (comment out allow origin *)
2. nginx.conf 
   1. Comment out local testing server blocks (admin console, api) in nginx.conf
3. Dashboard frontend helper/common.js 
   1. Change fetch URL
4. docker-compose:
   1. Comment out port opening in nginx for - 127.0.0.1:5000:5000
   2. Comment out flask-app environment variable DEBUG=1 
5. Use -f option to start server (this will delete old frontend)
