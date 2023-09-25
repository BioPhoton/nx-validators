import { Tree } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';

export async function checkEolIsLfGenerator(tree: Tree): Promise<DataLog[]> {
    return [
        { expected: 'There should be a ".gitattributes" file in the project root.', status: tree.exists('.gitattributes') ? 'success' : 'failed' },
        {
            expected: 'The EOL should be configured as LF.',
            status: tree
                .read('.gitattributes')
                ?.toString()
                .match(/text eol=lf/)
                ? 'success'
                : 'failed',
        },
    ];
}

export default checkEolIsLfGenerator;
