import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { checkImportAliasesGenerator } from './generator';

describe('check-import-aliases generator', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail because of non-matching import alias', async () => {
        tree.write(
            './packages/my-publishable-lib/project.json',
            JSON.stringify({
                sourceRoot: 'packages/my-publishable-lib/src',
                targets: {
                    publish: {},
                },
            }),
        );
        tree.write(
            './packages/my-publishable-lib/package.json',
            JSON.stringify({
                name: '@frontend/my-publishable-lib',
            }),
        );
        tree.write(
            './tsconfig.base.json',
            JSON.stringify({
                compilerOptions: {
                    paths: {
                        '@packages/my-publishable-lib': 'packages/my-publishable-lib/index.ts',
                    },
                },
            }),
        );
        const data = await checkImportAliasesGenerator(tree);
        expect(data).toContainEqual({
            expected: 'The @frontend/my-publishable-lib should be included in the tsconfig.base.json paths definition.',
            status: 'failed',
        });
    });

    it('should run successfully', async () => {
        tree.write(
            './packages/my-publishable-lib/project.json',
            JSON.stringify({
                sourceRoot: 'packages/my-publishable-lib/src',
                targets: {
                    publish: {},
                },
            }),
        );
        tree.write(
            './packages/my-publishable-lib/package.json',
            JSON.stringify({
                name: '@frontend/my-publishable-lib',
            }),
        );
        tree.write(
            './tsconfig.base.json',
            JSON.stringify({
                compilerOptions: {
                    paths: {
                        '@frontend/my-publishable-lib': 'packages/my-publishable-lib/index.ts',
                    },
                },
            }),
        );
        const data = await checkImportAliasesGenerator(tree);
        expect(data).toContainEqual({
            expected: 'The @frontend/my-publishable-lib should be included in the tsconfig.base.json paths definition.',
            status: 'success',
        });
    });
});
