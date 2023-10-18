import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { MONOREPO_PACKAGE_JSON } from '../../../../fixtures/package-json.fixtures';
import { DataLog } from '../../../types/validation.types';
import * as configUtils from '../../../utils/config-files.utils';
import { checkVersionMismatchGenerator } from './generator';
import {PackageJson} from "../../../types/package-json.types";

jest.spyOn(configUtils, 'getMonorepoPackageJson').mockImplementation(() => Promise.resolve(MONOREPO_PACKAGE_JSON as PackageJson));

describe('Check-version-mismatch generator test set', () => {
    let tree: Tree;
    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should match all the local devDependencies with monorepo devDependencies', async () => {
        //GIVEN
        tree.write('package.json', JSON.stringify(MONOREPO_PACKAGE_JSON));

        // TEST
        const data = await checkVersionMismatchGenerator(tree);

        // EXPECT
        expect(data.length).toBe(1);
        expect(data).toContainEqual({
            expected: `Npm Dependencies are aligned with the monorepo`,
            status: 'success',
        });
    });

    it('should have local devDependencies not matching monorepo devDependencies', async () => {
        //GIVEN
        const PROJECT_PACKAGE_JSON_MISMATCH_NX_WORKSPACE_VERSION = {
            ...MONOREPO_PACKAGE_JSON,
            devDependencies: {
                ...MONOREPO_PACKAGE_JSON['devDependencies'],
                ['@nx/workspace']: '1.0.0',
            },
        };

        tree.write('package.json', JSON.stringify(PROJECT_PACKAGE_JSON_MISMATCH_NX_WORKSPACE_VERSION));

        // TEST
        const data = await checkVersionMismatchGenerator(tree);

        // EXPECT
        const expectedData: DataLog[] = [
            {
                expected: `Local @nx/workspace version (1.0.0) is not matching the version installed in the monorepo package.json file (${MONOREPO_PACKAGE_JSON.devDependencies['@nx/workspace']})!`,
                status: 'failed',
            },
            {
                expected: `Npm Dependencies are aligned with the monorepo`,
                status: 'failed',
            },
        ];
        expect(data.length).toBe(expectedData.length);
        expectedData.forEach((log) => {
            expect(data).toContainEqual(log);
        });
    });

    it('should not check devDependencies that are not present in the monorepo devDependencies', async () => {
        //GIVEN
        const PROJECT_PACKAGE_JSON_WITH_SPECIFIC_DEPENDENCY = {
            ...MONOREPO_PACKAGE_JSON,
            devDependencies: {
                ...MONOREPO_PACKAGE_JSON['devDependencies'],
                ['@my-org/library']: '1.0.0',
            },
        };
        tree.write('package.json', JSON.stringify(PROJECT_PACKAGE_JSON_WITH_SPECIFIC_DEPENDENCY));

        // TEST
        const data = await checkVersionMismatchGenerator(tree);

        // EXPECT
        expect(data.length).toBe(1);
        expect(data).toContainEqual({
            expected: `Npm Dependencies are aligned with the monorepo`,
            status: 'success',
        });
    });
});
