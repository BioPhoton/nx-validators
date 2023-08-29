import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import useProjectJson from './generator';

describe('Check-version-mismatch generator test set', () => {
    let tree: Tree;
    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should detect missing project.json file if there is a package.json', async () => {
        tree.write('/libs/feature/package.json', '');
        const data = await useProjectJson(tree);
        expect(data).toContainEqual({ expected: `The configuration file /libs/feature/project.json exists.`, status: 'failed' });
    });

    it('should detect missing project.json file if there is a tsconfig.json', async () => {
        tree.write('/libs/feature/tsconfig.json', '');
        const data = await useProjectJson(tree);
        expect(data).toContainEqual({ expected: `The configuration file /libs/feature/project.json exists.`, status: 'failed' });
    });

    it('should find project.json file if there is a package.json', async () => {
        tree.write('/libs/feature/package.json', '');
        tree.write('/libs/feature/project.json', '');
        const data = await useProjectJson(tree);
        expect(data).toContainEqual({ expected: `The configuration file /libs/feature/project.json exists.`, status: 'success' });
    });
});
