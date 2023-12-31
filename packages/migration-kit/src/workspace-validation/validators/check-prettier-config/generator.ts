import { Tree } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';
import { PRETTIER_CONFIG_FILE, PRETTIER_IGNORE_FILE, getLocalPrettierConfig } from '../../../utils/config-files.utils';
import { hasDependencyInstalled, isPathExist } from '../../../utils/validators.utils';

const checkPrettierDevkitConfig = (tree: Tree): DataLog => {
    const prettierConfig = getLocalPrettierConfig(tree) ?? '';
    return {
        expected: 'Prettier Config is extending the shared config from @frontend/dev-kit',
        status: prettierConfig.includes('dev-kit/src/prettier/index') ? 'success' : 'failed',
    };
};

export async function checkPrettierConfigGenerator(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];

    hasDependencyInstalled('prettier', tree, data);

    if (isPathExist(PRETTIER_CONFIG_FILE, tree, data)) {
        data.push(checkPrettierDevkitConfig(tree));
    }

    isPathExist(PRETTIER_IGNORE_FILE, tree, data);

    return data;
}

export default checkPrettierConfigGenerator;
