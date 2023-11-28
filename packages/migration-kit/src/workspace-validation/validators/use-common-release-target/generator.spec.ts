import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { useCommonReleaseTargetGenerator } from './generator';

describe('use-common-release-target generator', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail if release target is not using common release executor from dev-kit', async () => {
        tree.write(
            'project.json',
            JSON.stringify({
                name: 'workspace',
                targets: {
                    'release-vanilla': {
                        executor: '@custom/plugin:release',
                    },
                },
            }),
        );
        const data = await useCommonReleaseTargetGenerator(tree);
        expect(data).toContainEqual({
            expected: 'Release target of workspace project should use common release executor.',
            status: 'failed',
        });
    });

    it('should run successfully', async () => {
        tree.write(
            'packages/dev-kit/project.json',
            JSON.stringify({
                name: 'dev-kit',
                targets: {
                    'release-dev-kit': {
                        executor: '@frontend/nx-plugin:release',
                    },
                },
            }),
        );
        const data = await useCommonReleaseTargetGenerator(tree);
        expect(data).toContainEqual({
            expected: 'Release target of dev-kit project should use common release executor.',
            status: 'success',
        });
    });
});
