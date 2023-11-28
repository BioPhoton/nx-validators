import { Tree, getProjects } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';

export async function useCommonPublishTargetGenerator(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];
    const projects = getProjects(tree);
    Array.from(projects.entries()).forEach(([projectName, config]) => {
        const targetEntry = Object.entries(config.targets || {}).find(([targetName]) => targetName === 'publish');
        if (targetEntry) {
            data.push({
                expected: `Publish target of ${projectName} project should use common publish executor.`,
                status: targetEntry[1]?.executor === '@frontend/nx-plugin:publish' ? 'success' : 'failed',
            });
        }
    });
    return data;
}

export default useCommonPublishTargetGenerator;
