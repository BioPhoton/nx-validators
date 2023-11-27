import { ValidationId, ValidatorId, WorkspaceValidation, WorkspaceValidationResult } from '../../types/validation.types';
import { createWorkspaceValidationResult, updateValidatorResult } from './generator-result';

const mockedDate = new Date(2023, 7, 24);
jest.useFakeTimers().setSystemTime(mockedDate);

const WORKSPACE_RESULT_MOCK = {
    created: mockedDate.getTime(),
    status: 'skip',
    total: {
        skip: 3,
        failed: 0,
        success: 0,
    },
    validationResults: {
        'validation-one': {
            name: 'Validation One',
            description: 'First Validation',
            status: 'skip',
            total: {
                skip: 2,
                failed: 0,
                success: 0,
            },
            validatorResults: {
                'generator-id-one': {
                    status: 'skip',
                    data: null,
                    documentation: `https://vie.git.bwinparty.com/vanilla/monorepo/-/tree/main/packages/migration-kit/src/workspace-validation/validators/generator-id-one/README.md`,
                },
                'generator-id-two': {
                    status: 'skip',
                    data: null,
                    documentation: `https://vie.git.bwinparty.com/vanilla/monorepo/-/tree/main/packages/migration-kit/src/workspace-validation/validators/generator-id-two/README.md`,
                },
            },
        },
        'validation-two': {
            name: 'Validation Two',
            description: 'Second Validation',
            status: 'skip',
            total: {
                skip: 1,
                failed: 0,
                success: 0,
            },
            validatorResults: {
                'generator-id-three': {
                    status: 'skip',
                    data: null,
                    documentation: `https://vie.git.bwinparty.com/vanilla/monorepo/-/tree/main/packages/migration-kit/src/workspace-validation/validators/generator-id-three/README.md`,
                },
            },
        },
    },
};

describe('Test result management for validate workspace generator', () => {
    it('should create validation result seed', async () => {
        //GIVEN
        const WORKSPACE_VALIDATION_MOCK = {
            'validation-one': {
                name: 'Validation One',
                description: 'First Validation',
                validatorIds: ['generator-id-one', 'generator-id-two'],
            },
            'validation-two': {
                name: 'Validation Two',
                description: 'Second Validation',
                validatorIds: ['generator-id-three'],
            },
        } as unknown as WorkspaceValidation;

        // TEST
        const workspaceResult = await createWorkspaceValidationResult(WORKSPACE_VALIDATION_MOCK);

        //EXPECT
        expect(workspaceResult).toEqual(WORKSPACE_RESULT_MOCK);
    });

    it('should update validation result seed', async () => {
        // TEST
        let resultUpdated = await updateValidatorResult(
            WORKSPACE_RESULT_MOCK as unknown as WorkspaceValidationResult,
            'validation-two' as ValidationId,
            'generator-id-three' as ValidatorId,
            {
                status: 'success',
                data: [{ expected: 'some success data log', status: 'success' }],
            },
        );

        resultUpdated = await updateValidatorResult(resultUpdated, 'validation-one' as ValidationId, 'generator-id-one' as ValidatorId, {
            status: 'failed',
            data: [{ expected: 'some failed data log', status: 'failed' }],
        });

        //EXPECT
        const expectedResult = {
            created: mockedDate.getTime(),
            status: 'failed',
            total: {
                skip: 1,
                failed: 1,
                success: 1,
            },
            validationResults: {
                'validation-one': {
                    name: 'Validation One',
                    description: 'First Validation',
                    status: 'failed',
                    total: {
                        skip: 1,
                        failed: 1,
                        success: 0,
                    },
                    validatorResults: {
                        'generator-id-one': {
                            status: 'failed',
                            data: [{ expected: 'some failed data log', status: 'failed' }],
                            documentation: `https://vie.git.bwinparty.com/vanilla/monorepo/-/tree/main/packages/migration-kit/src/workspace-validation/validators/generator-id-one/README.md`,
                        },
                        'generator-id-two': {
                            status: 'skip',
                            data: null,
                            documentation: `https://vie.git.bwinparty.com/vanilla/monorepo/-/tree/main/packages/migration-kit/src/workspace-validation/validators/generator-id-two/README.md`,
                        },
                    },
                },
                'validation-two': {
                    name: 'Validation Two',
                    description: 'Second Validation',
                    status: 'success',
                    total: {
                        skip: 0,
                        failed: 0,
                        success: 1,
                    },
                    validatorResults: {
                        'generator-id-three': {
                            status: 'success',
                            data: [{ expected: 'some success data log', status: 'success' }],
                            documentation: `https://vie.git.bwinparty.com/vanilla/monorepo/-/tree/main/packages/migration-kit/src/workspace-validation/validators/generator-id-three/README.md`,
                        },
                    },
                },
            },
        };
        expect(resultUpdated).toEqual(expectedResult);
    });
});
