import { ProjectConfiguration, createProjectGraphAsync, normalizePath, readProjectsConfigurationFromProjectGraph, workspaceRoot } from '@nx/devkit';

export async function getProjectsFromGraph(): Promise<Record<string, ProjectConfiguration>> {
    return readProjectsConfigurationFromProjectGraph(await createProjectGraphAsync()).projects;
}

export async function getPublishableProjectConfigs(): Promise<ProjectConfiguration[]> {
    const projects = await getProjectsFromGraph();
    return Object.values(projects).filter((config) => !!config.targets?.['publish']);
}

export async function getReleasableProjectConfigs(): Promise<ProjectConfiguration[]> {
    const projects = await getProjectsFromGraph();
    return Object.values(projects).filter((config) => Object.keys(config.targets ?? {}).some((target) => target.startsWith('release')));
}

export async function getPublishablePackageNames(): Promise<string[]> {
    const configs = await getPublishableProjectConfigs();
    return Promise.all(configs.map((config) => getProjectPackageName(config)));
}

export async function getProjectPackageName(projectConfig: ProjectConfiguration): Promise<string> {
    const firstProjectRoot = projectConfig.root;
    if (!firstProjectRoot) {
        throw new Error(`Cannot find project root for project ${projectConfig.name}`);
    }

    const packageJsonPath = `${workspaceRoot}/${normalizePath(firstProjectRoot)}/package.json`;
    const { name: packageName } = await import(packageJsonPath);
    if (!packageName) {
        throw new Error(`To be able to publish a package, you need a file ${packageJsonPath}`);
    }
    return packageName;
}
