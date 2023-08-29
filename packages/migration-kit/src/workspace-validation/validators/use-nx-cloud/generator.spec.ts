import { NxJsonConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import useNxCloud from './generator';

describe(useNxCloud, () => {
    let tree: Tree;
    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should check if nx-cloud is installed', async () => {
        tree.write('package.json', `{ "devDependencies": {} }`);
        const data = await useNxCloud(tree);
        expect(data).toContainEqual({ expected: 'Package nx-cloud is installed.', status: 'failed' });
    });

    it('should check if nx.json is present', async () => {
        tree.write('package.json', `{ "devDependencies": {} }`);
        tree.delete('nx.json');
        const data = await useNxCloud(tree);
        expect(data).toContainEqual({ expected: 'The configuration file nx.json exists.', status: 'failed' });
    });

    it("should fail if the default task runner isn't nx-cloud", async () => {
        tree.write('package.json', `{ "devDependencies": { "nx-cloud": "latest" } }`);
        tree.write(
            'nx.json',
            JSON.stringify({
                tasksRunnerOptions: {
                    default: {
                        runner: 'nx/tasks-runners/default',
                    },
                },
            } satisfies NxJsonConfiguration),
        );
        const data = await useNxCloud(tree);
        expect(data).toContainEqual({ expected: 'The default task runner should use nx-cloud', status: 'failed' });
    });

    it('should success if the default task runner is nx-cloud', async () => {
        tree.write('package.json', `{ "devDependencies": { "nx-cloud": "latest" } }`);
        tree.write(
            'nx.json',
            JSON.stringify({
                tasksRunnerOptions: {
                    default: {
                        runner: 'nx-cloud',
                    },
                },
            } satisfies NxJsonConfiguration),
        );
        const data = await useNxCloud(tree);
        expect(data).toContainEqual({ expected: 'The default task runner should use nx-cloud', status: 'success' });
    });
});
