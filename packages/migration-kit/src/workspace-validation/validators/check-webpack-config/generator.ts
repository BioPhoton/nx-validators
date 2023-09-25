import { Tree, getProjects } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';

export async function checkWebpackConfig(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];

    for (const [projectName, config] of getProjects(tree)) {
        const buildTarget = config.targets?.build;

        if (config.projectType !== 'application' || buildTarget?.executor !== '@nx/angular:webpack-browser') {
            continue;
        }

        const customWebpackConfigPath = buildTarget?.options?.customWebpackConfig?.path;

        if (customWebpackConfigPath == null) {
            data.push({
                expected: `Angular app "${projectName}" should use @frontend/dev-kit Webpack configuration.`,
                status: 'failed',
            });
            continue;
        }

        const webpackConfig = tree.read(customWebpackConfigPath, 'utf-8');

        data.push({
            expected: `Angular app "${projectName}" should use @frontend/dev-kit Webpack configuration.`,
            status: webpackConfig?.includes('createWebpackConfig') ? 'success' : 'failed',
        });
    }

    return data;
}

export default checkWebpackConfig;
