import { checkbox } from '@inquirer/prompts';
import { Tree } from '@nx/devkit';
import { execSync } from 'child_process';
import { compare } from 'semver';

import type {
    ResultStatus,
    Validation,
    ValidationId,
    Validator,
    ValidatorModule,
    WorkspaceValidation,
    WorkspaceValidationResult,
} from '../../types/validation.types';
import { hasMigrationKitInTsPaths } from '../../utils/config-files.utils';
import { getLocalMigrationKitVersion, getMigrationKitLatestVersion } from '../../utils/npm-package.utils';
import { report } from '../reporting/report';
import { createWorkspaceValidationResult, updateValidatorResult } from './generator-result';
import type { ValidateWorkspaceGeneratorSchema } from './schema';
import { WORKSPACE_VALIDATIONS } from './workspace-validations';

const SUPPORTED_NODE_VERSION = '18.0.0';

export async function validateWorkspaceGenerator(tree: Tree, { runAll, reports, reportsOutput }: ValidateWorkspaceGeneratorSchema): Promise<void> {
    await checkMigrationKitVersion(tree);
    await checkNodeVersion();

    let workspaceValidationResult = createWorkspaceValidationResult(WORKSPACE_VALIDATIONS);
    const selectedValidations = runAll ? 'all' : await selectValidations(WORKSPACE_VALIDATIONS);
    workspaceValidationResult = await runValidators(WORKSPACE_VALIDATIONS, tree, workspaceValidationResult, selectedValidations);
    await report(reports, workspaceValidationResult, reportsOutput ?? '');
    for (const validation of Object.values(workspaceValidationResult?.validationResults || [])) {
        if (validation.status === 'failed') {
            return Promise.reject('validate-workspace validation failed');
        }
    }
}

async function checkMigrationKitVersion(tree: Tree): Promise<void | string> {
    // Skipping if migration-kit is configured in tsconfig paths
    // meaning we are in the monorepo so it's always the latest version.
    if (hasMigrationKitInTsPaths(tree)) {
        return Promise.resolve();
    }

    const localVersion = getLocalMigrationKitVersion();
    const latestVersion = getMigrationKitLatestVersion();
    if (!localVersion?.includes(latestVersion)) {
        return Promise.reject(
            `Your migration-kit is outdated!!!\n You are using v${localVersion} but the latest is v${latestVersion}:\n You can upgrade by running yarn add @nx-validators/migration-kit@${latestVersion} -D`,
        );
    }

    return Promise.resolve();
}

async function checkNodeVersion(): Promise<void | string> {
    const nodeVersion = execSync('node -v', { stdio: 'pipe' }).toString();
    if (compare(nodeVersion, SUPPORTED_NODE_VERSION) === -1) {
        return Promise.reject(
            `Node.js is outdated!!!\nYour Node.js version is ${nodeVersion} but the migration-kit requires a Node.js version >= ${SUPPORTED_NODE_VERSION}.\n Please upgrade to latest LTS.`,
        );
    }

    return Promise.resolve();
}

async function runValidators(
    workspaceValidations: WorkspaceValidation,
    tree: Tree,
    workspaceResult: WorkspaceValidationResult,
    filterValidationIds: ValidationId[] | 'all',
): Promise<WorkspaceValidationResult> {
    const importValidator = async (validatorId: string): Promise<Validator> =>
        ((await import(`../validators/${validatorId}/generator`)) as ValidatorModule).default;

    for (const [validationId, validation] of Object.entries(workspaceValidations) as [ValidationId, Validation][]) {
        if (filterValidationIds === 'all' || filterValidationIds.includes(validationId)) {
            for (const validatorId of validation.validatorIds) {
                const validator = await importValidator(validatorId);

                const data = await validator(tree, {});
                const status: ResultStatus = data.some(({ status }) => status === 'failed') ? 'failed' : 'success';
                const validatorResult = { status, data };

                workspaceResult = updateValidatorResult(workspaceResult, validationId, validatorId, validatorResult);
            }
        }
    }
    return workspaceResult;
}

async function selectValidations(workspaceValidations: WorkspaceValidation): Promise<ValidationId[]> {
    return checkbox<ValidationId>({
        message: 'Choose validation to run:',
        choices: (Object.entries(workspaceValidations) as [ValidationId, Validation][]).map(([validationId, { name, validatorIds }]) => {
            const validatorCommands = validatorIds.map((validatorId) => `\n      -> nx g @nx-validators/migration-kit:${validatorId}`);
            return {
                name: `${name}${validatorCommands}`,
                value: validationId,
                checked: false,
            };
        }),
    });
}

export default validateWorkspaceGenerator;
