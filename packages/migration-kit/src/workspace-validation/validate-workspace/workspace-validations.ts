import type { WorkspaceValidation } from '../../types/validation.types';

export const WORKSPACE_VALIDATIONS: WorkspaceValidation = {
    'use-nx-tooling': {
        name: 'Use Nx Tooling',
        description: 'Nx Tooling compliance checks',
        validatorIds: ['check-version-mismatch', 'use-nx-cloud', 'check-gulp-usage'],
    },
    'use-quality-tooling': {
        name: 'Use Quality Tooling',
        description: 'Eslint, tsconfig, Prettier, ... Tooling compliance checks',
        validatorIds: ['check-eslint-config', 'check-prettier-config' /*, 'check-boundaries-config', 'check-tslint-not-used'*/],
    },
    'normalize-typescript-config': {
        name: 'Normalize Typescript configuration',
        description: 'Ensure that all typescript configurations are following the Nx standards',
        validatorIds: ['check-root-tsconfig-base', 'check-tsconfig-paths' /* 'check-ts-compiler-options', 'check-tsconfig-per-project' */],
    },
    'use-workspace-layout': {
        name: 'Use Workspace Layout',
        description: 'Folder structure, project.json files, ... validate the workspace layout',
        validatorIds: ['use-project-json' /* 'check-external-imports', 'use-single-entry-file', 'use-workspace-folder-structure' */],
    },
    /*
    'use-dev-kit': {
        name: 'Use development kit',
        description: 'Ensure that the development kit is used to get the benefits of shared configurations',
        validatorIds: ['use-common-publish-target'],
    },
    */
};
