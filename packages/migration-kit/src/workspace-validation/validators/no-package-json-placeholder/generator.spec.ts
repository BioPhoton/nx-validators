import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { noPackageJsonPlaceholderGenerator } from './generator';

describe('no-package-json-placeholder generator', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail in case of a PLACEHOLDER is present in package.json', async () => {
        tree.write(
            'packages/vanilla/project.json',
            JSON.stringify({
                name: 'vanilla',
                sourceRoot: 'packages/vanilla',
            }),
        );
        tree.write(
            'packages/vanilla/package.json',
            JSON.stringify({
                name: '@frontend/vanilla',
                version: '0.0.0-PLACEHOLDER',
            }),
        );
        const data = await noPackageJsonPlaceholderGenerator(tree);
        expect(data).toContainEqual({
            expected: 'A package.json file of vanilla project should not contain any placeholders.',
            status: 'failed',
        });
    });

    it('should run successfully', async () => {
        tree.write(
            'packages/vanilla/project.json',
            JSON.stringify({
                name: 'vanilla',
                sourceRoot: 'packages/vanilla',
            }),
        );
        tree.write(
            'packages/vanilla/package.json',
            JSON.stringify({
                name: '@frontend/vanilla',
                version: '1.2.3',
            }),
        );
        const data = await noPackageJsonPlaceholderGenerator(tree);
        expect(data).toContainEqual({
            expected: 'A package.json file of vanilla project should not contain any placeholders.',
            status: 'success',
        });
    });
});
