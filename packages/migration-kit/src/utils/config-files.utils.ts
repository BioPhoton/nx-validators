import { BaseTsConfigJson, PackageJson } from '@frontend/dev-kit';
import { NxJsonConfiguration, Tree, readJson } from '@nx/devkit';

import { fetchSave } from './fetch.utils';

/**
 * FILES
 */

export const PACKAGE_JSON_FILE = 'package.json';
export const ESLINT_CONFIG_FILE = '.eslintrc.json';
export const YARN_CONFIG_FILE = '.yarnrc.yml';
export const PRETTIER_CONFIG_FILE = '.prettierrc.cjs';
export const PRETTIER_IGNORE_FILE = '.prettierignore';
export const TS_CONFIG_BASE_FILE = 'tsconfig.base.json';
export const NX_JSON_FILE = 'nx.json';

/**
 * MONOREPO CONFIGS
 */

export const MONOREPO_MAIN_URL = 'https://vie.git.bwinparty.com/vanilla/monorepo/-/raw/main';

export const getMonorepoPackageJson = (): Promise<PackageJson> => fetchSave(`${MONOREPO_MAIN_URL}/${PACKAGE_JSON_FILE}`) as Promise<PackageJson>;
export const getMonorepoYarnConfig = (): Promise<unknown> => fetchSave(`${MONOREPO_MAIN_URL}/${YARN_CONFIG_FILE}`, 'text/plain');
export const getMonorepoDevDependencies = async (): Promise<Record<string, string>> => (await getMonorepoPackageJson()).devDependencies ?? {};
export const getMonorepoPackageManager = async (): Promise<string> => (await getMonorepoPackageJson()).packageManager ?? '';
export const getMonorepoScripts = async (): Promise<Record<string, string>> => (await getMonorepoPackageJson())?.scripts ?? {};
export const getMonorepoEslintConfig = (): Promise<unknown> => fetchSave(`${MONOREPO_MAIN_URL}/${ESLINT_CONFIG_FILE}`);
export const getMonorepoTsConfigBase = (): Promise<BaseTsConfigJson> =>
    fetchSave(`${MONOREPO_MAIN_URL}/${TS_CONFIG_BASE_FILE}`) as Promise<BaseTsConfigJson>;

/**
 * LOCAL CONFIGS
 */

export const getLocalPackageJson = (tree: Tree): PackageJson => readJson(tree, PACKAGE_JSON_FILE);
export const getLocalYarnConfig = (tree: Tree) => tree.read(YARN_CONFIG_FILE, 'utf-8');
export const getLocalDevDependencies = (tree: Tree): Record<string, string> => getLocalPackageJson(tree).devDependencies ?? {};
export const getLocalScripts = (tree: Tree): Record<string, string> => getLocalPackageJson(tree)?.scripts ?? {};
export const getLocalEslintConfig = (tree: Tree) => readJson(tree, ESLINT_CONFIG_FILE);
export const getLocalPrettierConfig = (tree: Tree) => tree.read(PRETTIER_CONFIG_FILE, 'utf-8');
export const getLocalTsConfigBase = (tree: Tree): BaseTsConfigJson => readJson(tree, TS_CONFIG_BASE_FILE);
export const getLocalNxJson = (tree: Tree): NxJsonConfiguration => readJson(tree, NX_JSON_FILE);
export const hasMigrationKitInTsPaths = (tree: Tree): boolean =>
    getLocalTsConfigBase(tree)?.compilerOptions?.paths?.['@nx-validators/migration-kit'] != null;
