# Getting Started with ObkAuthorizator Admin console
This project holds the front web console for an Oberkorn installation. This web console is in fact an ReactTS SPA served from the Oberkorn controller. If you plan to use Oberkorn Web console you must **enable the console** on the controller YAML and **enable the API** interfaace on the authorizators you want to manage via the console (keep in mind that API interface is enabled individually).

To enable API on an Oberkorn Authorizator via authorizator YAML, inside the 'config' section you must code a 'api' parameter:
```yaml
spec:
  config:
    replicas: 1
    prometheus: false
    api: true
    logLevel: 0
```

To enable web console on the Oberkorn via controller YAML you must enable it on the 'env' section (controller code reads config via environment variables):
```yaml
env:
  - name: OBKC_LOG_LEVEL
    value: '9'
  - name: OBKC_CONSOLE
    value: 'true'
```

Finally you can point your browser to address 'http://your.dns.name:3000/obk-console'. Plese remeber **you must create an ingress rule** entry like this one in your ingress:

```yaml
- host: localhost
  http:
    paths:
    - path: /obk-console
        pathType: Prefix
        backend:
        service:
            name: your-controller-service-name
            port:
            number: 3000
```

The name of the controller service typically be something like:

```bash
  obk-controller-svc
```

#### **Important**
Oberkorn do not protect web console nor API's by default, you can use an Oberkorn Authorizator to protect the web console, there is plenty of info on project website about how to do this. **Remember: web console is just another web application**.
