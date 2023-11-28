import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import {
    MONOREPO_ESLINT_CONFIG_MOCK,
    MONOREPO_ESLINT_CONFIG_MOCK_DIFF_EXTENDS,
    MONOREPO_ESLINT_CONFIG_MOCK_DIFF_RULES,
} from '../../../../fixtures/eslint.fixtures';
import { MONOREPO_PACKAGE_JSON } from '../../../../fixtures/package-json.fixtures';
import * as configUtils from '../../../utils/config-files.utils';
import { ESLINT_CONFIG_FILE } from '../../../utils/config-files.utils';
import { checkEslintConfigGenerator } from './generator';

jest.spyOn(configUtils, 'getMonorepoPackageJson').mockImplementation(() => Promise.resolve(MONOREPO_PACKAGE_JSON));
jest.spyOn(configUtils, 'getMonorepoEslintConfig').mockImplementation(() => Promise.resolve(MONOREPO_ESLINT_CONFIG_MOCK));

describe('Check-eslint-config generator test set', () => {
    let tree: Tree;
    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    describe('Test eslint dependency', () => {
        it('should have the eslint dependency in the project', async () => {
            // GIVEN
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkEslintConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `Package eslint is installed.`, status: 'success' });
        });

        it('should not have the eslint dependency in the project', async () => {
            // GIVEN
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { eslint, ...DEV_DEPS_WITHOUT_NX_ESLINT } = MONOREPO_PACKAGE_JSON['devDependencies']!;
            const PROJECT_PACKAGE_JSON_MISSING_ESLINT = {
                ...MONOREPO_PACKAGE_JSON,
                devDependencies: {
                    ...DEV_DEPS_WITHOUT_NX_ESLINT,
                },
            };
            tree.write('package.json', JSON.stringify(PROJECT_PACKAGE_JSON_MISSING_ESLINT));

            // TEST
            const data = await checkEslintConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `Package eslint is installed.`, status: 'failed' });
        });
    });

    describe('Test eslint configs', () => {
        it('should not have a eslint configuration file', async () => {
            // GIVEN
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkEslintConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `The path to "${ESLINT_CONFIG_FILE}" file or folder exists.`, status: 'failed' });
        });

        it('should match all the extends and rules from the eslint config', async () => {
            // GIVEN
            tree.write('.eslintrc.json', JSON.stringify(MONOREPO_ESLINT_CONFIG_MOCK));
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkEslintConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `The path to "${ESLINT_CONFIG_FILE}" file or folder exists.`, status: 'success' });
            expect(data).toContainEqual({ expected: 'Eslint configuration of your project satisfies all the requirements.', status: 'success' });
        });

        it('should log the difference in extends', async () => {
            // GIVEN
            const expectedDiff = [
                {
                    files: ['*.ts', '*.tsx'],
                    extends: ['plugin:@nx/typescript'],
                },
            ];
            tree.write('.eslintrc.json', JSON.stringify(MONOREPO_ESLINT_CONFIG_MOCK_DIFF_EXTENDS));
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkEslintConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `The path to "${ESLINT_CONFIG_FILE}" file or folder exists.`, status: 'success' });
            expect(data).toContainEqual({
                expected: 'Eslint configuration of your project satisfies all the requirements.',
                log: `Following overrides (rules, and extends) are missing in your eslint config:\n ${JSON.stringify(expectedDiff, null, '  ')}`,
                status: 'failed',
            });
        });

        it('should log the difference in rules', async () => {
            // GIVEN
            tree.write('.eslintrc.json', JSON.stringify(MONOREPO_ESLINT_CONFIG_MOCK_DIFF_RULES));
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkEslintConfigGenerator(tree);

            // EXPECT
            const expectedDiff = [
                {
                    files: ['*.ts', '*.tsx'],
                    rules: {
                        '@nx/enforce-module-boundaries': 'error',
                        '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
                        '@typescript-eslint/no-unused-vars': 'error',
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
            ];

            expect(data).toContainEqual({ expected: `The path to "${ESLINT_CONFIG_FILE}" file or folder exists.`, status: 'success' });
            expect(data).toContainEqual({
                expected: 'Eslint configuration of your project satisfies all the requirements.',
                log: `Following overrides (rules, and extends) are missing in your eslint config:\n ${JSON.stringify(expectedDiff, null, '  ')}`,
                status: 'failed',
            });
        });
    });
});
