import { checkbox } from '@inquirer/prompts';
import { Tree } from '@nx/devkit';
import { execSync } from 'child_process';
import { compare } from 'semver';

import type {
  ResultStatus,
  Validation,
  ValidationId,
  Validator,
  ValidatorId,
  ValidatorModule,
  WorkspaceValidation,
  WorkspaceValidationResult,
} from '../../types/validation.types';
import { report } from '../reporting/report';
import {
  createWorkspaceValidationResult,
  updateValidatorResult,
} from './generator-result';
import type { ValidateWorkspaceGeneratorSchema } from './schema';
import { WORKSPACE_VALIDATIONS } from './workspace-validations';

const SUPPORTED_NODE_VERSION = '18.0.0';

export async function validateWorkspaceGenerator(
  tree: Tree,
  { runAll, reports, reportsOutput }: ValidateWorkspaceGeneratorSchema
): Promise<void> {
  const unsupportedValidators = [];
  const nodeVersion = execSync('node -v', { stdio: 'pipe' }).toString();
  if (compare(nodeVersion, SUPPORTED_NODE_VERSION) === -1) {
    unsupportedValidators.push('check-eslint-config', 'check-version-mismatch');
  }

  let workspaceValidationResult = createWorkspaceValidationResult(
    WORKSPACE_VALIDATIONS
  );
  const selectedValidations = runAll
    ? 'all'
    : await selectValidations(WORKSPACE_VALIDATIONS);
  workspaceValidationResult = await runValidators(
    WORKSPACE_VALIDATIONS,
    tree,
    workspaceValidationResult,
    selectedValidations,
    unsupportedValidators
  );
  await report(reports, workspaceValidationResult, reportsOutput);
  for (const validation of Object.values(
    workspaceValidationResult?.validationResults || []
  )) {
    if (validation.status === 'failed') {
      return Promise.reject('validate-workspace validation failed');
    }
  }
}

async function runValidators(
  workspaceValidations: WorkspaceValidation,
  tree: Tree,
  workspaceResult: WorkspaceValidationResult,
  filterValidationIds: ValidationId[] | 'all',
  skipValidatorIds: ValidatorId[]
): Promise<WorkspaceValidationResult> {
  const importValidator = async (validatorId: string): Promise<Validator> =>
    (
      (await import(
        `../validators/${validatorId}/generator`
      )) as ValidatorModule
    ).default;

  for (const [validationId, validation] of Object.entries(
    workspaceValidations
  ) as [ValidationId, Validation][]) {
    if (
      filterValidationIds === 'all' ||
      filterValidationIds.includes(validationId)
    ) {
      const validatorIds = validation.validatorIds.filter(
        (validatorId) => !skipValidatorIds.includes(validatorId)
      );
      for (const validatorId of validatorIds) {
        const validator = await importValidator(validatorId);
        const data = await validator(tree, {});
        const status: ResultStatus = data.some(
          ({ status }) => status === 'failed'
        )
          ? 'failed'
          : 'success';
        const validatorResult = { status, data };

        workspaceResult = updateValidatorResult(
          workspaceResult,
          validationId,
          validatorId,
          validatorResult
        );
      }
    }
  }
  return workspaceResult;
}

async function selectValidations(
  workspaceValidations: WorkspaceValidation
): Promise<ValidationId[]> {
  return checkbox<ValidationId>({
    message: 'Choose validation to run:',
    choices: (
      Object.entries(workspaceValidations) as [ValidationId, Validation][]
    ).map(([validationId, { name, validatorIds }]) => {
      const validatorCommands = validatorIds.map(
        (validatorId) =>
          `\n      -> nx g @frontend/migration-kit:${validatorId}`
      );
      return {
        name: `${name}${validatorCommands}`,
        value: validationId,
        checked: false,
      };
    }),
  });
}

export default validateWorkspaceGenerator;
