# Utensil - Deployment on DigitalOcean

## Overview
If we run into merge conflicts or other issues, the objective is to bring the current ```origin/main``` and ```production/production``` branches to the latest on the local machine. We will be merging main into production, overwriting any React or JS but keeping the production config files intact. Then we will push the production branch to the production git remote, pull the same branch from the server. ```npm run build```, and restart the web service.

## Prepare the `main` branch on utensil and vis-network repos.
Merge changes to ```utensil:main```, and if necessary, ```vis-network:main```

If vis-network has changed, push main branch
```Shell
$ git push -u origin main
```

## Bring local utensil repo to current main

```Shell
$ git fetch –all
$ git checkout main
$ git pull
```

## Add `utensil-prod` remote
If you have not already added the `utensil-prod` remote.

```Shell
$ git remote add production git@github.com:dryad/utensil-prod.git
$ git fetch --all
```

## Prepare `production` branch on `production` remote (utensil-prod repo)
Git checkout remote branch `production` from `utensil-prod` repo if it's not already on the local machine.

```Shell
$ git checkout -b production production/production
```

Merge main branch into production branch
```Shell
$ git merge main
$ git push -u utensil-prod production
``` 


## Pull changes from server - `vis-network`
Note: This can be skipped if there were no updates to vis-network since the last deployment

SSH with ssh key as ‘django’ user to the server and run:

```Shell
$ cd vis-network
$ git pull
$ export NODE_OPTIONS="--max-old-space-size=1024"
$ npm run build
```

## Pull changes from server - `utensil`

```Shell
$ ssh with ssh key as ‘django’ user
$ cd utensil
$ git pull
$ export NODE_OPTIONS="--max-old-space-size=1024"
$ npm run build
$ PID=$(systemctl show --value -p MainPID gunicorn.service) && kill -HUP $PID
```
