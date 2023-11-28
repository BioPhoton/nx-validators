import { BaseTsConfigJson, PackageJson } from '@nx-validators/dev-kit';
import { NxJsonConfiguration, Tree, readJson } from '@nx/devkit';
import { fetchGitLabRepositoryRawFile } from './repository.utils';

/**
 * FILES
 */

export const PACKAGE_JSON_FILE = 'package.json';
export const ESLINT_CONFIG_FILE = '.eslintrc.json';
export const YARN_CONFIG_FILE = '.yarnrc.yml';
export const HUSKY_CONFIG_FILE = '.husky/pre-commit';
export const LINT_STAGED_CONFIG_FILE = 'lint-staged.config.js';
export const PRETTIER_CONFIG_FILE = '.prettierrc.cjs';
export const PRETTIER_IGNORE_FILE = '.prettierignore';
export const TS_CONFIG_BASE_FILE = 'tsconfig.base.json';
export const NX_JSON_FILE = 'nx.json';

/**
 * MONOREPO CONFIGS
 */

const MONOREPO_PROJECT_ID = '502';
const getFileFromMonorepo = fetchGitLabRepositoryRawFile(MONOREPO_PROJECT_ID);

export const getMonorepoPackageJson = () => getFileFromMonorepo<PackageJson>({pathToFile: PACKAGE_JSON_FILE});
export const getMonorepoYarnConfig = () => getFileFromMonorepo<string>({pathToFile: YARN_CONFIG_FILE, contentType: 'text/plain'});
export const getMonorepoHuskyConfig = () => getFileFromMonorepo<string>({pathToFile: HUSKY_CONFIG_FILE, contentType: 'text/plain'});
export const getMonorepoDevDependencies = async (): Promise<Record<string, string>> => (await getMonorepoPackageJson())?.devDependencies ?? {};
export const getMonorepoPackageManager = async (): Promise<string> => (await getMonorepoPackageJson())?.packageManager ?? '';
export const getMonorepoScripts = async (): Promise<Record<string, string>> => (await getMonorepoPackageJson())?.scripts ?? {};
export const getMonorepoEslintConfig = (): Promise<unknown> => getFileFromMonorepo({pathToFile: ESLINT_CONFIG_FILE});
export const getMonorepoTsConfigBase = (): Promise<BaseTsConfigJson> => getFileFromMonorepo({pathToFile: TS_CONFIG_BASE_FILE});

/**
 * LOCAL CONFIGS
 */

export const getLocalPackageJson = (tree: Tree): PackageJson => readJson(tree, PACKAGE_JSON_FILE);
export const getLocalYarnConfig = (tree: Tree) => tree.read(YARN_CONFIG_FILE, 'utf-8');
export const getLocalDevDependencies = (tree: Tree): Record<string, string> => getLocalPackageJson(tree).devDependencies ?? {};
export const getLocalScripts = (tree: Tree): Record<string, string> => getLocalPackageJson(tree)?.scripts ?? {};
export const getLocalEslintConfig = (tree: Tree) => readJson(tree, ESLINT_CONFIG_FILE);
export const getLocalPrettierConfig = (tree: Tree) => tree.read(PRETTIER_CONFIG_FILE, 'utf-8');
export const getLocalHuskyConfig = (tree: Tree) => tree.read(HUSKY_CONFIG_FILE, 'utf-8');
export const getLocalLintStagedConfig = (tree: Tree) => tree.read(LINT_STAGED_CONFIG_FILE, 'utf-8');
export const getLocalTsConfigBase = (tree: Tree): BaseTsConfigJson => readJson(tree, TS_CONFIG_BASE_FILE);
export const getLocalNxJson = (tree: Tree): NxJsonConfiguration => readJson(tree, NX_JSON_FILE);
export const hasMigrationKitInTsPaths = (tree: Tree): boolean =>
    getLocalTsConfigBase(tree)?.compilerOptions?.paths?.['@nx-validators/migration-kit'] != null;
