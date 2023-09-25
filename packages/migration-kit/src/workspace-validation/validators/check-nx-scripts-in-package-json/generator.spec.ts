import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { MONOREPO_PACKAGE_JSON } from '../../../../fixtures/package-json.fixtures';
import * as configUtils from '../../../utils/config-files.utils';
import { checkNxScriptsInPackageJsonGenerator } from './generator';

jest.spyOn(configUtils, 'getMonorepoScripts').mockImplementation(() => Promise.resolve(MONOREPO_PACKAGE_JSON.scripts || {}));

describe('check-nx-scripts-in-package-json generator', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail if there is some script from frontend monorepo missing in the local package.json', async () => {
        const localScripts = {
            scripts: {
                'affected:lint': 'yarn nx run-many -t lint --affected',
                'affected:build': 'yarn nx run-many -t build --affected',
                'affected:test': 'yarn nx run-many -t test --affected --verbose --watch',
            },
        };
        tree.write('package.json', JSON.stringify(localScripts));
        const data = await checkNxScriptsInPackageJsonGenerator(tree);
        const expectedDiff = {
            postinstall: 'is-ci || husky install',
            nx: 'node --max-old-space-size=8192 node_modules/nx/bin/nx.js',
        };
        expect(data).toContainEqual({
            expected: 'Local package.json scripts should match the frontend monorepo package.json scripts.',
            status: 'failed',
            log: `Following scripts are missing in your package.json:\n ${JSON.stringify(expectedDiff, null, '  ')}`,
        });
    });

    it('should fail if there is some custom script in the local package.json', async () => {
        tree.write(
            'package.json',
            JSON.stringify({
                scripts: {
                    start: 'gulp serve',
                },
            }),
        );
        const data = await checkNxScriptsInPackageJsonGenerator(tree);
        expect(data).toContainEqual({
            expected: 'Local package.json scripts should not contain custom scripts.',
            status: 'failed',
        });
    });

    it('should run successfully if the package.json scripts are matching', async () => {
        const localScripts = {
            scripts: {
                'affected:lint': 'yarn nx run-many -t lint --affected',
                'affected:build': 'yarn nx run-many -t build --affected',
                'affected:test': 'yarn nx run-many -t test --affected --verbose --watch',
                'postinstall': 'is-ci || husky install',
                'nx': 'node --max-old-space-size=8192 node_modules/nx/bin/nx.js',
            },
        };
        tree.write('package.json', JSON.stringify(localScripts));
        const data = await checkNxScriptsInPackageJsonGenerator(tree);
        expect(data).toContainEqual({
            expected: 'Local package.json scripts should not contain custom scripts.',
            status: 'success',
        });
        expect(data).toContainEqual({
            expected: 'Local package.json scripts should match the frontend monorepo package.json scripts.',
            status: 'success',
        });
    });
});
