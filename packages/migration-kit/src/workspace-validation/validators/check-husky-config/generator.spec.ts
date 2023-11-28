import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { MONOREPO_HUSKY_CONFIG_MOCK, MONOREPO_LINT_STAGED_CONFIG_MOCK } from '../../../../fixtures/eslint.fixtures';
import * as configFilesUtils from '../../../utils/config-files.utils';
import { checkHuskyConfigGenerator } from './generator';

jest.spyOn(configFilesUtils, 'getMonorepoHuskyConfig').mockResolvedValue(MONOREPO_HUSKY_CONFIG_MOCK);

describe('check-husky-config generator', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail because of missing husky dependency', async () => {
        const data = await checkHuskyConfigGenerator(tree);
        expect(data).toContainEqual({
            expected: 'Package husky is installed.',
            status: 'failed',
        });
    });

    it('should fail because of missing lint-staged dependency', async () => {
        const data = await checkHuskyConfigGenerator(tree);
        expect(data).toContainEqual({
            expected: 'Package lint-staged is installed.',
            status: 'failed',
        });
    });

    it('should fail because of non-matching or missing husky configuration', async () => {
        const data = await checkHuskyConfigGenerator(tree);
        expect(data).toContainEqual({
            expected: 'The husky pre-commit config should match.',
            status: 'failed',
        });
    });

    it('should fail because of non-matching or missing lint-staged.config.js', async () => {
        const data = await checkHuskyConfigGenerator(tree);
        expect(data).toContainEqual({
            expected: 'The lint-staged.config.js extends the shared one from the dev-kit.',
            status: 'failed',
        });
    });

    it('should run successfully', async () => {
        tree.write(
            'package.json',
            JSON.stringify({
                devDependencies: {
                    'husky': '1.2.3',
                    'lint-staged': '1.2.3',
                },
            }),
        );
        tree.write('.husky/pre-commit', MONOREPO_HUSKY_CONFIG_MOCK);
        tree.write('lint-staged.config.js', MONOREPO_LINT_STAGED_CONFIG_MOCK);
        const data = await checkHuskyConfigGenerator(tree);
        expect(data).toContainEqual({
            expected: 'Package husky is installed.',
            status: 'success',
        });
        expect(data).toContainEqual({
            expected: 'Package lint-staged is installed.',
            status: 'success',
        });
        expect(data).toContainEqual({
            expected: 'The husky pre-commit config should match.',
            status: 'success',
        });
        expect(data).toContainEqual({
            expected: 'The lint-staged.config.js extends the shared one from the dev-kit.',
            status: 'success',
        });
    });
});
