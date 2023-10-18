import { Tree } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';
import { getLocalDevDependencies } from '../../../utils/config-files.utils';

export async function checkTslintNotUsedGenerator(tree: Tree): Promise<DataLog[]> {
    const devDeps = getLocalDevDependencies(tree);
    return [
        {
            expected: 'There should be no tslint dependency in the package.json file.',
            status: devDeps['tslint'] ? 'failed' : 'success',
        },
        {
            expected: 'There should be no tslint.json config file in the repository.',
            status: tree.exists('tslint.json') ? 'failed' : 'success',
        },
    ];
}

export default checkTslintNotUsedGenerator;
