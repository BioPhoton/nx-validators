import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { NG_PROJECT_TSCONFIG, NG_PROJECT_TSCONFIG_LIB } from './constants';
import { checkTsconfigPerProjectGenerator } from './generator';

jest.mock('@nx-validators/dev-kit', () => ({
    getProjectsFromGraph: jest.fn().mockResolvedValue({
        'my-ng-project-app': {
            name: 'my-ng-project-app',
            projectType: 'application',
            root: '',
        },
        'my-ng-project-lib': {
            name: 'my-ng-project-lib',
            projectType: 'library',
            root: '',
        },
    }),
}));

describe('check-tsconfig-per-project generator', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail because of missing compilerOptions rule', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { noImplicitOverride, ...tsConfigCompilerOptions } = NG_PROJECT_TSCONFIG.compilerOptions;
        tree.write(
            './tsconfig.json',
            JSON.stringify({
                ...NG_PROJECT_TSCONFIG,
                compilerOptions: {
                    ...tsConfigCompilerOptions,
                    strict: false,
                },
            }),
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { declarationMap, ...tsConfigLibCompilerOptions } = NG_PROJECT_TSCONFIG_LIB.compilerOptions;
        tree.write(
            './tsconfig.lib.json',
            JSON.stringify({
                ...NG_PROJECT_TSCONFIG_LIB,
                compilerOptions: {
                    ...tsConfigLibCompilerOptions,
                    declaration: false,
                },
            }),
        );
        const data = await checkTsconfigPerProjectGenerator(tree);
        expect(data).toContainEqual({
            expected: 'The tsconfig.json of my-ng-project-lib should match or extend the default one based on the project type.',
            status: 'failed',
            log: `Following configuration is missing in the tsconfig file: \n ${JSON.stringify(
                {
                    compilerOptions: {
                        noImplicitOverride: true,
                    },
                },
                null,
                2,
            )}`,
        });
        expect(data).toContainEqual({
            expected: 'The tsconfig.lib.json of my-ng-project-lib should match or extend the default one based on the project type.',
            status: 'failed',
            log: `Following configuration is missing in the tsconfig file: \n ${JSON.stringify(
                {
                    compilerOptions: {
                        declaration: true,
                        declarationMap: true,
                    },
                },
                null,
                2,
            )}`,
        });
    });

    it('should fail because of an unsupported target compiler option value', async () => {
        tree.write(
            './tsconfig.json',
            JSON.stringify({
                ...NG_PROJECT_TSCONFIG,
                compilerOptions: {
                    target: 'es6',
                },
            }),
        );
        const data = await checkTsconfigPerProjectGenerator(tree);
        expect(data).toContainEqual({
            expected: 'The target compiler options should contain a supported value.',
            status: 'failed',
        });
    });

    it('should fail because of missing angularOptions rule', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { strictInputAccessModifiers, ...tsConfigAngularOptions } = NG_PROJECT_TSCONFIG.angularCompilerOptions;
        tree.write(
            './tsconfig.json',
            JSON.stringify({
                ...NG_PROJECT_TSCONFIG,
                angularCompilerOptions: {
                    ...tsConfigAngularOptions,
                    strictTemplates: false,
                },
            }),
        );
        const data = await checkTsconfigPerProjectGenerator(tree);
        expect(data).toContainEqual({
            expected: 'The tsconfig.json of my-ng-project-app should match or extend the default one based on the project type.',
            status: 'failed',
            log: `Following configuration is missing in the tsconfig file: \n ${JSON.stringify(
                {
                    angularCompilerOptions: {
                        strictInputAccessModifiers: true,
                    },
                },
                null,
                2,
            )}`,
        });
    });

    it('should run successfully for angular app project', async () => {
        tree.write(
            './tsconfig.json',
            JSON.stringify({
                ...NG_PROJECT_TSCONFIG,
                compilerOptions: {
                    ...NG_PROJECT_TSCONFIG.compilerOptions,
                    target: 'es2018',
                },
            }),
        );
        tree.write('./tsconfig.lib.json', JSON.stringify(NG_PROJECT_TSCONFIG_LIB));
        const data = await checkTsconfigPerProjectGenerator(tree);
        expect(data).toContainEqual({
            expected: 'The target compiler options should contain a supported value.',
            status: 'success',
        });
        expect(data).toContainEqual({
            expected: 'The tsconfig.json of my-ng-project-app should match or extend the default one based on the project type.',
            status: 'success',
        });
        expect(data).toContainEqual({
            expected: 'The tsconfig.json of my-ng-project-lib should match or extend the default one based on the project type.',
            status: 'success',
        });
        expect(data).toContainEqual({
            expected: 'The tsconfig.lib.json of my-ng-project-lib should match or extend the default one based on the project type.',
            status: 'success',
        });
    });
});
