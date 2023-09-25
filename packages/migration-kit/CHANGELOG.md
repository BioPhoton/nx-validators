### Migration Kit 0.10.0 [Not released yet]

[Release date: TBD]

#### Features

#### Fixes

### Migration Kit 0.9.2

2023-09-19

#### Features

#### Fixes
* **fix([check-webpack-config](./src/workspace-validation/validators/check-webpack-config/README.md))**: Check only that the `createWebpackConfig` is used and not the import
* **fix([check-yarn-config](./src/workspace-validation/validators/check-yarn-config/README.md))**: Exclude property `enableImmutableInstalls` from the diff

### Migration Kit 0.9.1

2023-09-19

#### Features

#### Fixes
* **fix([use-project-config](./src/workspace-validation/validators/use-project-config/README.md))**: use `readProjectsConfigurationFromProjectGraph` instead of `getProjects`

### Migration Kit 0.9.0

2023-09-18

#### Features
* **feat([check-tslint-not-used](./src/workspace-validation/validators/check-tslint-not-used/README.md))**: This validator checks whether the repository has no `tslint` dependency installed and configured.
* **feat([check-yarn-config](./src/workspace-validation/validators/check-yarn-config/README.md))**: This validator checks that the repository is using `yarn` as the package manager and that it's configured correctly.

#### Fixes
* **fix([use-output-dist](./src/workspace-validation/validators/use-output-dist/README.md))**: support for dynamic project config using `createNodes` implemented

### Migration Kit 0.8.0

2023-09-14

#### Features
* **feat([use-common-publish-target](./src/workspace-validation/validators/use-common-publish-target/README.md))**: This validator checks if projects are using common publish executor from the `@frontend/dev-kit` plugin
* **feat([check-nx-scripts-in-package-json](./src/workspace-validation/validators/check-nx-scripts-in-package-json/README.md))**: This validator should compare the root package.json scripts with the frontend monorepo ones.
* **feat([use-common-release-target](./src/workspace-validation/validators/use-common-release-target/README.md))**: This validator checks if projects are using common release executor from the `@frontend/dev-kit` plugin
* **feat([no-package-json-placeholder](./src/workspace-validation/validators/no-package-json-placeholder/README.md))**: This validator checks that a project's `package.json` file does not contain any placeholders instead of a real version number.

#### Fixes

### Migration Kit 0.7.0

2023-09-12

#### Features
* **feat([check-eol-is-lf](./src/workspace-validation/validators/check-eol-is-lf/README.md))**: This validator checks whether the EOF is defined correctly.

#### Fixes
* **fix**: Ensure migration-kit version come from lockfile when checking if outdated
* **fix**: Remote vanilla repo url fixed, used main instead of master

### Migration Kit 0.6.2

#### Fixes
* **fix**: Fix check migration-kit version

### Migration Kit 0.6.1

#### Fixes
* **fix**: Correctly check Node.js version
* **fix**: Fix report log formatting
* **fix**: Fix outdated migration-kit version log

### Migration Kit 0.6.0

#### Features
* **feat**: Log a failure and exit processing if migration-kit version is outdated.

#### Fixes
* **fix([check-webpack-config](./src/workspace-validation/validators/check-webpack-config/README.md))**: Check webpack config Validator was not configured

### Migration Kit 0.5.0

2023-09-06

#### Features
* **feat([use-workspace-layout](./src/workspace-validation/validators/use-workspace-layout/README.md))**: Checks whether a workspace folder structure fits the monorepo one.
* **feat([use-output-dist](./src/workspace-validation/validators/use-output-dist/README.md))**: Checks whether a project.json target uses correct output path.

### Migration Kit 0.4.0 

2023-08-30

#### Features
* **feat([check-webpack-config](./src/workspace-validation/validators/check-webpack-config/README.md))**: Validate that the dev-kit shared webpack configuration is used
* **feat(migration-kit)**: Provide summary of validation in console report

#### Fixes
* **feat([user-project-config](./src/workspace-validation/validators/use-project-config/README.md))**: Ignore ClientDist Folder

### Migration Kit 0.3.0 

2023-08-30

#### Features
* **feat([check-gulp-usage](./src/workspace-validation/validators/check-gulp-usage/README.md))**: Validate that the gulp dependency does not exist
* **feat([use-project-config](./src/workspace-validation/validators/use-project-config/README.md))**: Validator checks that the project-like path matches the config root path 
* **feat([check-root-tsconfig-base](./src/workspace-validation/validators/check-root-tsconfig-base/README.md))**: Validator shows missing configuration in the console report
* **feat([use-nx-cloud](./src/workspace-validation/validators/use-nx-cloud/README.md))**: Validator checks that the workspace is using Nx Cloud

### Migration Kit 

2023-08-18

#### Fixes

* **chore**: Use [JSON5](https://github.com/json5/json5) for parsing json files
* **feat([check-version-mismatch](./src/workspace-validation/validators/check-eslint-config/README.md))**: Validate that the lib exist on the monorepo
* **feat([use-project-json](./src/workspace-validation/validators/use-project-json/README.md))**: Ignore "gulp" and "tmp" folder
* **feat([check-tsconfig-paths](./src/workspace-validation/validators/check-tsconfig-paths/README.md)**: Check if file exists before accessing to the paths


### Migration Kit 0.1.0 

2023-17-08

#### Features

* **feat([check-prettier-config](./src/workspace-validation/validators/check-prettier-config/README.md))**: Add a new validator to validate that `prettier` is configured.
* **feat([check-root-tsconfig-base](./src/workspace-validation/validators/check-root-tsconfig-base/README.md))**: Add a new validator to validate the base typescript configuration.
* **feat([check-tsconfig-paths](./src/workspace-validation/validators/check-tsconfig-paths/README.md)**: Add a new validator to validate that the typescript path mapping are correctly used.
* **feat([use-project-json](./src/workspace-validation/validators/use-project-json/README.md))**: Add a new validator to scan the repo and alert when a `project.json` could be used.
* **feat([workspace-validation](./README.md))**: Improve console reporting
* **feat([check-eslint-config](./src/workspace-validation/validators/check-eslint-config/README.md))**: Add a new validator to check the eslint configuration.
* **feat([check-version-mismatch](./src/workspace-validation/validators/check-eslint-config/README.md))**: Add a new validator to check the version alignment between the workspace and the monorepo.
* **feat([workspace-validation](./README.md))**: Create a generator to orchestrate all validators.