import { NxJsonConfiguration, Tree, readJson } from '@nx/devkit';

import { fetchJson } from './fetch.utils';
import { PackageJson } from '../types/package-json.types';
import { BaseTsConfigJson } from '../types/ts-config-base.types';

/**
 * FILES
 */

export const PACKAGE_JSON_FILE = 'package.json';
export const ESLINT_CONFIG_FILE = '.eslintrc.json';
export const PRETTIER_CONFIG_FILE = '.prettierrc.cjs';
export const PRETTIER_IGNORE_FILE = '.prettierignore';
export const TS_CONFIG_BASE_FILE = 'tsconfig.base.json';
export const NX_JSON_FILE = 'nx.json';

/**
 * MONOREPO CONFIGS
 */

export const MONOREPO_MASTER_URL =
  'https://raw.githubusercontent.com/tastejs/angular-movies/main';

export const getMonorepoPackageJson = (): Promise<PackageJson> =>
  fetchJson(
    `${MONOREPO_MASTER_URL}/${PACKAGE_JSON_FILE}`
  ) as Promise<PackageJson>;
export const getMonorepoDevDependencies = async (): Promise<
  Record<string, string>
> => (await getMonorepoPackageJson()).devDependencies;
export const getMonorepoEslintConfig = (): Promise<unknown> =>
  fetchJson(`${MONOREPO_MASTER_URL}/${ESLINT_CONFIG_FILE}`);
export const getMonorepoTsConfigBase = (): Promise<BaseTsConfigJson> =>
  fetchJson(
    `${MONOREPO_MASTER_URL}/${TS_CONFIG_BASE_FILE}`
  ) as Promise<BaseTsConfigJson>;

/**
 * LOCAL CONFIGS
 */

export const getLocalPackageJson = (tree: Tree): PackageJson =>
  readJson(tree, PACKAGE_JSON_FILE);
export const getLocalDevDependencies = (tree: Tree): Record<string, string> =>
  getLocalPackageJson(tree).devDependencies;
export const getLocalEslintConfig = (tree: Tree) =>
  readJson(tree, ESLINT_CONFIG_FILE);
export const getLocalPrettierConfig = (tree: Tree) =>
  tree.read(PRETTIER_CONFIG_FILE, 'utf-8');
export const getLocalTsConfigBase = (tree: Tree): BaseTsConfigJson =>
  readJson(tree, TS_CONFIG_BASE_FILE);
export const getLocalNxJson = (tree: Tree): NxJsonConfiguration =>
  readJson(tree, NX_JSON_FILE);
