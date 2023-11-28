import { Tree, createProjectGraphAsync, readProjectsConfigurationFromProjectGraph } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';

const EXCLUDED_FOLDERS = [/node_modules/, /^[.]/, /dist/, /ThemesDist/, /ClientDist/, /gulp/, /tmp/, /tools/];

function searchTree(tree: Tree, projectRootPaths: string[], path: string = ''): DataLog[] {
    const data: DataLog[] = [];
    const children = tree.children(path);
    for (const child of children) {
        const childPath = `${path}/${child}`;

        if (tree.isFile(childPath) || EXCLUDED_FOLDERS.some((regex) => regex.test(child))) {
            continue;
        }

        const isProjectLike = ['package.json', 'tsconfig.json'].some((file) => tree.exists(`${childPath}/${file}`));

        if (isProjectLike) {
            const isConfigured = projectRootPaths.some((projectRootPath) => childPath.includes(projectRootPath));
            data.push({
                expected: `The project on the "${childPath}" is using Nx way of configuration.`,
                status: isConfigured ? 'success' : 'failed',
            });
            if (isConfigured) {
                continue;
            }
        }
        data.push(...searchTree(tree, projectRootPaths, childPath));
    }
    return data;
}

export async function useProjectJson(tree: Tree): Promise<DataLog[]> {
    const { projects } = readProjectsConfigurationFromProjectGraph(await createProjectGraphAsync());
    const projectRootPaths = Object.values(projects).map((config) => config.root);
    return searchTree(tree, projectRootPaths);
}

export default useProjectJson;
