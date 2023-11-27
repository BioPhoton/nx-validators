import { createProjectGraphAsync, getOutputsForTargetAndConfiguration, readProjectsConfigurationFromProjectGraph } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';

export async function useOutputDistGenerator(): Promise<DataLog[]> {
    const data: DataLog[] = [];
    const { projects } = readProjectsConfigurationFromProjectGraph(await createProjectGraphAsync());
    Object.entries(projects).forEach(([project, config]) => {
        Object.keys(config.targets || {}).forEach((target) => {
            const outputs = getOutputsForTargetAndConfiguration(
                {
                    project,
                    target,
                },
                {},
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
                    /* Note: output containing "generated" used by the design-system is excluded from the convention.  */
                    status: outputs.includes(expectedOutputPath) || outputs.every((output) => output.includes('generated')) ? 'success' : 'failed',
                });
            }
        });
    });
    return data;
}

export default useOutputDistGenerator;
