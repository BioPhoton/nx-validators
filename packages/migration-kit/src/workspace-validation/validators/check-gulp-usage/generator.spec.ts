import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import * as child_process from 'child_process';

import { checkGulpUsageGenerator } from './generator';

describe('check-gulp-usage generator', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should finish up with successful status', async () => {
        tree.write('package.json', JSON.stringify({ devDependencies: {} }));
        const data = await checkGulpUsageGenerator(tree);
        expect(data).toContainEqual({ expected: 'There is no gulp-like dependency installed.', status: 'success' });
        expect(data).toContainEqual({ expected: 'Gulp tasks should not exist.', status: 'success' });
    });

    it('should finish up with failed status because gulp dependency exists', async () => {
        tree.write('package.json', JSON.stringify({ devDependencies: { gulp: '1.2.3' } }));
        const data = await checkGulpUsageGenerator(tree);
        expect(data).toContainEqual({ expected: 'There is no gulp-like dependency installed.', status: 'failed' });
        expect(data).toContainEqual({ expected: 'Gulp tasks should not exist.', status: 'success' });
    });

    it('should finish up with failed status because gulp task exists', async () => {
        jest.spyOn(child_process, 'execSync').mockImplementation(() => 'build');
        tree.write('package.json', JSON.stringify({ devDependencies: {} }));
        const data = await checkGulpUsageGenerator(tree);
        expect(data).toContainEqual({ expected: 'There is no gulp-like dependency installed.', status: 'success' });
        expect(data).toContainEqual({
            expected: 'Gulp tasks should not exist.',
            status: 'failed',
            log: 'The following gulp tasks were found: build.',
        });
    });
});
