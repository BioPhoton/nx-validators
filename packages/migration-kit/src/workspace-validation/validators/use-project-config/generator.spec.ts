import { ProjectConfiguration, ProjectsConfigurations, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import useProjectJson from './generator';

describe('Check-version-mismatch generator test set', () => {
    let tree: Tree;
    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should detect missing project.json file if there is a package.json', async () => {
        tree.write('/libs/feature/package.json', '');
        const data = await useProjectJson(tree);
        expect(data).toContainEqual({ expected: 'The project on the "/libs/feature" is using Nx way of configuration.', status: 'failed' });
    });

    it('should detect missing project.json file if there is a tsconfig.json', async () => {
        tree.write('/libs/feature/tsconfig.json', '');
        const data = await useProjectJson(tree);
        expect(data).toContainEqual({ expected: 'The project on the "/libs/feature" is using Nx way of configuration.', status: 'failed' });
    });

    it('should find project.json file if there is a package.json', async () => {
        const projectConfig: ProjectConfiguration = {
            root: 'libs/feature',
        };
        jest.spyOn(await import('@nx/devkit'), 'readProjectsConfigurationFromProjectGraph').mockImplementation((): ProjectsConfigurations => {
            return { version: 1, projects: { ['my-project']: projectConfig } };
        });
        tree.write('/libs/feature/package.json', '');
        tree.write('/libs/feature/project.json', JSON.stringify(projectConfig));
        const data = await useProjectJson(tree);
        expect(data).toContainEqual({ expected: 'The project on the "/libs/feature" is using Nx way of configuration.', status: 'success' });
    });
});
