import { Tree } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';
import { isFileExist } from '../../../utils/validators.utils';

const EXCLUDED_FOLDERS = [/node_modules/, /^[.]/, /dist/, /ClientDist/, /ThemesDist/, /gulp/, /tmp/];

function searchTree(tree: Tree, path = ''): DataLog[] {
    const data: DataLog[] = [];
    const children = tree.children(path);
    for (const child of children) {
        const childPath = `${path}/${child}`;

        if (tree.isFile(childPath) || EXCLUDED_FOLDERS.some((regex) => regex.test(child))) {
            continue;
        }

        const isProjectLike = ['package.json', 'tsconfig.json'].some((file) => tree.exists(`${childPath}/${file}`));

        if (isProjectLike) {
            isFileExist(`${childPath}/project.json`, tree, data);
            continue;
        }
        data.push(...searchTree(tree, childPath));
    }
    return data;
}

export async function useProjectJson(tree: Tree): Promise<DataLog[]> {
    return searchTree(tree);
}

export default useProjectJson;
