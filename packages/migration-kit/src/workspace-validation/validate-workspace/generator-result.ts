import type {
    ResultStatus,
    TotalStatus,
    ValidationId,
    ValidatorId,
    ValidatorResult,
    WorkspaceValidation,
    WorkspaceValidationResult,
} from '../../types/validation.types';

const createValidatorDocumentationUrl = (validatorId: string): string =>
    `https://vie.git.bwinparty.com/vanilla/monorepo/-/tree/main/packages/migration-kit/src/workspace-validation/validators/${validatorId}/README.md`;

// @TODO: FIX TYPING
const createValidationResult = (
    acc: any,
    [validationId, { name, description, validatorIds }]: any,
): WorkspaceValidationResult['validationResults'] => {
    return {
        ...acc,
        [validationId]: {
            name,
            description,
            status: 'skip',
            total: {
                failed: 0,
                skip: validatorIds.length,
                success: 0,
            },
            validatorResults: validatorIds.reduce(
                (acc: Record<ValidationId, ValidatorResult>, validatorId: string): Record<ValidationId, ValidatorResult> => ({
                    ...acc,
                    [validatorId]: {
                        status: 'skip',
                        data: null,
                        documentation: createValidatorDocumentationUrl(validatorId),
                    },
                }),
                {},
            ),
        },
    };
};

const resultStatusPriorityOrder: ResultStatus[] = ['skip', 'info', 'success', 'failed'];
const updateStatus = (fromStatus: ResultStatus, validatorStatusToApply: ResultStatus): ResultStatus =>
    resultStatusPriorityOrder.indexOf(validatorStatusToApply) > resultStatusPriorityOrder.indexOf(fromStatus) ? validatorStatusToApply : fromStatus;

const updateTotal = (fromTotal: TotalStatus, validatorStatusToApply: ResultStatus): TotalStatus => {
    const newTotal = {
        ...fromTotal,
        skip: fromTotal.skip - 1,
    };

    if (validatorStatusToApply === 'info') {
        return newTotal;
    }

    newTotal[validatorStatusToApply] = fromTotal[validatorStatusToApply] + 1;

    return newTotal;
};

export function createWorkspaceValidationResult(workspaceValidation: WorkspaceValidation): WorkspaceValidationResult {
    const countValidators = Object.values(workspaceValidation).reduce((total, validation) => total + validation.validatorIds.length, 0);

    return {
        created: Date.now(),
        status: 'skip',
        total: {
            failed: 0,
            skip: countValidators,
            success: 0,
        },
        validationResults: Object.entries(workspaceValidation).reduce(createValidationResult, {}),
    };
}

export function updateValidatorResult(
    workspaceResult: WorkspaceValidationResult,
    validationId: ValidationId,
    validatorId: ValidatorId,
    validatorResult: ValidatorResult,
): WorkspaceValidationResult {
    return {
        ...workspaceResult,
        status: updateStatus(workspaceResult.status, validatorResult.status),
        total: updateTotal(workspaceResult.total, validatorResult.status),
        validationResults: {
            ...workspaceResult.validationResults,
            [validationId]: {
                ...workspaceResult.validationResults[validationId],
                status: updateStatus(workspaceResult.validationResults[validationId].status, validatorResult.status),
                total: updateTotal(workspaceResult.validationResults[validationId].total, validatorResult.status),
                validatorResults: {
                    ...workspaceResult.validationResults[validationId].validatorResults,
                    [validatorId]: { ...workspaceResult.validationResults[validationId].validatorResults[validatorId], ...validatorResult },
                },
            },
        },
    };
}
