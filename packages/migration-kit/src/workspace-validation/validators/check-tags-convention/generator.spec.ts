import { Tree, addProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import checkTagsConvention from './generator';

describe('Check-tags-convention generator test set', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should fail if least than 2 tags are defined', async () => {
        // GIVEN
        addProjectConfiguration(tree, 'a-app', { root: 'packages/a-app', tags: [] });

        // TEST
        const data = await checkTagsConvention(tree);

        // EXPECT
        expect(data).toContainEqual({ expected: 'Project "a-app" should contain at least 2 tags following the convention.', status: 'failed' });
    });

    it('should fail if at least one tag is not matching the convention', async () => {
        // GIVEN
        addProjectConfiguration(tree, 'a-app', { root: 'packages/a-app', tags: ['badtag:shared', 'type:app'] });

        // TEST
        const data = await checkTagsConvention(tree);

        // EXPECT
        expect(data).toContainEqual({
            expected: 'Project "a-app" with tag "badtag:shared" should follow the convention: "type:<type>", and "scope:<scope>".',
            status: 'failed',
        });
    });

    it('should fail if type tag is not matching the convention', async () => {
        // GIVEN
        addProjectConfiguration(tree, 'a-app', { root: 'packages/a-app', tags: ['scope:shared', 'type:badtype'] });

        // TEST
        const data = await checkTagsConvention(tree);

        // EXPECT
        expect(data).toContainEqual({
            expected:
                'Project "a-app" with tag "type:badtype" should follow the convention: "type:<type>" where <type> is one of the following: app, utils, kit, nx-plugin, theme, lib, feature, ui, data-access, storybook.',
            status: 'failed',
        });
    });

    it('should success if projects are following the convention', async () => {
        // GIVEN
        addProjectConfiguration(tree, 'a-app', { root: 'packages/a-app', tags: ['scope:shared', 'type:app'] });
        addProjectConfiguration(tree, 'b-feature', { root: 'packages/b-feature', tags: ['scope:olympic', 'type:feature'] });

        // TEST
        const data = await checkTagsConvention(tree);

        // EXPECT
        expect(data.every((v) => v.status === 'success')).toBe(true);
    });
});
