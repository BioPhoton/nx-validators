export const MONOREPO_ESLINT_CONFIG_MOCK = {
    root: true,
    ignorePatterns: ['**/*'],
    plugins: ['@nx'],
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            extends: ['plugin:@nx/typescript'],
            rules: {
                '@nx/enforce-module-boundaries': 'error',
                '@typescript-eslint/no-empty-interface': 'off',
                '@typescript-eslint/member-ordering': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                '@typescript-eslint/no-unsafe-argument': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/no-inferrable-types': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-floating-promises': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                '@typescript-eslint/no-empty-function': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/unbound-method': 'off',
                '@typescript-eslint/restrict-template-expressions': 'off',
                '@typescript-eslint/restrict-plus-operands': 'off',
                '@typescript-eslint/ban-types': 'off',
                '@typescript-eslint/prefer-regexp-exec': 'off',
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/no-misused-promises': 'off',
                '@typescript-eslint/require-await': 'off',
                '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
                '@typescript-eslint/no-unused-vars': 'error',
                'no-fallthrough': 'off',
                'no-prototype-builtins': 'off',
                'no-case-declarations': 'off',
                'no-empty': 'off',
                'no-useless-escape': 'warn',
                'no-extra-boolean-cast': 'warn',
                'no-duplicate-imports': 'error',
                'no-invalid-regexp': 'error',
                'no-multiple-empty-lines': 'error',
                'no-redeclare': 'error',
                'prefer-spread': 'off',
                'prefer-const': 'warn',
                'no-console': 'error',
                'no-restricted-imports': [
                    'error',
                    {
                        paths: [
                            {
                                name: 'lodash',
                                message: "Import from 'lodash-es' instead",
                            },
                        ],
                    },
                ],
            },
        },
        {
            files: ['*.js', '*.jsx'],
            extends: ['plugin:@nx/javascript'],
            rules: {},
        },
        {
            files: ['*.spec.ts', '*.spec.tsx', '*.spec.js', '*.spec.jsx'],
            extends: ['plugin:jest/recommended'],
            env: {
                jest: true,
            },
            rules: {
                'jest/no-jasmine-globals': 'off',
                'jest/expect-expect': 'off',
                'jest/valid-expect': 'off',
                'jest/valid-title': 'off',
                'jest/no-conditional-expect': 'off',
                'jest/no-export': 'off',
                'jest/no-standalone-expect': 'off',
                'jest/no-alias-methods': 'off',
                'jest/no-done-callback': 'off',
                'jest/no-test-prefixes': 'off',
            },
        },
        {
            files: '*.json',
            parser: 'jsonc-eslint-parser',
            rules: {},
        },
    ],
};
export const MONOREPO_ESLINT_CONFIG_MOCK_DIFF_EXTENDS = {
    root: true,
    ignorePatterns: ['**/*'],
    plugins: ['@nx'],
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                '@nx/enforce-module-boundaries': 'error',
                '@typescript-eslint/no-empty-interface': 'off',
                '@typescript-eslint/member-ordering': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                '@typescript-eslint/no-unsafe-argument': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/no-inferrable-types': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-floating-promises': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                '@typescript-eslint/no-empty-function': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/unbound-method': 'off',
                '@typescript-eslint/restrict-template-expressions': 'off',
                '@typescript-eslint/restrict-plus-operands': 'off',
                '@typescript-eslint/ban-types': 'off',
                '@typescript-eslint/prefer-regexp-exec': 'off',
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/no-misused-promises': 'off',
                '@typescript-eslint/require-await': 'off',
                '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
                '@typescript-eslint/no-unused-vars': 'error',
                'no-fallthrough': 'off',
                'no-prototype-builtins': 'off',
                'no-case-declarations': 'off',
                'no-empty': 'off',
                'no-useless-escape': 'warn',
                'no-extra-boolean-cast': 'warn',
                'no-duplicate-imports': 'error',
                'no-invalid-regexp': 'error',
                'no-multiple-empty-lines': 'error',
                'no-redeclare': 'error',
                'prefer-spread': 'off',
                'prefer-const': 'warn',
                'no-console': 'error',
                'no-restricted-imports': [
                    'error',
                    {
                        paths: [
                            {
                                name: 'lodash',
                                message: "Import from 'lodash-es' instead",
                            },
                        ],
                    },
                ],
            },
        },
        {
            files: ['*.js', '*.jsx'],
            extends: ['plugin:@nx/javascript'],
            rules: {},
        },
        {
            files: ['*.spec.ts', '*.spec.tsx', '*.spec.js', '*.spec.jsx'],
            extends: ['plugin:jest/recommended'],
            env: {
                jest: true,
            },
            rules: {
                'jest/no-jasmine-globals': 'off',
                'jest/expect-expect': 'off',
                'jest/valid-expect': 'off',
                'jest/valid-title': 'off',
                'jest/no-conditional-expect': 'off',
                'jest/no-export': 'off',
                'jest/no-standalone-expect': 'off',
                'jest/no-alias-methods': 'off',
                'jest/no-done-callback': 'off',
                'jest/no-test-prefixes': 'off',
            },
        },
        {
            files: '*.json',
            parser: 'jsonc-eslint-parser',
            rules: {},
        },
    ],
};
export const MONOREPO_ESLINT_CONFIG_MOCK_DIFF_RULES = {
    root: true,
    ignorePatterns: ['**/*'],
    plugins: ['@nx'],
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            extends: ['plugin:@nx/typescript'],
            rules: {
                '@typescript-eslint/no-empty-interface': 'off',
                '@typescript-eslint/member-ordering': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                '@typescript-eslint/no-unsafe-argument': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/no-inferrable-types': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-floating-promises': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                '@typescript-eslint/no-empty-function': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/unbound-method': 'off',
                '@typescript-eslint/restrict-template-expressions': 'off',
                '@typescript-eslint/restrict-plus-operands': 'off',
                '@typescript-eslint/ban-types': 'off',
                '@typescript-eslint/prefer-regexp-exec': 'off',
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/no-misused-promises': 'off',
                '@typescript-eslint/require-await': 'off',
                'no-fallthrough': 'off',
                'no-prototype-builtins': 'off',
                'no-case-declarations': 'off',
                'no-empty': 'off',
                'no-useless-escape': 'warn',
                'no-extra-boolean-cast': 'warn',
                'no-duplicate-imports': 'error',
                'no-invalid-regexp': 'error',
                'no-multiple-empty-lines': 'error',
                'no-redeclare': 'error',
                'prefer-spread': 'off',
                'prefer-const': 'warn',
                'no-console': 'error',
            },
        },
        {
            files: ['*.js', '*.jsx'],
            extends: ['plugin:@nx/javascript'],
            rules: {},
        },
        {
            files: ['*.spec.ts', '*.spec.tsx', '*.spec.js', '*.spec.jsx'],
            extends: ['plugin:jest/recommended'],
            env: {
                jest: true,
            },
            rules: {
                'jest/no-jasmine-globals': 'off',
                'jest/expect-expect': 'off',
                'jest/valid-expect': 'off',
                'jest/valid-title': 'off',
                'jest/no-conditional-expect': 'off',
                'jest/no-export': 'off',
                'jest/no-standalone-expect': 'off',
                'jest/no-alias-methods': 'off',
                'jest/no-done-callback': 'off',
                'jest/no-test-prefixes': 'off',
            },
        },
        {
            files: '*.json',
            parser: 'jsonc-eslint-parser',
            rules: {},
        },
    ],
};

export const MONOREPO_YARNRC_CONFIG_MOCK = `
enableStrictSsl: false
httpTimeout: 600000
nodeLinker: node-modules
npmAlwaysAuth: true
npmRegistryServer: "https://artifactory.bwinparty.corp/artifactory/api/npm/npm-public"
plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-interactive-tools.cjs
    spec: "@yarnpkg/plugin-interactive-tools"
yarnPath: .yarn/releases/yarn-3.6.3.cjs
`;

export const MONOREPO_HUSKY_CONFIG_MOCK = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn lint-staged --concurrent true --relative`;

export const MONOREPO_LINT_STAGED_CONFIG_MOCK = `
module.exports = {
    ...require('./packages/dev-kit/src/lint-staged/index'),
    '*.scss': \`stylelint --quiet\`,
};
`;
