import { Tree } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';
import { getLocalNxJson } from '../../../utils/config-files.utils';
import { hasDependencyInstalled, isFileExist } from '../../../utils/validators.utils';

export async function useNxCloud(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];

    hasDependencyInstalled('nx-cloud', tree, data);

    if (isFileExist('nx.json', tree, data)) {
        const { runner } = getLocalNxJson(tree).tasksRunnerOptions.default;
        data.push({ expected: `The default task runner should use nx-cloud`, status: runner === 'nx-cloud' ? 'success' : 'error' });
    }

    return data;
}

export default useNxCloud;
