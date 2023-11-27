import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { checkTslintNotUsedGenerator } from './generator';

describe('check-tslint-not-used generator', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail because of existing tslint dependency', async () => {
        tree.write(
            'package.json',
            JSON.stringify({
                devDependencies: {
                    tslint: '1.2.3',
                },
            }),
        );
        const data = await checkTslintNotUsedGenerator(tree);
        expect(data).toContainEqual({
            expected: 'There should be no tslint dependency in the package.json file.',
            status: 'failed',
        });
    });

    it('should fail because of existing tslint.json config file', async () => {
        tree.write('tslint.json', '');
        const data = await checkTslintNotUsedGenerator(tree);
        expect(data).toContainEqual({
            expected: 'There should be no tslint.json config file in the repository.',
            status: 'failed',
        });
    });

    it('should run successfully', async () => {
        const data = await checkTslintNotUsedGenerator(tree);
        expect(data).toContainEqual({
            expected: 'There should be no tslint dependency in the package.json file.',
            status: 'success',
        });
        expect(data).toContainEqual({
            expected: 'There should be no tslint.json config file in the repository.',
            status: 'success',
        });
    });
});
