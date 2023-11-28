import { ProjectConfiguration, Tree, getProjects } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';
import { PROJECT_TYPES } from '../../../utils/project-conventions.utils';

const endsWithAllowedSuffix = (value: string): boolean => PROJECT_TYPES.some((suffix) => value.endsWith(suffix));
// we are ignoring the project configured in the root project.json file
const isProjectIgnored = (projectRoot: string): boolean => projectRoot === '.';

function checkProjectNameConvention(projectName: string): DataLog {
    return {
        expected: `Project "${projectName}" is following the name convention.`,
        status: endsWithAllowedSuffix(projectName) ? 'success' : 'failed',
    };
}

function checkProjectPathConvention(projectName: string, { root }: ProjectConfiguration): DataLog {
    return {
        expected: `Project "${projectName}" with path ${root} is following the path convention.`,
        status: endsWithAllowedSuffix(root) ? 'success' : 'failed',
    };
}

export async function checkProjectConventionGenerator(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];

    for (const [projectName, projectConfig] of getProjects(tree)) {
        if (isProjectIgnored(projectConfig.root)) {
            data.push({
                expected: `Project "${projectName}" is not following the name and path convention but ignored.`,
                status: 'success',
            });
            continue;
        }

        data.push(checkProjectNameConvention(projectName));
        data.push(checkProjectPathConvention(projectName, projectConfig));
    }
    return data;
}

export default checkProjectConventionGenerator;
