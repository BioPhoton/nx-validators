import { Tree } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';
import { getLocalDevDependencies, getMonorepoDevDependencies } from '../../../utils/config-files.utils';

async function checkDependenciesVersions(localDeps: Record<string, string> = {}, monorepoDeps: Record<string, string> = {}): Promise<DataLog[]> {
    const data: DataLog[] = [];

    for (const [localDependencyName, localDependencyVersion] of Object.entries(localDeps)) {
        const monorepoDependencyVersion = monorepoDeps[localDependencyName];

        if (monorepoDependencyVersion && localDependencyVersion !== monorepoDependencyVersion) {
            data.push({
                expected: `Local ${localDependencyName} version (${localDependencyVersion}) is not matching the version installed in the monorepo package.json file (${monorepoDependencyVersion})!`,
                status: 'failed',
            });
        }
    }
    data.push({
        expected: `Npm Dependencies are aligned with the monorepo`,
        status: data.length === 0 ? 'success' : 'failed',
    });

    return data;
}

export async function checkVersionMismatchGenerator(tree: Tree): Promise<DataLog[]> {
    const monorepoDevDependencies = await getMonorepoDevDependencies();
    const localDevDependencies = getLocalDevDependencies(tree);

    return await checkDependenciesVersions(localDevDependencies, monorepoDevDependencies);
}

export default checkVersionMismatchGenerator;
