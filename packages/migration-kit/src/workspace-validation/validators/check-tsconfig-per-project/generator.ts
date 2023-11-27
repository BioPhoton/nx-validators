import { getProjectsFromGraph } from '@nx-validators/dev-kit';
import { Tree } from '@nx/devkit';
import { diff } from 'deep-object-diff';

import { DataLog } from '../../../types/validation.types';
import { PROJECT_TYPES } from '../../../utils/project-conventions.utils';
import { PROJECT_TYPE_TSCONFIG_LIB_MAP, PROJECT_TYPE_TSCONFIG_MAP } from './constants';
import { LibraryType, TSConfig, TSConfigType } from './types';
import { normalizeDiff } from './utils';

const SUPPORTED_TSCONFIG_TARGETS = ['es2018', 'es2019', 'es2020', 'es2021', 'es2022'];

function createDataLog(hasFailed: boolean, logContent: object, projectName?: string, keyword?: string): DataLog[] {
    return [
        {
            expected: `The tsconfig${keyword ? '.' + keyword : ''}.json of ${
                projectName ?? ''
            } should match or extend the default one based on the project type.`,
            ...(hasFailed
                ? {
                      status: 'failed',
                      log: `Following configuration is missing in the tsconfig file: \n ${JSON.stringify(logContent, null, 2)}`,
                  }
                : {
                      status: 'success',
                  }),
        },
    ];
}

function compareTSConfigs(projectName?: string, tsconfig?: TSConfig, libraryType?: LibraryType, configType?: TSConfigType): DataLog[] {
    const data: DataLog[] = [];
    if (!libraryType) {
        return [];
    }
    const defaultTSConfig = configType === 'lib' ? PROJECT_TYPE_TSCONFIG_LIB_MAP[libraryType] : PROJECT_TYPE_TSCONFIG_MAP[libraryType];
    const tsConfigDiff = normalizeDiff(diff(tsconfig ?? {}, defaultTSConfig ?? {}));
    const tsConfigDiffExists = !!Object.keys(tsConfigDiff).length;
    if (libraryType === 'app' && !configType) {
        data.push({
            expected: 'The target compiler options should contain a supported value.',
            status: SUPPORTED_TSCONFIG_TARGETS.some((target) => target === tsconfig?.compilerOptions?.target) ? 'success' : 'failed',
        });
    }
    return [...data, ...createDataLog(tsConfigDiffExists, tsConfigDiff, projectName, configType)];
}

function parseTSConfig(tree: Tree, path: string): TSConfig | undefined {
    const tsConfig = tree.read(path, 'utf-8');
    if (!tsConfig) {
        return undefined;
    }
    return JSON.parse(tsConfig);
}

export async function checkTsconfigPerProjectGenerator(tree: Tree): Promise<DataLog[]> {
    const projectsConfigMap = await getProjectsFromGraph();
    return Object.values(projectsConfigMap).reduce((acc: DataLog[], { name, root, projectType }) => {
        // we do not want to take theme and backend libs into account
        if (!name?.includes('theme') && !name?.includes('backend')) {
            const tsconfig = parseTSConfig(tree, `${root}/tsconfig.json`);
            const tsconfigLib = parseTSConfig(tree, `${root}/tsconfig.lib.json`);
            const libraryType = PROJECT_TYPES.find((suffix) => name?.includes(suffix));
            return [
                ...acc,
                ...(projectType !== 'application'
                    ? [...compareTSConfigs(name, tsconfig, libraryType), ...compareTSConfigs(name, tsconfigLib, libraryType, 'lib')]
                    : compareTSConfigs(name, tsconfig, libraryType)),
            ];
        }
        return acc;
    }, []);
}

export default checkTsconfigPerProjectGenerator;
