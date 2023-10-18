import { Tree, readNxJson } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';
import { isPathExist } from '../../../utils/validators.utils';

export async function useWorkspaceLayoutGenerator(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];

    isPathExist('backend', tree, data);
    isPathExist('packages', tree, data);
    isPathExist('nx.json', tree, data);

    const nxJson = readNxJson(tree);
    const isWorkspaceLayoutConfigured = nxJson?.workspaceLayout?.appsDir === 'packages' && nxJson?.workspaceLayout?.libsDir === 'packages';
    data.push({
        expected: 'The "workspaceLayout" property in the nx.json is configured properly.',
        status: isWorkspaceLayoutConfigured ? 'success' : 'failed',
    });

    return data;
}

export default useWorkspaceLayoutGenerator;
