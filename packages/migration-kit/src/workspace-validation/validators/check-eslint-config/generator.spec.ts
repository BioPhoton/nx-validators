import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import {
    MONOREPO_ESLINT_CONFIG_MOCK,
    VANILLA_ESLINT_CONFIG_MOCK_DIFF_EXTENDS,
    VANILLA_ESLINT_CONFIG_MOCK_DIFF_RULES,
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
            const { eslint, ...DEV_DEPS_WITHOUT_NX_ESLINT } = MONOREPO_PACKAGE_JSON['devDependencies'];
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
            expect(data).toContainEqual({ expected: `Package eslint is installed.`, status: 'error' });
        });
    });

    describe('Test eslint configs', () => {
        it('should not have a eslint configuration file', async () => {
            // GIVEN
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkEslintConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `The configuration file ${ESLINT_CONFIG_FILE} exists.`, status: 'error' });
        });

        it('should match all the extends and rules from the eslint config', async () => {
            // GIVEN
            tree.write('.eslintrc.json', JSON.stringify(MONOREPO_ESLINT_CONFIG_MOCK));
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkEslintConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `The configuration file ${ESLINT_CONFIG_FILE} exists.`, status: 'success' });
            expect(data).toContainEqual({ expected: 'Eslint configuration of your project satisfies all the requirements.', status: 'success' });
        });

        it('should log the difference in extends', async () => {
            // GIVEN
            const diff = [
                {
                    files: ['*.ts'],
                    extends: ['plugin:jest/recommended', 'plugin:prettier/recommended'],
                    rules: {},
                },
            ];
            tree.write('.eslintrc.json', JSON.stringify(VANILLA_ESLINT_CONFIG_MOCK_DIFF_EXTENDS));
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkEslintConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `The configuration file ${ESLINT_CONFIG_FILE} exists.`, status: 'success' });
            expect(data).toContainEqual({
                expected: 'Eslint configuration of your project satisfies all the requirements.',
                log: `Following overrides (rules, and extends) are missing in your eslint config:\n ${JSON.stringify(diff, null, '  ')}`,
                status: 'error',
            });
        });

        it('should log the difference in rules', async () => {
            // GIVEN
            tree.write('.eslintrc.json', JSON.stringify(VANILLA_ESLINT_CONFIG_MOCK_DIFF_RULES));
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkEslintConfigGenerator(tree);

            // EXPEC
            const expectedDiff = [
                {
                    files: ['*.ts'],
                    rules: {
                        'import/order': [
                            'warn',
                            {
                                'groups': ['builtin', 'external', 'index'],
                                'newlines-between': 'always',
                                'alphabetize': {
                                    order: 'asc',
                                    caseInsensitive: true,
                                },
                            },
                        ],
                        'import/no-unresolved': 'off',
                    },
                },
            ];

            expect(data).toContainEqual({ expected: `The configuration file ${ESLINT_CONFIG_FILE} exists.`, status: 'success' });
            expect(data).toContainEqual({
                expected: 'Eslint configuration of your project satisfies all the requirements.',
                log: `Following overrides (rules, and extends) are missing in your eslint config:\n ${JSON.stringify(expectedDiff, null, '  ')}`,
                status: 'error',
            });
        });
    });
});
