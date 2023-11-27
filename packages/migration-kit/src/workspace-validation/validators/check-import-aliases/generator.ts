import { Tree, getProjects } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';
import { getLocalTsConfigBase } from '../../../utils/config-files.utils';

function getPackageNameFromSourceRoot(tree: Tree, sourceRoot?: string): string | undefined {
    if (!sourceRoot) {
        return undefined;
    }
    const sourceRootSegments = sourceRoot.split('/');
    sourceRootSegments.splice(sourceRootSegments.length - 1, 1);
    const packageJsonPath = `./${sourceRootSegments.join('/')}/package.json`;
    const packageJson = tree.read(packageJsonPath, 'utf-8');
    return packageJson ? JSON.parse(packageJson).name : '';
}

function getPublishableProjectNamesFromTree(tree: Tree): string[] {
    return Array.from(getProjects(tree).values()).reduce((acc: string[], project) => {
        const packageName = getPackageNameFromSourceRoot(tree, project.sourceRoot);
        return [...acc, ...(project.targets?.['publish'] && packageName ? [packageName] : [])];
    }, []);
}

export async function checkImportAliasesGenerator(tree: Tree): Promise<DataLog[]> {
    const tsconfigBase = getLocalTsConfigBase(tree);

    const tsConfigBasePaths: Record<string, string[]> = tsconfigBase.compilerOptions.paths;
    return getPublishableProjectNamesFromTree(tree).reduce(
        (acc: DataLog[], packageName) => [
            ...acc,
            {
                expected: `The ${packageName} should be included in the tsconfig.base.json paths definition.`,
                status: tsConfigBasePaths[packageName] ? 'success' : 'failed',
            },
        ],
        [],
    );
}

export default checkImportAliasesGenerator;
