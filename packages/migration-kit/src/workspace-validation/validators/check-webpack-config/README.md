# Check Webpack Config
![check-webpack-config.png](../../../../docs/images/check-webpack-config.png)

## Description
This validator checks if Angular applications are using the shared Webpack configuration from the dev-kit.

## Solution

1. Use `@nx/angular:webpack-browser` build executor

2. Be sure to have `@frontend/dev-kit` dev dependency installed and up to date

3. Define the custom Webpack configuration with the "path" pointing to the webpack config:

```jsonc
{
  "executor": "@nx/angular:webpack-browser",
  "options": {
    "customWebpackConfig": {
      "path": "packages/my-app/webpack.config.ts"
    },
    // ...
  },
}
```

4. Finally, define the configuration like so:

```ts
import { createWebpackConfig } from '@frontend/dev-kit';

export default createWebpackConfig({
    staticStylesTemplate: [ /* ... */ ],
    dynamicStylesTemplate: [ /* ... */ ],
    themes: [ /* ... */ ],
});
```