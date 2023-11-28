import { ResultStatus, ValidationResult, ValidatorResultWithDoc, WorkspaceValidation } from '../src/types/validation.types';

export const WORKSPACE_VALIDATIONS_MOCK = {
    'validation-one': {
        name: 'Validation One',
        description: 'First Validation',
        validatorIds: ['generator-id-success', 'generator-id-failed'],
    },
    'validation-two': {
        name: 'Validation Two',
        description: 'Second Validation',
        validatorIds: ['generator-id-error'],
    },
} as unknown as WorkspaceValidation;

export const generateValidatorResult = (status: ResultStatus): ValidatorResultWithDoc => ({
    data: [],
    documentation: `https://vie.git.bwinparty.com/vanilla/monorepo/-/tree/main/packages/migration-kit/src/workspace-validation/validators/generator-id-${status}/README.md`,
    status,
});

export const generateValidationResult = (status: ResultStatus): ValidationResult =>
    ({
        description: `Validation ${status}`,
        name: `Validation ${status}`,
        status,
        validatorResults: {
            [`generator-id-${status}`]: generateValidatorResult(status),
        },
    } as ValidationResult);
