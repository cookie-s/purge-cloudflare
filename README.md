purge-cloudflare
================

CloudFunctions invoked by Slack Slash Command to purge CloudFlare caches.


Deploy
------

```
$ gcloud functions deploy purgeAll --runtime nodejs12 --trigger-http --allow-unauthenticated --env-vars-file env.yml --timeout 2s --project ${PROJECT_ID}
```

Note
----
When configuring Slack Apps, `Custom Integrations / Slash Commands (A0F82E8CA)` is NOT supported because Request Signing is disabled.
Create an Apps and configure its Slash Commands.
