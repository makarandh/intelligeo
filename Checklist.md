# Checklist before pushing to production 

1. Change flask cors settings in app.py (comment out allow origin *)
2. Comment out local testing server blocks (admin console, api) in nginx.conf
3. Frontend, change fetch URL in helper/common.js
4. Comment out port opening in nginx for - 127.0.0.1:5000:5000
5. Use -f option to start server (this will delete old frontend)
