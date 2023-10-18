import { createProjectGraphAsync, getOutputsForTargetAndConfiguration, readProjectsConfigurationFromProjectGraph } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';

export async function useOutputDistGenerator(): Promise<DataLog[]> {
    const data: DataLog[] = [];
    const { projects } = readProjectsConfigurationFromProjectGraph(await createProjectGraphAsync());
    Object.entries(projects).forEach(([project, config]) => {
        Object.keys(config.targets || {}).forEach((target) => {
            const outputs = getOutputsForTargetAndConfiguration(
                {
                    target: {
                        project,
                        target,
                    },
                    overrides: {},
                },
                {
                    type: config.projectType === 'application' ? 'app' : 'lib',
                    name: project,
                    data: {
                        root: config.root,
                        targets: config.targets,
                    },
                },
            );
            if (outputs.length > 0) {
                const expectedOutputPath = `dist/${target}/${config.root}`;
                data.push({
                    expected: `The "outputs" property of the "${target}" target of "${project}" contains path to "${expectedOutputPath}".`,
                    status: outputs.includes(expectedOutputPath) ? 'success' : 'failed',
                });
            }
        });
    });
    return data;
}

export default useOutputDistGenerator;
