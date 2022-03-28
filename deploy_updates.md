#Utensil - Deployment on DigitalOcean


##Deploy updates

If we run into merge conflicts or other issues, the objective is to bring the current ```origin/main``` and ```production/production``` branches to the latest on the local machine. We will be merging main into production, overwriting any React or JS but keeping the production config files intact. Then we will push the production branch to the production git remote, pull the same branch from the server. ```npm run build```, and restart the web service.

##Prepare the main branch on repos.
Merge changes to ```utensil:main```, and if necessary, ```vis-network:main```

If vis-network has changed, push main branch
Bring local utensil repo to current main

```Shell
$ git fetch –all
$git checkout main
$ git pull
```

##Prepare production branch on production repo
Comment on  first command: git checkout remote branch if it's not already on the local machine. ‘production’ branch from ‘production’ remote
Comment on second command: Merge main branch into production branch

```Shell
$ git checkout utensil-prod
$ merge main
$ git push -u utensil-prod main
``` 


##Pull changes from server - `vis-network`
This can be skipped if there were no updates since the last deploy to vis-network

```Shell
$ ssh with ssh key as ‘django’ user
$ cd vis-network
$ git pull
$ export NODE_OPTIONS="--max-old-space-size=1024"
$ npm run build
```

##Pull changes from server - `utensil`

```Shell
$ ssh with ssh key as ‘django’ user
$ cd utensil
$ git pull
$ export NODE_OPTIONS="--max-old-space-size=1024"
$ npm run build
$ PID=$(systemctl show --value -p MainPID gunicorn.service) && kill -HUP $PID
```
