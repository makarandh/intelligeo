# Checklist before pushing to production 

1. Change flask cors settings (comment out allow origin *)
2. Change nginx allow origin from * to intellideep
3. Frontend, change fetch URL in common.js
4. Rebuild frontend; delete nginx/build folder 
