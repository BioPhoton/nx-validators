import { Tree, detectPackageManager } from '@nx/devkit';
import { execSync } from 'child_process';
import { diff } from 'deep-object-diff';
import { load } from 'js-yaml';

import { DataLog } from '../../../types/validation.types';
import { getLocalYarnConfig, getMonorepoPackageManager, getMonorepoYarnConfig } from '../../../utils/config-files.utils';

export function parseYmlToJson(ymlContent: unknown): object | undefined {
    if (typeof ymlContent !== 'string') {
        return undefined;
    }
    try {
        return load(ymlContent) as object;
    } catch (e) {
        console.error(e);
    }
}

export async function checkYarnConfigGenerator(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];
    const monorepoYarnVersion = (await getMonorepoPackageManager()).split('@')[1];
    const isPackageManagerYarn = detectPackageManager() === 'yarn';
    const localYarnVersion = execSync('yarn -v', { encoding: 'utf-8' }).trim();
    data.push({
        expected: 'Yarn is used as the package manager.',
        status: isPackageManagerYarn ? 'success' : 'failed',
    });
    const monorepoYarnConfig = parseYmlToJson(await getMonorepoYarnConfig());
    const localYarnConfig = parseYmlToJson(getLocalYarnConfig(tree));

    // Exclude property enableImmutableInstalls that is added during CI validate workspace
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment,@typescript-eslint/no-unused-vars
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { enableImmutableInstalls, ...diffObj } = diff(monorepoYarnConfig || {}, localYarnConfig || {});

    data.push({
        expected: 'There is a ".yarnrc.yml" config file configured properly.',
        ...(Object.keys(diffObj).length
            ? {
                  status: 'failed',
                  log: `Following properties are not matching:\n${Object.entries(diffObj).reduce(
                      (acc, [key, value]) => `${acc}${key}: ${value}\n`,
                      '',
                  )}`,
              }
            : {
                  status: 'success',
              }),
    });

    data.push({
        expected: `The local yarn version should match the one of monorepo (${monorepoYarnVersion}).`,
        status: isPackageManagerYarn && localYarnVersion === monorepoYarnVersion ? 'success' : 'failed',
    });

    try {
        const isYarnCacheIgnored = execSync('git check-ignore -v .yarn/cache/', { encoding: 'utf-8' }) !== '';
        data.push({
            expected: 'There should be .yarn/cache/ folder part of the gitignore.',
            status: isYarnCacheIgnored ? 'success' : 'failed',
        });
    } catch (e) {
        console.error(e);
        data.push({
            expected: 'There should be no yarn cache folder pushed on the git repository.',
            status: 'success',
        });
    }
    return data;
}

export default checkYarnConfigGenerator;
