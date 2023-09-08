import type {
  ResultStatus,
  ValidationId,
  ValidatorId,
  ValidatorResult,
  WorkspaceValidation,
  WorkspaceValidationResult,
} from '../../types/validation.types';

const createValidatorDocumentationUrl = (validatorId: string): string =>
  `/tree/master/Client/migration-kit/src/workspace-validation/validators/${validatorId}/README.md`;

const createValidationResult = (
  acc,
  [validationId, { name, description, validatorIds }]
): WorkspaceValidationResult['validationResults'] => {
  return {
    ...acc,
    [validationId]: {
      name,
      description,
      status: 'info',
      validatorResults: validatorIds.reduce(
        (acc, validatorId): Record<ValidationId, ValidatorResult> => ({
          ...acc,
          [validatorId]: {
            status: 'info',
            data: null,
            documentation: createValidatorDocumentationUrl(validatorId),
          },
        }),
        {}
      ),
    },
  };
};

export function createWorkspaceValidationResult(
  workspaceValidation: WorkspaceValidation
): WorkspaceValidationResult {
  return {
    created: Date.now(),
    validationResults: Object.entries(workspaceValidation).reduce(
      createValidationResult,
      {}
    ),
  };
}

export const resultStatusPriorityOrder: ResultStatus[] = [
  'info',
  'success',
  'error',
];
export function updateValidatorResult(
  workspaceResult: WorkspaceValidationResult,
  validationId: ValidationId,
  validatorId: ValidatorId,
  validatorResult: ValidatorResult
): WorkspaceValidationResult {
  const currentValidationStatus =
    workspaceResult.validationResults[validationId].status;
  const validatorStatus = validatorResult.status;
  const newValidationStatus =
    resultStatusPriorityOrder.indexOf(validatorStatus) >
    resultStatusPriorityOrder.indexOf(currentValidationStatus)
      ? validatorStatus
      : currentValidationStatus;

  return {
    ...workspaceResult,
    validationResults: {
      ...workspaceResult.validationResults,
      [validationId]: {
        ...workspaceResult.validationResults[validationId],
        status: newValidationStatus,
        validatorResults: {
          ...workspaceResult.validationResults[validationId].validatorResults,
          [validatorId]: {
            ...workspaceResult.validationResults[validationId].validatorResults[
              validatorId
            ],
            ...validatorResult,
          },
        },
      },
    },
  };
}
