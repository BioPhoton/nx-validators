import { Tree, getProjects } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';

export async function useCommonReleaseTargetGenerator(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];
    const projects = getProjects(tree);
    Array.from(projects.entries()).forEach(([projectName, config]) => {
        const targetEntry = Object.entries(config.targets || {}).find(([targetName]) => targetName.includes('release'));
        if (targetEntry) {
            data.push({
                expected: `Release target of ${projectName} project should use common release executor.`,
                status: targetEntry[1]?.executor === '@frontend/dev-kit:release' ? 'success' : 'failed',
            });
        }
    });
    return data;
}

export default useCommonReleaseTargetGenerator;
