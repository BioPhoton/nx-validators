import { Tree, getProjects } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';
import { PROJECT_TYPES, TAG_PREFIXES } from '../../../utils/project-conventions.utils';

const TYPE_TAG = TAG_PREFIXES[0];

export async function checkTagsConvention(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];
    const projects = Array.from(getProjects(tree).entries()).filter(([p]) => p !== 'workspace');

    projects.forEach(([projectName, config]) => {
        data.push({
            expected: `Project "${projectName}" should contain at least 2 tags following the convention.`,
            status: (config.tags ?? []).length < 2 ? 'failed' : 'success',
        });

        (config.tags ?? []).forEach((tag) => {
            data.push({
                expected: `Project "${projectName}" with tag "${tag}" should follow the convention: "type:<type>", and "scope:<scope>".`,
                status: TAG_PREFIXES.some((tagPrefix) => new RegExp(`${tagPrefix}:(.*?)\\b`).test(tag)) ? 'success' : 'failed',
            });

            // Checks that tag "type:<type>" is matching allowed project types.
            if (tag.startsWith(TYPE_TAG)) {
                data.push({
                    expected: `Project "${projectName}" with tag "${tag}" should follow the convention: "type:<type>" where <type> is one of the following: ${PROJECT_TYPES.join(
                        ', ',
                    )}.`,
                    status: PROJECT_TYPES.some((projectType) => tag.endsWith(projectType)) ? 'success' : 'failed',
                });
            }
        });
    });

    return data;
}

export default checkTagsConvention;
