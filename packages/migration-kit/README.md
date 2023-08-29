# Migration Kit

The product migration is a crucial part of our larger strategy aimed at enhancing the quality and speed of  product development. To understand the comprehensive plan, please refer to the [Global Strategy Documentation](https://vie.git.bwinparty.com/vanilla/vanilla/-/blob/master/docs/global-strategy/global-strategy.md).

By leveraging **Internal Nx Framework**, we can align projects with the latest technology stack, code quality standards, and best practices. Additionally, we can merge them into a monorepo, providing significant advantages in terms of code-sharing, module boundaries, linting rules, TSC configuration, and optimized CI/CD processes, including publishing and release management.

The `migration-kit` is a powerful [Nx plugin](https://nx.dev/extending-nx/intro/getting-started) that standardizes rules and tools to improve the development experience, codebase maintainability, and save time during CI/CD processes.

## Migration Guide

![leverage-nx-tooling.png](https://vie.git.bwinparty.com/vanilla/vanilla/-/raw/master/docs/global-strategy/images/leverage-nx-tooling.png)

### Kickoff

In the kickoff phase, we set up the basic Nx environment and identify any blockers that need to be resolved before fully adopting Nx.

#### Nx Installation

Before using the migration-kit workspace validation, you must install and configure Nx. Refer to the [Getting Started](https://nx.dev/getting-started/intro) in the Nx documentation for a straightforward setup. Alternatively, you can use the following command for automatic initialization:

```
npx nx@latest init
```

If automatic initialization doesn't work, you can follow the manual integration documented here: [Manual Migration](https://nx.dev/recipes/adopting-nx/manual)

#### List of efforts

During the previous step, you may encounter blockers that need fixing before fully utilizing Nx. Before commencing the migration, it is crucial to thoroughly investigate, list, and describe all these blockers.

Some of them are already described in the [list of Validators](./src/workspace-validation/validators/README.md).

Feel free to contribute new common fixes to the list.

### Nx Adoption

Once we have identified and addressed the blockers, we can proceed with adopting the Nx framework fully.

![nx-adoption.png](docs/images/nx-adoption.png)

### Workspace Validation

> To validate your workspace against the `migration-kit`, please read the [Workspace Validation](src/workspace-validation/validate-workspace/README.md)
documentation first.

To use the `migration-kit`, you need to install the latest version published in the [Internal Artifactory](https://artifactory.bwinparty.corp/ui/packages/npm:%2F%2F@frontend%2Fmigration-kit):

```
yarn add @frontend/migration-kit -D
```

#### Running Validation

You can run the workspace validation by executing the generator [validate-workspace](./src/workspace-validation/validate-workspace/generator.ts):

```
nx g @frontend/migration-kit:validate-workspace
```

Simply follow the prompts to complete the validation process.

#### Validation Report

Upon completion of the validation, a report will be generated with the results. By default, two reports are configured:

-   `json`: A JSON migration file will be generated with the result.
-   `console`: The result will be displayed as text in the console during after the run.

The report files will be generated with the result located at the root by default.

You can customize the list of reports and the output path by using the following command:

```
nx g @frontend/migration-kit:validate-workspace --reports=json,console --reportsOuput="./reports"
```

### Migrations

In the context of the Nx plugin, a migration refers to the process of applying changes within the codebase. This can include updating `package.json` dependencies versions or any other code changes supported by a specific migration version. More information about Nx migrations can be found in the [migration system Nx documentation](https://nx.dev/extending-nx/recipes/migration-generators).

For our purposes, migrations are used to apply fixes related to `Validator` and ensure repositories align with the **Internal Nx Architecture**. To execute migration-kit migrations, use the following command:

```
npx nx migrate @frontend/migration-kit@latest
```

For more granular migration execution, consult the [api documentation of the migrate command](https://nx.dev/packages/nx/documents/migrate)

## Development

Here are some useful commands for development purposes:

### Build Library

```
nx build migration-kit
```

### Running the unit tests via [Jest](https://jestjs.io).

```
nx test migration-kit
```

### Linting Rules

```
nx lint migration-kit
```

### Publishing

For local development (using Verdaccio):

```
nx publish-local migration-kit
```

To the private registry:

```
nx publish migration-kit
```
