import type { WorkspaceValidation } from '../../types/validation.types';

export const WORKSPACE_VALIDATIONS: WorkspaceValidation = {
    'use-nx-tooling': {
        name: 'Use Nx Tooling',
        description: 'Nx Tooling compliance checks',
        validatorIds: ['check-version-mismatch', 'use-nx-cloud', 'check-gulp-usage', 'check-nx-scripts-in-package-json'],
    },
    'use-quality-tooling': {
        name: 'Use Quality Tooling',
        description: 'Eslint, tsconfig, Prettier, ... Tooling compliance checks',
        validatorIds: [
            'check-eslint-config',
            'check-prettier-config',
            'check-tslint-not-used',
            'check-yarn-config',
            'check-husky-config',
            'check-tags-convention',
        ],
    },
    'normalize-typescript-config': {
        name: 'Normalize Typescript configuration',
        description: 'Ensure that all typescript configurations are following the Nx standards',
        validatorIds: ['check-root-tsconfig-base', 'check-tsconfig-paths', 'check-tsconfig-per-project', 'check-import-aliases'],
    },
    'use-workspace-layout': {
        name: 'Use Workspace Layout',
        description: 'Folder structure, project.json files, ... validate the workspace layout',
        validatorIds: [
            'use-project-config',
            'use-workspace-layout',
            'use-output-dist',
            'no-package-json-placeholder',
            'check-eol-is-lf',
            'check-project-convention',
            'use-latest-monorepo-packages',
            /* 'check-external-imports', 'use-single-entry-file' */
        ],
    },
    'use-dev-kit': {
        name: 'Use development kit',
        description: 'Ensure that the development kit is used to get the benefits of shared configurations',
        validatorIds: ['use-common-publish-target', 'use-common-release-target'],
    },
    'check-manual-steps': {
        name: 'Check manual steps',
        description: 'Ensure to follow the list of manual checks just before the migration',
        validatorIds: ['check-manual-steps'],
    },
};
