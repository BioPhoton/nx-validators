import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { MONOREPO_PACKAGE_JSON } from '../../../../fixtures/package-json.fixtures';
import * as configUtils from '../../../utils/config-files.utils';
import { PRETTIER_CONFIG_FILE, PRETTIER_IGNORE_FILE } from '../../../utils/config-files.utils';
import checkPrettierConfigGenerator from './generator';

jest.spyOn(configUtils, 'getMonorepoPackageJson').mockImplementation(() => Promise.resolve(MONOREPO_PACKAGE_JSON));

describe('Check-prettier-config generator test set', () => {
    let tree: Tree;
    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    describe('Test prettier dependency', () => {
        it('should have the prettier dependency in the project', async () => {
            // GIVEN
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkPrettierConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `Package prettier is installed.`, status: 'success' });
        });

        it('should not have the prettier dependency in the project', async () => {
            // GIVEN
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { prettier, ...DEV_DEPS_WITHOUT_NX_PRETTIER } = MONOREPO_PACKAGE_JSON['devDependencies']!;
            const PROJECT_PACKAGE_JSON_MISSING_PRETTIER = {
                ...MONOREPO_PACKAGE_JSON,
                devDependencies: {
                    ...DEV_DEPS_WITHOUT_NX_PRETTIER,
                },
            };
            tree.write('package.json', JSON.stringify(PROJECT_PACKAGE_JSON_MISSING_PRETTIER));

            // TEST
            const data = await checkPrettierConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `Package prettier is installed.`, status: 'failed' });
        });
    });

    describe('Test prettier configs', () => {
        it('should not have a prettier configuration file', async () => {
            // GIVEN
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkPrettierConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `The path to "${PRETTIER_CONFIG_FILE}" file or folder exists.`, status: 'failed' });
        });

        it('should have a valid prettier configuration', async () => {
            // GIVEN
            const prettierConfig = `
                module.exports = {
                    ...require('./packages/dev-kit/src/prettier/index'),
                };
            `;
            tree.write(PRETTIER_CONFIG_FILE, prettierConfig);
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkPrettierConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `The path to "${PRETTIER_CONFIG_FILE}" file or folder exists.`, status: 'success' });

            expect(data).toContainEqual({ expected: 'Prettier Config is extending the shared config from @nx-validators/dev-kit', status: 'success' });
        });

        it('should have a invalid prettier configuration', async () => {
            // GIVEN
            const prettierConfig = `
                module.exports = {
                };
            `;
            tree.write(PRETTIER_CONFIG_FILE, prettierConfig);
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkPrettierConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `The path to "${PRETTIER_CONFIG_FILE}" file or folder exists.`, status: 'success' });

            expect(data).toContainEqual({ expected: 'Prettier Config is extending the shared config from @nx-validators/dev-kit', status: 'failed' });
        });

        it('should have a prettierignore configuration file', async () => {
            // GIVEN
            tree.write(PRETTIER_IGNORE_FILE, '');
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkPrettierConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `The path to "${PRETTIER_IGNORE_FILE}" file or folder exists.`, status: 'success' });
        });

        it('should not have a prettierignore configuration file', async () => {
            // GIVEN
            tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

            // TEST
            const data = await checkPrettierConfigGenerator(tree);

            // EXPECT
            expect(data).toContainEqual({ expected: `The path to "${PRETTIER_IGNORE_FILE}" file or folder exists.`, status: 'failed' });
        });
    });
});
