
# Validators

Below, you can find a list of all validators that are used by the workspace validation.

| Id | Name | Description |
|---|---|---|
| [check-boundaries-config](./check-boundaries-config/README.md) | Check Boundaries Linting Configuration | `TBD` |
| [check-eol-is-lf](./check-eol-is-lf/README.md) | Check EOF is LF | This validator checks whether the EOF is defined correctly. |
| [check-eslint-config](./check-eslint-config/README.md) | Check ESLint Configs | This validator checks for the `eslint` package existence in the target's project repository. It also compares eslint configuration with the expected one, and generates a report with the diff object of the configurations. |
| [check-external-imports](./check-external-imports/README.md) | Check External Imports | `TBD` |
| [check-gulp-usage](./check-gulp-usage/README.md) | Check Gulp Usage | In a Nx architecture, Gulp is not needed anymore because [Nx Tasks](https://nx.dev/core-features/run-tasks) will be used instead to standardize the executions you can have on each project. |
| [check-husky-config](./check-husky-config/README.md) | Check Husky Config | This validator checks whether the `husky` dependency is installed and whether the pre-commit hook is configured correctly.  |
| [check-import-aliases](./check-import-aliases/README.md) | Check Import Aliases | This validator checks whether the tsconfig.base.json path mapping of a publishable library matched the package name defined in the package.json file of the library. |
| [check-manual-steps](./check-manual-steps/README.md) | Check Manual Steps | This validator provides information about areas that should be checked manually just before the migration process starts. |
| [check-nx-scripts-in-package-json](./check-nx-scripts-in-package-json/README.md) | Check Nx scripts in package.json | This validator should compare the root package.json scripts with the frontend monorepo ones. |
| [check-prettier-config](./check-prettier-config/README.md) | Check Prettier Configuration | The goal of that validator is to check that prettier is correctly configured in the current repository. |
| [check-project-convention](./check-project-convention/README.md) | Check Project Convention | The goal of this validator is to ensure projects name and path are following the convention so we can identify their type easily. |
| [check-root-tsconfig-base](./check-root-tsconfig-base/README.md) | Check root tsconfig.base.json | The goal of that validator is to check that the main typescript configurations is correctly configured in the current repository. |
| [check-tags-convention](./check-tags-convention/README.md) | Check Tags Convention | The goal of this validator is to ensure projects tags are defined and correctly following the convention so we can validate project boundaries. |
| [check-ts-compiler-options](./check-ts-compiler-options/README.md) | Check Typescript Compiler Options | `TBD` |
| [check-tsconfig-paths](./check-tsconfig-paths/README.md) | Check tsconfig paths | This validator checks that the main typescript configuration is containing valid path configurations. To do so, wildcard paths are not allowed. |
| [check-tsconfig-per-project](./check-tsconfig-per-project/README.md) | Check tsconfig per project | This validator checks tsconfig on the project level. |
| [check-tslint-not-used](./check-tslint-not-used/README.md) | Check TSLint is not used | This validator checks whether the repository has no `tslint` dependency installed and configured.  |
| [check-version-mismatch](./check-version-mismatch/README.md) | Check Version Mismatch | This validator checks that all the packages that are used in the repository are aligned with the dependency from the monorepo dependencies. |
| [check-yarn-config](./check-yarn-config/README.md) | Check Yarn Config | This validator checks that the repository is using `yarn` as the package manager and that it's configured correctly. |
| [no-package-json-placeholder](./no-package-json-placeholder/README.md) | No package.json placeholder | This validator checks that a project's `package.json` file does not contain any placeholders instead of a real version number. |
| [use-common-publish-target](./use-common-publish-target/README.md) | Use Common Publish Target | This validator checks if projects are using common publish executor from the `@frontend/nx-plugin` plugin. |
| [use-common-release-target](./use-common-release-target/README.md) | Use Common Release Target | This validator checks if projects are using common release executor from the `@frontend/nx-plugin` plugin. |
| [use-latest-monorepo-packages](./use-latest-monorepo-packages/README.md) | Use latest monorepo packages | This validator checks that all the monorepo packages that are used in the repository are up to date. |
| [use-nx-cloud](./use-nx-cloud/README.md) | Use Nx Cloud | This validator checks that the workspace is using Nx Cloud. |
| [use-output-dist](./use-output-dist/README.md) | Use output dist | This validator checks whether each target's `outputs` array in project.json contains a path that is equal to `{workspaceRoot}/dist/${target}/{projectRoot}`. |
| [use-project-config](./use-project-config/README.md) | Use project configuration | This validator checks that everything that could be considered as a Nx project should contain a file `project.json`. |
| [use-publishable-library](./use-publishable-library/README.md) | Use publishable library | `TBD` |
| [use-single-entry-file](./use-single-entry-file/README.md) | Use single entry file | `TBD` |
| [use-workspace-layout](./use-workspace-layout/README.md) | Use workspace folder structure | This validator checks whether a workspace folder structure fits the monorepo one. |

This list was generated by using the script
```
    node update-README.js
```
