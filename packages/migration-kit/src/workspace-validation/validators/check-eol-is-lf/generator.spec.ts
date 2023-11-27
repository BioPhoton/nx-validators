import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { checkEolIsLfGenerator } from './generator';

describe('check-eol-is-lf generator', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail because of missing .gitattributes file', async () => {
        const data = await checkEolIsLfGenerator(tree);
        expect(data).toContainEqual({ expected: 'There should be a ".gitattributes" file in the project root.', status: 'failed' });
    });

    it('should fail because of missing EOL configuration', async () => {
        tree.write('.gitattributes', '');
        const data = await checkEolIsLfGenerator(tree);
        expect(data).toContainEqual({ expected: 'The EOL should be configured as LF.', status: 'failed' });
    });

    it('should fail because of wrong EOL configuration', async () => {
        tree.write('.gitattributes', 'text eol=crlf');
        const data = await checkEolIsLfGenerator(tree);
        expect(data).toContainEqual({ expected: 'The EOL should be configured as LF.', status: 'failed' });
    });

    it('should run successfully', async () => {
        tree.write('.gitattributes', 'text eol=lf');
        const data = await checkEolIsLfGenerator(tree);
        expect(data).toContainEqual({ expected: 'The EOL should be configured as LF.', status: 'success' });
        expect(data).toContainEqual({ expected: 'There should be a ".gitattributes" file in the project root.', status: 'success' });
    });
});
