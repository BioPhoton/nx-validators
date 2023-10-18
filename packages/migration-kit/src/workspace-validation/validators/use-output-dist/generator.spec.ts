import { ProjectConfiguration, ProjectsConfigurations } from '@nx/devkit';

import { useOutputDistGenerator } from './generator';

const mockReadProjectsConfigurationFromProjectGraph = async (projectConfig: ProjectConfiguration) => {
    jest.spyOn(await import('@nx/devkit'), 'readProjectsConfigurationFromProjectGraph').mockImplementation((): ProjectsConfigurations => {
        return { version: 1, projects: { ['my-project']: projectConfig } };
    });
};

describe('use-output-dist generator', () => {
    it('should fail because of incorrectly defined build target outputs property', async () => {
        const myProjectConfig: ProjectConfiguration = {
            name: 'my-project',
            sourceRoot: 'packages/my-project',
            projectType: 'library',
            root: 'packages/my-project',
            targets: {
                build: {
                    outputs: ['{workspaceRoot}/ClientDist/my-project'],
                },
            },
        };
        await mockReadProjectsConfigurationFromProjectGraph(myProjectConfig);
        const data = await useOutputDistGenerator();
        expect(data).toContainEqual({
            expected: 'The "outputs" property of the "build" target of "my-project" contains path to "dist/build/packages/my-project".',
            status: 'failed',
        });
    });

    it('should pass thanks to correctly specified outputs property', async () => {
        const myProjectConfig: ProjectConfiguration = {
            name: 'my-project',
            sourceRoot: 'packages/my-project',
            projectType: 'library',
            root: 'packages/my-project',
            targets: {
                build: {
                    outputs: ['{workspaceRoot}/dist/build/packages/my-project'],
                },
            },
        };
        await mockReadProjectsConfigurationFromProjectGraph(myProjectConfig);
        const data = await useOutputDistGenerator();
        expect(data).toContainEqual({
            expected: 'The "outputs" property of the "build" target of "my-project" contains path to "dist/build/packages/my-project".',
            status: 'success',
        });
    });
});
