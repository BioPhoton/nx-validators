import { PackageManager, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import * as child_process from 'child_process';

import { MONOREPO_YARNRC_CONFIG_MOCK } from '../../../../fixtures/eslint.fixtures';
import * as configFilesUtils from '../../../utils/config-files.utils';
import { checkYarnConfigGenerator } from './generator';

const LOCAL_YARNRC_CONFIG_MOCK = `
enableStrictSsl: false
httpTimeout: 500000
nodeLinker: node-modules
npmAlwaysAuth: true
npmRegistryServer: "https://artifactory.bwinparty.corp/artifactory/api/npm/npm-public"
plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-interactive-tools.cjs
    spec: "@yarnpkg/plugin-interactive-tools"
yarnPath: .yarn/releases/yarn-3.5.0.cjs`;

jest.spyOn(configFilesUtils, 'getMonorepoPackageManager').mockImplementation((): Promise<string> => {
    return Promise.resolve('yarn@3.6.2');
});
jest.spyOn(configFilesUtils, 'getMonorepoYarnConfig').mockImplementation(() => {
    return Promise.resolve(MONOREPO_YARNRC_CONFIG_MOCK);
});

describe('check-yarn-config generator', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail because of different package manager', async () => {
        tree.write(
            'package.json',
            JSON.stringify({
                packageManager: 'npm@8.0.0',
            }),
        );
        jest.spyOn(await import('@nx/devkit'), 'detectPackageManager').mockImplementation((): PackageManager => {
            return 'npm';
        });
        const data = await checkYarnConfigGenerator(tree);
        expect(data).toContainEqual({
            expected: 'Yarn is used as the package manager.',
            status: 'failed',
        });
    });

    it('should fail because of non-matching version of yarn', async () => {
        tree.write(
            'package.json',
            JSON.stringify({
                packageManager: 'yarn@3.5.0',
            }),
        );
        jest.spyOn(await import('@nx/devkit'), 'detectPackageManager').mockImplementation((): PackageManager => {
            return 'yarn';
        });
        const data = await checkYarnConfigGenerator(tree);
        expect(data).toContainEqual({
            expected: 'The local yarn version should match the one of monorepo (3.6.2).',
            status: 'failed',
        });
    });

    it('should fail because .yarn/cache/ is not part of .gitignore file', async () => {
        tree.write('.gitignore', '');
        tree.write(
            'package.json',
            JSON.stringify({
                packageManager: 'yarn@3.5.0',
            }),
        );
        jest.spyOn(await import('@nx/devkit'), 'detectPackageManager').mockImplementation((): PackageManager => {
            return 'yarn';
        });
        jest.spyOn(child_process, 'execSync').mockImplementation(() => {
            return '';
        });
        const data = await checkYarnConfigGenerator(tree);
        expect(data).toContainEqual({
            expected: 'There should be .yarn/cache/ folder part of the gitignore.',
            status: 'failed',
        });
    });

    it('should fail because of non-matching .yarnrc.yml config file', async () => {
        const expectedConfigDiff = `httpTimeout: 500000
yarnPath: .yarn/releases/yarn-3.5.0.cjs
`;
        tree.write(
            'package.json',
            JSON.stringify({
                packageManager: 'yarn@3.5.0',
            }),
        );
        tree.write('.yarnrc.yml', LOCAL_YARNRC_CONFIG_MOCK);
        jest.spyOn(await import('@nx/devkit'), 'detectPackageManager').mockImplementation((): PackageManager => {
            return 'yarn';
        });
        const data = await checkYarnConfigGenerator(tree);
        expect(data).toContainEqual({
            expected: 'There is a ".yarnrc.yml" config file configured properly.',
            status: 'failed',
            log: `Following properties are not matching:\n${expectedConfigDiff}`,
        });
    });

    it('should run successfully', async () => {
        tree.write('.gitignore', '.yarn/cache/');
        tree.write(
            'package.json',
            JSON.stringify({
                packageManager: 'yarn@3.6.2',
            }),
        );
        tree.write('.yarnrc.yml', MONOREPO_YARNRC_CONFIG_MOCK);
        jest.spyOn(await import('@nx/devkit'), 'detectPackageManager').mockImplementation((): PackageManager => {
            return 'yarn';
        });
        jest.spyOn(child_process, 'execSync').mockReturnValueOnce('3.6.2');
        jest.spyOn(child_process, 'execSync').mockReturnValueOnce('.gitignore:43:  .yarn/cache/');
        const data = await checkYarnConfigGenerator(tree);
        expect(data).toContainEqual({
            expected: 'Yarn is used as the package manager.',
            status: 'success',
        });
        expect(data).toContainEqual({
            expected: 'The local yarn version should match the one of monorepo (3.6.2).',
            status: 'success',
        });
        expect(data).toContainEqual({
            expected: 'There should be .yarn/cache/ folder part of the gitignore.',
            status: 'success',
        });
        expect(data).toContainEqual({
            expected: 'There is a ".yarnrc.yml" config file configured properly.',
            status: 'success',
        });
    });
});
