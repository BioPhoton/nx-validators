import { Tree } from '@nx/devkit';
import { isDeepStrictEqual } from 'util';

import { DataLog } from '../../../types/validation.types';
import {
  TS_CONFIG_BASE_FILE,
  getLocalTsConfigBase,
  getMonorepoTsConfigBase,
} from '../../../utils/config-files.utils';
import { isFileExist } from '../../../utils/validators.utils';
import { BaseTsConfigJson } from '../../../types/ts-config-base.types';

export async function checkRootTsConfigBaseGenerator(
  tree: Tree
): Promise<DataLog[]> {
  const data: DataLog[] = [];

  if (isFileExist(TS_CONFIG_BASE_FILE, tree, data)) {
    const monorepoTsConfigBase = await getMonorepoTsConfigBase();
    const localTsConfigBase = getLocalTsConfigBase(tree);

    data.push({
      expected: `Configurations in file "${TS_CONFIG_BASE_FILE}" are matching the monorepo configurations`,
      status: isDeepStrictEqual(
        withoutPaths(localTsConfigBase),
        withoutPaths(monorepoTsConfigBase)
      )
        ? 'success'
        : 'error',
    });
  }

  return data;
}

function withoutPaths(tsConfig: BaseTsConfigJson) {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    compilerOptions: { paths, ...targetCompilerOptions },
  } = tsConfig;
  return { ...tsConfig, compilerOptions: targetCompilerOptions };
}

export default checkRootTsConfigBaseGenerator;
