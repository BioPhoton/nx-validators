import { checkbox } from '@inquirer/prompts';
import { Tree } from '@nx/devkit';
import { execSync } from 'child_process';
import { resolve } from 'path';
import { compare } from 'semver';

import { ReportTypes } from '../../types/reports.types';
import type {
    DataLog,
    ResultStatus,
    Validation,
    ValidationId,
    ValidationResult,
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

const processedValidations: ValidationId[] = [];

export async function validateWorkspaceGenerator(
    tree: Tree,
    { runAll, reports, reportsOutput, showPassed }: ValidateWorkspaceGeneratorSchema,
): Promise<void> {
    await checkMigrationKitVersion(tree);
    await checkNodeVersion();
    await checkGitLabApiToken();

    let workspaceValidationResult = createWorkspaceValidationResult(WORKSPACE_VALIDATIONS);
    const selectedValidations = runAll ? 'all' : await selectValidations(WORKSPACE_VALIDATIONS);
    workspaceValidationResult = await runValidators(
        WORKSPACE_VALIDATIONS,
        tree,
        workspaceValidationResult,
        selectedValidations,
        reports,
        showPassed,
        reportsOutput,
    );
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

async function checkGitLabApiToken(): Promise<void | string> {
    if (!process.env['GITLAB_PRIVATE_TOKEN']) {
        return Promise.reject(
            `A gitlab token is required for validating the workspace. \n- Local Run: you need GITLAB_PRIVATE_TOKEN=[your token] in a .env file of your repository\n- CI Run: a CI_JOB_TOKEN is needed`,
        );
    }

    return Promise.resolve();
}

function computeValidationStatus(data: DataLog[]): ResultStatus {
    return data.some(({ status }) => status === 'info') ? 'info' : data.some(({ status }) => status === 'failed') ? 'failed' : 'success';
}

function hasValidationFinished(allValidations: ValidationId[]): boolean {
    return allValidations.every((validation) => processedValidations.includes(validation));
}

function pickCurrentValidationResult(workspaceResult: WorkspaceValidationResult, validationId: ValidationId): WorkspaceValidationResult {
    return {
        ...workspaceResult,
        validationResults: {
            [validationId]: workspaceResult.validationResults[validationId],
        } as Record<ValidationId, ValidationResult>,
    };
}

async function runValidators(
    workspaceValidations: WorkspaceValidation,
    tree: Tree,
    workspaceResult: WorkspaceValidationResult,
    filterValidationIds: ValidationId[] | 'all',
    reports: ReportTypes,
    showPassed: boolean = false,
    reportsOutput?: string,
): Promise<WorkspaceValidationResult> {
    const importValidator = async (validatorId: string): Promise<Validator> => {
        const validatorPath = resolve(__dirname, `../validators/${validatorId}/generator`);
        return ((await import(validatorPath)) as ValidatorModule).default;
    };

    for (const [validationId, validation] of Object.entries(workspaceValidations) as [ValidationId, Validation][]) {
        if (filterValidationIds === 'all' || filterValidationIds.includes(validationId)) {
            for (const validatorId of validation.validatorIds) {
                const validator = await importValidator(validatorId);

                const data: DataLog[] = await validator(tree, {}).catch((error: Error) => {
                    return [
                        {
                            expected: `Validator ${validatorId} should run successfully.`,
                            status: 'failed',
                            log: error.message,
                        },
                    ];
                });
                const status = computeValidationStatus(data);
                const validatorResult = { status, data };

                workspaceResult = updateValidatorResult(workspaceResult, validationId, validatorId, validatorResult);
            }
            processedValidations.push(validationId);
            const validationIds = filterValidationIds === 'all' ? (Object.keys(workspaceValidations) as ValidationId[]) : filterValidationIds;
            const validationResult = pickCurrentValidationResult(workspaceResult, validationId);
            const hasFinished = hasValidationFinished(validationIds);
            await report(reports, validationResult, hasFinished, reportsOutput ?? '', showPassed);
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
