import { Tree } from '@nx/devkit';
import { Linter } from 'eslint';
import { isDeepStrictEqual } from 'util';

import { DataLog } from '../../../types/validation.types';
import { ESLINT_CONFIG_FILE, getLocalEslintConfig, getMonorepoEslintConfig } from '../../../utils/config-files.utils';
import { hasDependencyInstalled, isFileExist } from '../../../utils/validators.utils';

import ConfigOverride = Linter.ConfigOverride;
import RulesRecord = Linter.RulesRecord;
import BaseConfig = Linter.BaseConfig;

async function parseEslintConfig(eslintConfig: BaseConfig): Promise<ConfigOverride[]> {
    return (eslintConfig.overrides || []).map((override) => ({
        files: override.files,
        rules: override.rules,
        ...(override.extends && { extends: override.extends }),
    }));
}

function diffRules(expectedOverride: ConfigOverride, currentOverride: ConfigOverride): RulesRecord {
    return Object.entries(expectedOverride.rules).reduce((acc, [ruleKey, expectedValue]): Record<string, (string | unknown)[]> => {
        const currentValue = currentOverride.rules[ruleKey];
        if (currentValue && isDeepStrictEqual(currentValue, expectedValue)) {
            return acc;
        }
        return {
            ...acc,
            [ruleKey]: expectedValue,
        };
    }, {});
}

function getCurrentOverride(currentConfig: BaseConfig, expectedOverride: ConfigOverride): ConfigOverride | null {
    return currentConfig.overrides.filter((override) => {
        if (typeof expectedOverride.files === 'string') {
            return override.files === expectedOverride.files;
        }
        return JSON.stringify(override.files) === JSON.stringify(expectedOverride.files);
    })[0];
}

function diffExtends(expectedOverride: ConfigOverride, currentOverride: ConfigOverride): string[] {
    if (typeof expectedOverride?.extends === 'string') {
        if (typeof currentOverride?.extends === 'string') {
            return expectedOverride.extends !== currentOverride.extends && [expectedOverride.extends];
        }
        return !(currentOverride?.extends || []).includes(expectedOverride.extends) && [expectedOverride.extends];
    }
    if (typeof currentOverride?.extends === 'string') {
        return (expectedOverride?.extends || []).filter((extend) => currentOverride?.extends !== extend);
    }
    return (expectedOverride?.extends || []).filter((extend) => !(currentOverride?.extends || []).includes(extend));
}

function diffOverrides(expectedOverrides: ConfigOverride[], currentConfig: BaseConfig): ConfigOverride[] {
    return expectedOverrides.reduce((acc, expectedOverride) => {
        const currentOverride = getCurrentOverride(currentConfig, expectedOverride);
        if (!currentOverride) {
            if (!Object.keys(expectedOverride.rules).length && !expectedOverride.extends) {
                return acc;
            }
            return [...acc, expectedOverride];
        }
        const extendsPlugins = diffExtends(expectedOverride, currentOverride);
        const rules = diffRules(expectedOverride, currentOverride);
        if (!Object.keys(rules).length && !extendsPlugins.length) {
            return acc;
        }
        return [
            ...acc,
            {
                files: expectedOverride.files,
                ...(extendsPlugins.length && { extends: extendsPlugins }),
                rules,
            },
        ];
    }, []);
}

function isConfigAligned(tree: Tree, expectedOverrides: ConfigOverride[]): DataLog[] {
    const localEslintConfig = getLocalEslintConfig(tree);
    const diff = diffOverrides(expectedOverrides, localEslintConfig);

    return [
        {
            expected: 'Eslint configuration of your project satisfies all the requirements.',
            ...(diff.length === 0
                ? {
                      status: 'success',
                  }
                : {
                      status: 'error',
                      log: `Following overrides (rules, and extends) are missing in your eslint config:\n ${JSON.stringify(diff, null, '  ')}`,
                  }),
        },
    ];
}

async function saveConfigDiff(tree: Tree): Promise<DataLog[]> {
    const monorepoEslintConfig = await getMonorepoEslintConfig();
    const eslintOverrides = await parseEslintConfig(monorepoEslintConfig);
    return isConfigAligned(tree, eslintOverrides);
}

export async function checkEslintConfigGenerator(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];

    hasDependencyInstalled('eslint', tree, data);

    if (isFileExist(ESLINT_CONFIG_FILE, tree, data)) {
        data.push(...(await saveConfigDiff(tree)));
    }

    return data;
}

export default checkEslintConfigGenerator;
