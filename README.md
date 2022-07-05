purge-cloudflare
================

CloudFunctions invoked by Slack Slash Command to purge CloudFlare caches.


Deploy
------

```bash
make deploy PROJECT_ID="<YOUR GCP project id>"
```

Note
----
When configuring Slack Apps, `Custom Integrations / Slash Commands (A0F82E8CA)` is NOT supported because Request Signing is disabled.
Create an Apps and configure its Slash Commands.
