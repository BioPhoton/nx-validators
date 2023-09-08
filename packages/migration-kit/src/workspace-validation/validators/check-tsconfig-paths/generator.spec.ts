import { Tree, addProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import {
    BASE_TSCONFIG_JSON,
    BASE_TSCONFIG_JSON_WITH_WILDCARD_ALIAS,
    TSCONFIG_JSON,
    withPaths,
} from '../../../../fixtures/tsconfig-base-json.fixtures';
import { TS_CONFIG_BASE_FILE } from '../../../utils/config-files.utils';
import checkRootTsConfigBaseGenerator from '../check-root-tsconfig-base/generator';
import { checkTsConfigPathsGenerator } from './generator';

describe('Check-ts-config-paths generator test set', () => {
    let tree: Tree;
    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail if tsconfig.base.json contains any wildcard path alias', async () => {
        //GIVEN
        tree.write('tsconfig.base.json', JSON.stringify(BASE_TSCONFIG_JSON_WITH_WILDCARD_ALIAS));

        // TEST
        const logs = await checkTsConfigPathsGenerator(tree);

        // EXPECT
        expect(logs).toEqual(
            expect.arrayContaining([
                {
                    expected: `File "tsconfig.base.json" does not contains wildcard alias.`,
                    status: 'error',
                },
            ]),
        );
    });

    it('should fail if project tsconfig contains any path alias', async () => {
        //GIVEN
        tree.write(
            'tsconfig.base.json',
            JSON.stringify(
                withPaths(BASE_TSCONFIG_JSON, {
                    'lib-a': ['libs/lib-a/index.ts'],
                }),
            ),
        );
        tree.write(
            'libs/lib-a/tsconfig.json',
            JSON.stringify(
                withPaths(TSCONFIG_JSON, {
                    'lib-a/*': ['../lib-b/*'],
                }),
            ),
        );
        addProjectConfiguration(tree, 'lib-a', {
            sourceRoot: 'libs/lib-a/src',
            root: 'libs/lib-a',
        });

        // TEST
        const logs = await checkTsConfigPathsGenerator(tree);

        // EXPECT
        expect(logs).toEqual(
            expect.arrayContaining([
                {
                    expected: `Nested "libs/lib-a/tsconfig.json" does not contain any alias.`,
                    status: 'error',
                },
            ]),
        );
    });

    it('should success if tsconfig.base.json is matching', async () => {
        //GIVEN
        tree.write('tsconfig.base.json', JSON.stringify(BASE_TSCONFIG_JSON));

        // TEST
        const logs = await checkTsConfigPathsGenerator(tree);

        // EXPECT
        expect(logs).toEqual(
            expect.arrayContaining([
                {
                    expected: 'File "tsconfig.base.json" does not contains wildcard alias.',
                    status: 'success',
                },
            ]),
        );
    });

    it('should not have a tsconfig.base.json configuration file', async () => {
        // GIVEN
        tree.delete(TS_CONFIG_BASE_FILE);

        // TEST
        const data = await checkRootTsConfigBaseGenerator(tree);

        // EXPECT
        expect(data).toContainEqual({ expected: `The configuration file ${TS_CONFIG_BASE_FILE} exists.`, status: 'error' });
    });
});
