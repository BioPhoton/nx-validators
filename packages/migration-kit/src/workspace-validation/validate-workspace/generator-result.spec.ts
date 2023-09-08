import {
  ValidationId,
  ValidatorId,
  WorkspaceValidation,
  WorkspaceValidationResult,
} from '../../types/validation.types';
import {
  createWorkspaceValidationResult,
  updateValidatorResult,
} from './generator-result';

const mockedDate = new Date(2023, 7, 24);
jest.useFakeTimers().setSystemTime(mockedDate);

const WORKSPACE_RESULT_MOCK = {
  created: mockedDate.getTime(),
  validationResults: {
    'validation-one': {
      name: 'Validation One',
      description: 'First Validation',
      status: 'info',
      validatorResults: {
        'generator-id-one': {
          status: 'info',
          data: null,
          documentation: `/tree/master/Client/migration-kit/src/workspace-validation/validators/generator-id-one/README.md`,
        },
        'generator-id-two': {
          status: 'info',
          data: null,
          documentation: `/tree/master/Client/migration-kit/src/workspace-validation/validators/generator-id-two/README.md`,
        },
      },
    },
    'validation-two': {
      name: 'Validation Two',
      description: 'Second Validation',
      status: 'info',
      validatorResults: {
        'generator-id-three': {
          status: 'info',
          data: null,
          documentation: `/tree/master/Client/migration-kit/src/workspace-validation/validators/generator-id-three/README.md`,
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
    const workspaceResult = await createWorkspaceValidationResult(
      WORKSPACE_VALIDATION_MOCK
    );

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
      }
    );

    resultUpdated = await updateValidatorResult(
      resultUpdated,
      'validation-one' as ValidationId,
      'generator-id-one' as ValidatorId,
      {
        status: 'error',
        data: [{ expected: 'some failed data log', status: 'error' }],
      }
    );

    //EXPECT
    const expectedResult = {
      created: mockedDate.getTime(),
      validationResults: {
        'validation-one': {
          name: 'Validation One',
          description: 'First Validation',
          status: 'error',
          validatorResults: {
            'generator-id-one': {
              status: 'error',
              data: [{ expected: 'some failed data log', status: 'error' }],
              documentation: `/tree/master/Client/migration-kit/src/workspace-validation/validators/generator-id-one/README.md`,
            },
            'generator-id-two': {
              status: 'info',
              data: null,
              documentation: `/tree/master/Client/migration-kit/src/workspace-validation/validators/generator-id-two/README.md`,
            },
          },
        },
        'validation-two': {
          name: 'Validation Two',
          description: 'Second Validation',
          status: 'success',
          validatorResults: {
            'generator-id-three': {
              status: 'success',
              data: [{ expected: 'some success data log', status: 'success' }],
              documentation: `/tree/master/Client/migration-kit/src/workspace-validation/validators/generator-id-three/README.md`,
            },
          },
        },
      },
    };
    expect(resultUpdated).toEqual(expectedResult);
  });
});
