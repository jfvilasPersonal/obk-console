# Getting Started with ObkAuthorizator Admin console

# This is **WIP**
You must enable console (and the API) via Authroizator YAML, inside the 'config' section:

```yaml
spec:
  config:
    replicas: 1
    prometheus: false
    console: true
    api: true
    logLevel: 0
```

Then point your browser to address 'http://your.url.name:3000/obk-console'. You should create an ingress rule entry like this one in your ingress:

```yaml
- host: localhost
  http:
    paths:
    - path: /obk-console
        pathType: Prefix
        backend:
        service:
            name: your-authorizator-service-name
            port:
            number: 3000
```

The name of the service should be something like:

```bash
  obk-authorizator-{authorizatorName}-svc
```

That is, if your authorizator is named 'leftie', the service would be:

```
obk-authorizator-leftie-svc
```
