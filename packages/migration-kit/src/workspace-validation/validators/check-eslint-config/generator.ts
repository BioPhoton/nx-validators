import { Tree } from '@nx/devkit';
import { addedDiff } from 'deep-object-diff';
import { Linter } from 'eslint';

import { DataLog } from '../../../types/validation.types';
import { ESLINT_CONFIG_FILE, getLocalEslintConfig, getMonorepoEslintConfig } from '../../../utils/config-files.utils';
import { hasDependencyInstalled, isPathExist } from '../../../utils/validators.utils';

import ConfigOverride = Linter.ConfigOverride;
import BaseConfig = Linter.BaseConfig;

async function parseEslintConfig(eslintConfig: BaseConfig): Promise<ConfigOverride[]> {
    return (eslintConfig.overrides || []).map((override) => ({
        files: override.files,
        rules: override.rules,
        ...(override.extends && { extends: override.extends }),
    }));
}

function isConfigAligned(tree: Tree, expectedOverrides: ConfigOverride[]): DataLog[] {
    const localEslintConfig: BaseConfig = getLocalEslintConfig(tree);
    const diff = addedDiff(localEslintConfig?.overrides ?? {}, expectedOverrides);

    const diffOverrides = Object.entries(diff).map(([key, value]) => ({
        files: expectedOverrides[parseInt(key, 10)].files,
        ...value,
    }));

    return [
        {
            expected: 'Eslint configuration of your project satisfies all the requirements.',
            ...(diffOverrides.length === 0
                ? {
                      status: 'success',
                  }
                : {
                      status: 'failed',
                      log: `Following overrides (rules, and extends) are missing in your eslint config:\n ${JSON.stringify(
                          diffOverrides,
                          null,
                          '  ',
                      )}`,
                  }),
        },
    ];
}

async function saveConfigDiff(tree: Tree): Promise<DataLog[]> {
    const monorepoEslintConfig = await getMonorepoEslintConfig() as Linter.BaseConfig<Linter.RulesRecord, Linter.RulesRecord>;
    const eslintOverrides = await parseEslintConfig(monorepoEslintConfig);
    return isConfigAligned(tree, eslintOverrides);
}

export async function checkEslintConfigGenerator(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];

    hasDependencyInstalled('eslint', tree, data);

    if (isPathExist(ESLINT_CONFIG_FILE, tree, data)) {
        data.push(...(await saveConfigDiff(tree)));
    }

    return data;
}

export default checkEslintConfigGenerator;
