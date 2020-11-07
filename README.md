purge-cloudflare
================

CloudFunctions invoked by Slack Slash Command to purge CloudFlare caches.



Deploy
------

```
$ gcloud functions deploy purgeAll --runtime nodejs12 --trigger-http --allow-unauthenticated --env-vars-file env.yml --timeout 2s --project ${PROJECT_ID}
```
