import { Tree, addProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { checkWebpackConfig } from './generator';

describe(checkWebpackConfig, () => {
    let tree: Tree;
    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should validate only Angular apps', async () => {
        addProjectConfiguration(tree, 'lib', {
            root: 'libs/lib',
            projectType: 'library',
            targets: {
                build: {
                    executor: 'custom-build',
                },
            },
        });
        addProjectConfiguration(tree, 'app', {
            root: 'apps/app',
            projectType: 'application',
            targets: {
                build: {
                    executor: 'custom-build',
                },
            },
        });
        const data = await checkWebpackConfig(tree);
        // No logs should be there as libs and non-Angular apps are skipped.
        expect(data.length).toBe(0);
    });

    it('should fail if dev-kit webpack configuration is not used', async () => {
        tree.write('apps/app/webpack.config.ts', 'export default {}');
        addProjectConfiguration(tree, 'ng-app', {
            root: 'apps/app',
            projectType: 'application',
            targets: {
                build: {
                    executor: '@nx/angular:webpack-browser',
                    options: {
                        customWebpackConfig: {
                            path: 'apps/app/webpack.config.ts',
                        },
                    },
                },
            },
        });
        const data = await checkWebpackConfig(tree);
        expect(data).toContainEqual({
            expected: 'Angular app "ng-app" should use @frontend/dev-kit Webpack configuration.',
            status: 'failed',
        });
    });

    it('should success if dev-kit webpack configuration is used', async () => {
        tree.write(
            'apps/app/webpack.config.ts',
            `import { createWebpackConfig } from '@frontend/dev-kit';
         
            export default createWebpackConfig({
                staticStylesTemplate: [],
                dynamicStylesTemplate: [],
                themes: [],
            });`,
        );
        addProjectConfiguration(tree, 'ng-app', {
            root: 'apps/app',
            projectType: 'application',
            targets: {
                build: {
                    executor: '@nx/angular:webpack-browser',
                    options: {
                        customWebpackConfig: {
                            path: 'apps/app/webpack.config.ts',
                        },
                    },
                },
            },
        });
        const data = await checkWebpackConfig(tree);
        expect(data).toContainEqual({
            expected: 'Angular app "ng-app" should use @frontend/dev-kit Webpack configuration.',
            status: 'success',
        });
    });
});
