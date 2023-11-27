import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { useCommonPublishTargetGenerator } from './generator';

describe('use-common-publish-target generator', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail if publish target is not using common publish executor from dev-kit', async () => {
        tree.write(
            'packages/vanilla/project.json',
            JSON.stringify({
                name: 'vanilla',
                targets: {
                    publish: {
                        executor: '@custom/plugin:publish',
                    },
                },
            }),
        );
        const data = await useCommonPublishTargetGenerator(tree);
        expect(data).toContainEqual({
            expected: 'Publish target of vanilla project should use common publish executor.',
            status: 'failed',
        });
    });

    it('should run successfully', async () => {
        tree.write(
            'packages/vanilla/project.json',
            JSON.stringify({
                name: 'vanilla',
                targets: {
                    publish: {
                        executor: '@frontend/nx-plugin:publish',
                    },
                },
            }),
        );
        const data = await useCommonPublishTargetGenerator(tree);
        expect(data).toContainEqual({
            expected: 'Publish target of vanilla project should use common publish executor.',
            status: 'success',
        });
    });
});
