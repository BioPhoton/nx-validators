// eslint-disable-next-line @nx/enforce-module-boundaries
import * as vanillaBaseTsConfigJson from '../../../tsconfig.base.json';
import * as projectTsConfigJson from '../tsconfig.json';

export const BASE_TSCONFIG_JSON = vanillaBaseTsConfigJson;
export const TSCONFIG_JSON = projectTsConfigJson;

const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    compilerOptions: { rootDir, ...compilerOptionsWithoutRootDir },
} = BASE_TSCONFIG_JSON;

export const BASE_TSCONFIG_JSON_WITHOUT_ROOT_DIR = {
    ...BASE_TSCONFIG_JSON,
    compilerOptions: {
        ...compilerOptionsWithoutRootDir,
    },
};

export const BASE_TSCONFIG_JSON_WITH_WILDCARD_ALIAS = withPaths(BASE_TSCONFIG_JSON, {
    'module/*': ['path/to/module/*'],
});

export function withPaths<T = Record<string, any>>(tsconfig: T, paths: Record<string, string[]>) {
    return {
        ...tsconfig,
        compilerOptions: {
            ...tsconfig.compilerOptions,
            paths,
        },
    };
}
