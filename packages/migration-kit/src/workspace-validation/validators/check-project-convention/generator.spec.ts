import { Tree, addProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import checkProjectConventionGenerator from './generator';

describe('Check-project-convention generator test set', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail if one project is not following the convention', async () => {
        // GIVEN
        addProjectConfiguration(tree, 'a-project', { root: 'packages/a-project' });
        addProjectConfiguration(tree, 'b-app', { root: 'packages/b-app' });

        // TEST
        const data = await checkProjectConventionGenerator(tree);

        // EXPECT
        expect(data).toContainEqual({ expected: 'Project "a-project" is following the name convention.', status: 'failed' });
        expect(data).toContainEqual({
            expected: 'Project "a-project" with path packages/a-project is following the path convention.',
            status: 'failed',
        });
    });

    it('should success if all project are following the convention', async () => {
        // GIVEN
        addProjectConfiguration(tree, 'a-utils', { root: 'packages/a-utils' });
        addProjectConfiguration(tree, 'b-app', { root: 'packages/b-app' });
        addProjectConfiguration(tree, 'c-theme', { root: 'packages/c-theme' });
        addProjectConfiguration(tree, 'd-kit', { root: 'packages/d-kit' });
        addProjectConfiguration(tree, 'e-nx-plugin', { root: 'packages/e-nx-plugin' });
        addProjectConfiguration(tree, 'f-feature', { root: 'packages/f-feature' });
        addProjectConfiguration(tree, 'g-lib', { root: 'packages/g-lib' });
        addProjectConfiguration(tree, 'i-ui', { root: 'packages/i-ui' });
        addProjectConfiguration(tree, 'j-data-access', { root: 'packages/j-data-access' });
        addProjectConfiguration(tree, 'k-storybook', { root: 'packages/k-storybook' });

        // TEST
        const data = await checkProjectConventionGenerator(tree);

        // EXPECT
        expect(data.every(({ status }) => status === 'success')).toEqual(true);
    });

    it('should ignore root workspace project', async () => {
        // GIVEN
        addProjectConfiguration(tree, 'workspace', { root: '.' });

        // TEST
        const data = await checkProjectConventionGenerator(tree);

        // EXPECT
        expect(data.every(({ status }) => status === 'success')).toEqual(true);
    });
});
