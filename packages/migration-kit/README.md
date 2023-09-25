# migration-kit

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build dev-kit` to build the library.

## Running unit tests

Run `nx test dev-kit` to execute the unit tests via [Jest](https://jestjs.io).

## Linting Rules

```
nx lint migration-kit
```

## Publishing

For local development (using Verdaccio):

```
nx publish migration-kit -c verdaccio
```

To the private registry:

```
nx publish migration-kit -c artifactory --ver [version] --tag [latest]
```
