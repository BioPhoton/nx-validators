import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { useLatestMonorepoPackagesGenerator } from './generator';

const LATEST_VANILLA_VERSION = '16.7.4';
const LATEST_THEMES_VERSION = '11.61.0';

jest.mock('@nx-validators/dev-kit', () => {
    return {
        getLatestVersion: jest.fn().mockImplementation((projectName) => {
            if (projectName === '@frontend/vanilla' || projectName === '@frontend/loaders') {
                return Promise.resolve(LATEST_VANILLA_VERSION);
            }
            if (projectName.includes('@themes/')) {
                return Promise.resolve(LATEST_THEMES_VERSION);
            }
        }),
        fetchGitLabRepositoryRawFile: jest.fn(),
    };
});

describe('use-latest-monorepo-packages generator', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail because of outdated @frontend/vanilla package', async () => {
        tree.write(
            'package.json',
            JSON.stringify({
                devDependencies: {
                    '@frontend/vanilla': '16.0.0',
                },
            }),
        );
        const data = await useLatestMonorepoPackagesGenerator(tree);
        expect(data).toContainEqual({
            expected: `Repository is using the latest version (${LATEST_VANILLA_VERSION}) of @frontend/vanilla package.`,
            status: 'failed',
        });
    });

    it('should fail because of outdated @themes/* packages', async () => {
        tree.write(
            'package.json',
            JSON.stringify({
                devDependencies: {
                    '@themes/coral': '11.0.0',
                    '@themes/black': '11.0.0',
                },
            }),
        );
        const data = await useLatestMonorepoPackagesGenerator(tree);
        expect(data).toContainEqual({
            expected: `Repository is using the latest version (${LATEST_THEMES_VERSION}) of @themes/coral package.`,
            status: 'failed',
        });
        expect(data).toContainEqual({
            expected: `Repository is using the latest version (${LATEST_THEMES_VERSION}) of @themes/black package.`,
            status: 'failed',
        });
    });

    it('should run successfully', async () => {
        tree.write(
            'package.json',
            JSON.stringify({
                devDependencies: {
                    '@frontend/vanilla': LATEST_VANILLA_VERSION,
                    '@frontend/loaders': LATEST_VANILLA_VERSION,
                    '@themes/coral': LATEST_THEMES_VERSION,
                    '@themes/black': LATEST_THEMES_VERSION,
                },
            }),
        );
        const data = await useLatestMonorepoPackagesGenerator(tree);
        expect(data).toContainEqual({
            expected: `Repository is using the latest version (${LATEST_VANILLA_VERSION}) of @frontend/vanilla package.`,
            status: 'success',
        });
        expect(data).toContainEqual({
            expected: `Repository is using the latest version (${LATEST_VANILLA_VERSION}) of @frontend/loaders package.`,
            status: 'success',
        });
        expect(data).toContainEqual({
            expected: `Repository is using the latest version (${LATEST_THEMES_VERSION}) of @themes/coral package.`,
            status: 'success',
        });
        expect(data).toContainEqual({
            expected: `Repository is using the latest version (${LATEST_THEMES_VERSION}) of @themes/black package.`,
            status: 'success',
        });
    });
});
