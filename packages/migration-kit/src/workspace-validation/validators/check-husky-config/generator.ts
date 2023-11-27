import { Tree } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';
import { getLocalHuskyConfig, getLocalLintStagedConfig, getMonorepoHuskyConfig } from '../../../utils/config-files.utils';
import { hasDependencyInstalled } from '../../../utils/validators.utils';

function isConfigMatching(localConfig: string | null, monorepoConfig: string | undefined): boolean {
    return localConfig?.replace(/\s/g, '') === monorepoConfig?.replace(/\s/g, '');
}

export async function checkHuskyConfigGenerator(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];
    const localHuskyConfig = getLocalHuskyConfig(tree);
    const monorepoHuskyConfig = await getMonorepoHuskyConfig();
    const lintStagedConfig = getLocalLintStagedConfig(tree) ?? '';
    hasDependencyInstalled('husky', tree, data);
    hasDependencyInstalled('lint-staged', tree, data);
    return [
        ...data,
        {
            expected: 'The husky pre-commit config should match.',
            status: isConfigMatching(localHuskyConfig, monorepoHuskyConfig) ? 'success' : 'failed',
        },
        {
            expected: 'The lint-staged.config.js extends the shared one from the dev-kit.',
            status: lintStagedConfig.includes('dev-kit/src/lint-staged/index') ? 'success' : 'failed',
        },
    ];
}

export default checkHuskyConfigGenerator;
