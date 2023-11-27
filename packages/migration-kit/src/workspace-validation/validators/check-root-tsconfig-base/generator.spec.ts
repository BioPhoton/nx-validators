import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { BASE_TSCONFIG_JSON, BASE_TSCONFIG_JSON_WITHOUT_ROOT_DIR } from '../../../../fixtures/tsconfig-base-json.fixtures';
import * as configUtils from '../../../utils/config-files.utils';
import { TS_CONFIG_BASE_FILE } from '../../../utils/config-files.utils';
import checkRootTsConfigBaseGenerator from './generator';

jest.spyOn(configUtils, 'getMonorepoTsConfigBase').mockImplementation(() => Promise.resolve(BASE_TSCONFIG_JSON));

describe('Check-root-tsconfig-base generator test set', () => {
    let tree: Tree;
    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should not have a tsconfig.base.json configuration file', async () => {
        // GIVEN
        tree.delete(TS_CONFIG_BASE_FILE);

        // TEST
        const data = await checkRootTsConfigBaseGenerator(tree);

        // EXPECT
        expect(data).toContainEqual({ expected: `The path to "${TS_CONFIG_BASE_FILE}" file or folder exists.`, status: 'failed' });
    });

    it('should have a tsconfig.base.json configuration', async () => {
        // GIVEN
        tree.write(TS_CONFIG_BASE_FILE, JSON.stringify(BASE_TSCONFIG_JSON));

        // TEST
        const data = await checkRootTsConfigBaseGenerator(tree);

        // EXPECT
        expect(data).toContainEqual({ expected: `The path to "${TS_CONFIG_BASE_FILE}" file or folder exists.`, status: 'success' });
    });

    it('should fail if tsconfig.base.json does not satisfies vanilla one', async () => {
        //GIVEN
        tree.write('tsconfig.base.json', JSON.stringify(BASE_TSCONFIG_JSON_WITHOUT_ROOT_DIR));

        const diff = {
            compilerOptions: {
                rootDir: '.',
            },
        };
        // TEST
        const data = await checkRootTsConfigBaseGenerator(tree);

        // EXPECT
        expect(data).toContainEqual({
            expected: `Configurations in file "${TS_CONFIG_BASE_FILE}" are matching the monorepo configurations`,
            log: `Following configuration is missing from your tsconfig.base.json:\n ${JSON.stringify(diff, null, '  ')}`,
            status: 'failed',
        });
    });

    it('should success if tsconfig.base.json is matching', async () => {
        //GIVEN
        tree.write('tsconfig.base.json', JSON.stringify(BASE_TSCONFIG_JSON));

        // TEST
        const data = await checkRootTsConfigBaseGenerator(tree);

        // EXPECT
        expect(data).toContainEqual({
            expected: `Configurations in file "${TS_CONFIG_BASE_FILE}" are matching the monorepo configurations`,
            status: 'success',
        });
    });
});
