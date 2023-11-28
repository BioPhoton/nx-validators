import { Tree, getProjects, joinPathFragments, readJson } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';
import { TS_CONFIG_BASE_FILE, getLocalTsConfigBase } from '../../../utils/config-files.utils';
import { isPathExist } from '../../../utils/validators.utils';

export async function checkTsConfigPathsGenerator(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];

    data.push(...checkTsConfigBasePaths(tree));
    data.push(...checkProjectTsConfigPaths(tree));

    return data;
}

function checkProjectTsConfigPaths(tree: Tree): DataLog[] {
    const data: DataLog[] = [];

    for (const [, { root: projectRoot }] of getProjects(tree)) {
        const tsConfigPaths = [
            joinPathFragments(projectRoot, 'tsconfig.json'),
            joinPathFragments(projectRoot, 'tsconfig.spec.json'),
            joinPathFragments(projectRoot, 'tsconfig.app.json'),
            joinPathFragments(projectRoot, 'tsconfig.lib.json'),
        ];

        for (const tsConfigPath of tsConfigPaths) {
            if (tree.exists(tsConfigPath)) {
                const tsConfig = readJson(tree, tsConfigPath);
                const paths = (tsConfig?.compilerOptions?.paths as Record<string, string[]>) ?? {};

                data.push({
                    expected: `Nested "${tsConfigPath}" does not contain any alias.`,
                    status: Object.keys(paths).length > 0 ? 'failed' : 'success',
                });
            }
        }
    }

    return data;
}

function checkTsConfigBasePaths(tree: Tree): DataLog[] {
    const data: DataLog[] = [];

    if (isPathExist(TS_CONFIG_BASE_FILE, tree, data)) {
        const includesWildcard = (path: string): boolean => path.includes('/*');
        const localTsConfigBase = getLocalTsConfigBase(tree);
        const paths = (localTsConfigBase?.compilerOptions?.paths as Record<string, string[]>) ?? {};

        // Check that "compilerOptions.paths" does not contain any wildcard alias.
        const includesAnyWildcard = Object.entries(paths).some(
            ([path, aliases]) => includesWildcard(path) || aliases.some((alias) => includesWildcard(alias)),
        );

        data.push({
            expected: `File "${TS_CONFIG_BASE_FILE}" does not contains wildcard alias.`,
            status: includesAnyWildcard ? 'failed' : 'success',
        });
    }

    return data;
}

export default checkTsConfigPathsGenerator;
