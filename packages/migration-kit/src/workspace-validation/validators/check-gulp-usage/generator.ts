import { Tree } from '@nx/devkit';
import { execSync } from 'child_process';

import { DataLog } from '../../../types/validation.types';
import { hasNotDependencyInstalled } from '../../../utils/validators.utils';

export async function checkGulpUsageGenerator(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];

    hasNotDependencyInstalled('gulp', tree, data);

    try {
        const gulpTasks = execSync('yarn gulp --tasks-simple', { stdio: 'pipe' }).toString();
        data.push({
            expected: 'Gulp tasks should not exist.',
            status: gulpTasks != null ? 'error' : 'success',
            ...(gulpTasks != null ? { log: `The following gulp tasks were found: ${gulpTasks}.` } : {}),
        });
    } catch (e) {
        data.push({ expected: 'Gulp tasks should not exist.', status: 'success' });
    }

    return data;
}

export default checkGulpUsageGenerator;
