import { BaseTsConfigJson } from '@frontend/dev-kit';
import { Tree } from '@nx/devkit';
import { addedDiff } from 'deep-object-diff';

import { DataLog } from '../../../types/validation.types';
import { TS_CONFIG_BASE_FILE, getLocalTsConfigBase, getMonorepoTsConfigBase } from '../../../utils/config-files.utils';
import { isPathExist } from '../../../utils/validators.utils';

type TsConfigBaseWithoutPaths = Omit<BaseTsConfigJson, 'compilerOptions'> & {
    compilerOptions: Omit<BaseTsConfigJson['compilerOptions'], 'paths'>;
};

export async function checkRootTsConfigBaseGenerator(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];

    if (isPathExist(TS_CONFIG_BASE_FILE, tree, data)) {
        const monorepoTsConfigBase = await getMonorepoTsConfigBase();
        const localTsConfigBase = getLocalTsConfigBase(tree);

        const diff = addedDiff(withoutPaths(localTsConfigBase), withoutPaths(monorepoTsConfigBase));

        const hasDiff = Object.keys(diff).length > 0;

        data.push({
            expected: `Configurations in file "${TS_CONFIG_BASE_FILE}" are matching the monorepo configurations`,
            status: hasDiff ? 'failed' : 'success',
            ...(hasDiff ? { log: `Following configuration is missing from your tsconfig.base.json:\n ${JSON.stringify(diff, null, '  ')}` } : {}),
        });
    }

    return data;
}

function withoutPaths(tsConfig: BaseTsConfigJson): TsConfigBaseWithoutPaths {
    const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        compilerOptions: { paths, ...targetCompilerOptions },
    } = tsConfig;
    return { ...tsConfig, compilerOptions: targetCompilerOptions };
}

export default checkRootTsConfigBaseGenerator;
