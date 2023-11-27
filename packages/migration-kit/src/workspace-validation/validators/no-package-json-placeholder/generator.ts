import { Tree, getProjects } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';

function hasNoPlaceholders(tree: Tree, path: string): boolean {
    const content = tree.read(path)?.toString();
    return !content?.includes('PLACEHOLDER');
}

export async function noPackageJsonPlaceholderGenerator(tree: Tree): Promise<DataLog[]> {
    const projects = getProjects(tree);
    const projectRoots = Array.from(projects.entries()).reduce((acc, [projectName, projectConfig]) => {
        return {
            ...acc,
            ...(projectConfig.sourceRoot && tree.exists(`${projectConfig.sourceRoot}/package.json`)
                ? { [projectName]: [projectConfig.sourceRoot] }
                : {}),
        };
    }, {});
    return Object.entries(projectRoots).map(([projectName, projectRoot]) => {
        const packageJsonPath = `${projectRoot}/package.json`;
        return {
            expected: `A package.json file of ${projectName} project should not contain any placeholders.`,
            status: hasNoPlaceholders(tree, packageJsonPath) ? 'success' : 'failed',
        };
    });
}

export default noPackageJsonPlaceholderGenerator;
