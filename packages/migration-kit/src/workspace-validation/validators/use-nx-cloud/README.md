# Use Nx Cloud

![use-nx-cloud.png](../../../../docs/images/use-nx-cloud.png)

## Description
This validator checks that the workspace is using Nx Cloud.

## Solution

1. Ensure you have the default configuration in nx.json

```json
{
  "tasksRunnerOptions": {
        "default": {
            "runner": "nx/tasks-runners/default",
            "options": {
                "cacheableOperations": ["build", "lint"]
            }
        }
    }
}
```

2. Open a terminal in `Admin Mode` connect your workspace by using the command:

Using Git Bash Terminal:
```shell
NX_CLOUD_API="http://nxcloud.dev.env.works" npx nx connect
```

Using Powershell:
```shell
$Env:NX_CLOUD_API = 'http://nxcloud.dev.env.works'
npx nx connect
```

Using Windows command:
```shell
set "NX_CLOUD_API="http://nxcloud.dev.env.works" && npx nx connect
```