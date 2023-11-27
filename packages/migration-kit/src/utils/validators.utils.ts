import { Tree } from '@nx/devkit';

import { DataLog } from '../types/validation.types';
import { getLocalDevDependencies } from './config-files.utils';

export const hasDependencyInstalled = (dependencyName: string, tree: Tree, data: DataLog[]): boolean => {
    const hasDependency = Object.keys(getLocalDevDependencies(tree)).includes(dependencyName);

    data.push({ expected: `Package ${dependencyName} is installed.`, status: hasDependency ? 'success' : 'failed' });

    return hasDependency;
};

export const hasNotDependencyInstalled = (dependencyPattern: string, tree: Tree, data: DataLog[]): boolean => {
    const hasDependency = Object.keys(getLocalDevDependencies(tree)).some((dependency) => dependency.includes(dependencyPattern));

    data.push({ expected: `There is no ${dependencyPattern}-like dependency installed.`, status: hasDependency ? 'failed' : 'success' });

    return !hasDependency;
};

export const isPathExist = (path: string, tree: Tree, data: DataLog[]): boolean => {
    const exist = tree.exists(path);

    data.push({ expected: `The path to "${path}" file or folder exists.`, status: exist ? 'success' : 'failed' });

    return exist;
};
