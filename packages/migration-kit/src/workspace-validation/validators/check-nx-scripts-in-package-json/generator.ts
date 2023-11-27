import { Tree } from '@nx/devkit';
import { addedDiff } from 'deep-object-diff';

import { DataLog } from '../../../types/validation.types';
import { getLocalScripts, getMonorepoScripts } from '../../../utils/config-files.utils';

export async function checkNxScriptsInPackageJsonGenerator(tree: Tree): Promise<DataLog[]> {
    const monorepoScripts = await getMonorepoScripts();
    const localScripts = getLocalScripts(tree);
    const diff = addedDiff(localScripts, monorepoScripts);
    const isExactMatch = Object.entries(localScripts).every(([scriptName, command]) => {
        const monorepoCommand = monorepoScripts[scriptName];
        return monorepoCommand != null && monorepoCommand === command;
    });
    return [
        {
            expected: 'Local package.json scripts should not contain custom scripts.',
            status: isExactMatch ? 'success' : 'failed',
        },
        {
            expected: 'Local package.json scripts should match the frontend monorepo package.json scripts.',
            ...(Object.keys(diff).length
                ? {
                      status: 'failed',
                      log: `Following scripts are missing in your package.json:\n ${JSON.stringify(diff, null, '  ')}`,
                  }
                : { status: 'success' }),
        },
    ];
}

export default checkNxScriptsInPackageJsonGenerator;
