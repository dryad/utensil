#Utensil - Deployment on DigitalOcean


##Deploy updates

If we run into merge conflicts or other issues, the objective is to bring the current ```origin/main``` and ```production/production``` branches to the latest on the local machine. We will be merging main into production, overwriting any React or JS but keeping the production config files intact. Then we will push the production branch to the production git remote, pull the same branch from the server. ```npm run build```, and restart the web service.

