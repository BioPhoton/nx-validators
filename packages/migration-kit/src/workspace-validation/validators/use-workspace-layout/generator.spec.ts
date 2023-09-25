import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { useWorkspaceLayoutGenerator } from './generator';

describe('use-workspace-layout generator', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail because of missing backend folder', async () => {
        const data = await useWorkspaceLayoutGenerator(tree);
        expect(data).toContainEqual({ expected: 'The path to "backend" file or folder exists.', status: 'failed' });
    });

    it('should fail because of missing packages folder', async () => {
        const data = await useWorkspaceLayoutGenerator(tree);
        expect(data).toContainEqual({ expected: 'The path to "packages" file or folder exists.', status: 'failed' });
    });

    it('should fail because of missing nx.json', async () => {
        tree.delete('nx.json');
        const data = await useWorkspaceLayoutGenerator(tree);
        expect(data).toContainEqual({ expected: 'The path to "nx.json" file or folder exists.', status: 'failed' });
        expect(data).toContainEqual({ expected: 'The "workspaceLayout" property in the nx.json is configured properly.', status: 'failed' });
    });

    it('should fail because of incorrect workspaceLayout configuration in nx.json', async () => {
        tree.write('nx.json', JSON.stringify({ workspaceLayout: { appsDir: 'apps', libsDir: 'libs' } }));
        const data = await useWorkspaceLayoutGenerator(tree);
        expect(data).toContainEqual({ expected: 'The "workspaceLayout" property in the nx.json is configured properly.', status: 'failed' });
    });

    it('should fail because of missing workspaceLayout configuration in nx.json', async () => {
        const data = await useWorkspaceLayoutGenerator(tree);
        expect(data).toContainEqual({ expected: 'The "workspaceLayout" property in the nx.json is configured properly.', status: 'failed' });
    });

    it('should be successful', async () => {
        tree.write('backend/api/swagger.json', '');
        tree.write('packages/test/package.json', '');
        tree.write('nx.json', JSON.stringify({ workspaceLayout: { appsDir: 'packages', libsDir: 'packages' } }));
        const data = await useWorkspaceLayoutGenerator(tree);
        expect(data).toContainEqual({ expected: 'The path to "backend" file or folder exists.', status: 'success' });
        expect(data).toContainEqual({ expected: 'The path to "packages" file or folder exists.', status: 'success' });
        expect(data).toContainEqual({ expected: 'The path to "nx.json" file or folder exists.', status: 'success' });
        expect(data).toContainEqual({ expected: 'The "workspaceLayout" property in the nx.json is configured properly.', status: 'success' });
    });
});
