import { CancelablePromise } from '@inquirer/type';
import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import * as child_process from 'child_process';

import { report } from '../reporting/report';
import * as generatorResult from './generator-result';
import { ValidateWorkspaceGeneratorSchema } from './schema';

async function mockCheckboxPrompt(validatorIds: string[]): Promise<void> {
    jest.spyOn(await import('@inquirer/prompts'), 'checkbox').mockImplementation(() => {
        return validatorIds as unknown as CancelablePromise<unknown[]>;
    });
}

const hasMigrationKitInTsPathsMock = jest.fn(() => false);
jest.mock('../../utils/config-files.utils', () => ({
    hasMigrationKitInTsPaths: hasMigrationKitInTsPathsMock,
}));

const getLocalMigrationKitVersionMock = jest.fn(() => '0.5.0');
const getMigrationKitLatestVersionMock = jest.fn(() => '0.5.0');
jest.mock('../../utils/npm-package.utils', () => ({
    getLocalMigrationKitVersion: getLocalMigrationKitVersionMock,
    getMigrationKitLatestVersion: getMigrationKitLatestVersionMock,
}));

jest.mock('../validators/generator-id-success/generator', () => ({ default: jest.fn().mockResolvedValue([{ status: 'success' }]) }), {
    virtual: true,
});

jest.mock('../reporting/report', () => ({
    report: jest.fn(),
}));

jest.spyOn(child_process, 'execSync').mockImplementation(() => '18.0.0');

const workspaceValidationMock = jest.fn();
jest.mock('./workspace-validations', () => ({
    get WORKSPACE_VALIDATIONS() {
        return workspaceValidationMock();
    },
}));

const ORIGINAL_ENV = process.env;

describe('Validate Workspace Generator', () => {
    let tree: Tree;

    const createWorkspaceValidationResultSpy = jest.spyOn(generatorResult, 'createWorkspaceValidationResult');
    const updateValidatorResultSpy = jest.spyOn(generatorResult, 'updateValidatorResult');

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
        jest.clearAllMocks();
        process.env = {
            ...ORIGINAL_ENV,
            GITLAB_PRIVATE_TOKEN: 'mock-gitlab-private-token',
        };
    });

    afterEach(() => {
        process.env = ORIGINAL_ENV;
    });

    describe('Test Validation Filter', () => {
        const validationOne = {
            name: 'Validation One',
            description: 'First Validation',
            validatorIds: ['generator-id-success'],
        };
        const validationTwo = {
            name: 'Validation Two',
            description: 'Second Validation',
            validatorIds: ['generator-id-success'],
        };
        const workspaceValidations = {
            'validation-one': validationOne,
            'validation-two': validationTwo,
        };

        beforeEach(() => {
            workspaceValidationMock.mockReturnValue(workspaceValidations);
        });

        it('should run all validations by default', async () => {
            // GIVEN
            const schema: ValidateWorkspaceGeneratorSchema = {
                runAll: true,
                reports: ['json', 'console'],
            };
            // TEST
            const { validateWorkspaceGenerator } = await import('./generator');
            await validateWorkspaceGenerator(tree, schema);

            // EXPECT
            expect(createWorkspaceValidationResultSpy).toHaveBeenCalledWith(workspaceValidations);

            expect(updateValidatorResultSpy).toHaveBeenCalledWith(expect.any(Object), 'validation-one', 'generator-id-success', {
                status: 'success',
                data: [{ status: 'success' }],
            });
            expect(updateValidatorResultSpy).toHaveBeenCalledWith(expect.any(Object), 'validation-two', 'generator-id-success', {
                status: 'success',
                data: [{ status: 'success' }],
            });

            expect(updateValidatorResultSpy).toHaveBeenCalledTimes(2);
            expect(report).toHaveBeenCalled();
        });

        it('should run only validation-one validators', async () => {
            // GIVEN
            const schema: ValidateWorkspaceGeneratorSchema = {
                runAll: false,
                reports: ['json', 'console'],
            };
            await mockCheckboxPrompt(['validation-two']);

            // TEST
            const { validateWorkspaceGenerator } = await import('./generator');
            await validateWorkspaceGenerator(tree, schema);

            // EXPECT
            expect(createWorkspaceValidationResultSpy).toHaveBeenCalledWith(workspaceValidations);

            expect(updateValidatorResultSpy).toHaveBeenCalledWith(expect.any(Object), 'validation-two', 'generator-id-success', {
                status: 'success',
                data: [{ status: 'success' }],
            });

            expect(updateValidatorResultSpy).toHaveBeenCalledTimes(1);
            expect(report).toHaveBeenCalled();
        });
    });

    describe('Test Validator Result Form data', () => {
        it(`should have success result`, async () => {
            // GIVEN
            const validationOne = {
                name: 'Validation One',
                description: 'First Validation',
                validatorIds: [`generator-id-success`],
            };
            const workspaceValidations = {
                'validation-one': validationOne,
            };
            workspaceValidationMock.mockReturnValue(workspaceValidations);
            const schema: ValidateWorkspaceGeneratorSchema = {
                runAll: true,
                reports: ['json'],
            };

            // TEST
            const { validateWorkspaceGenerator } = await import('./generator');
            await validateWorkspaceGenerator(tree, schema);

            // EXPECT
            expect(createWorkspaceValidationResultSpy).toHaveBeenCalledWith(workspaceValidations);

            expect(updateValidatorResultSpy).toHaveBeenCalledWith(expect.any(Object), 'validation-one', `generator-id-success`, {
                status: 'success',
                data: [{ status: 'success' }],
            });

            expect(updateValidatorResultSpy).toHaveBeenCalledTimes(1);
            expect(report).toHaveBeenCalled();
        });
        it(`should have failed result`, async () => {
            // GIVEN
            jest.mock(
                '../validators/generator-id-failed/generator',
                () => ({ default: jest.fn().mockResolvedValue([{ status: 'failed' }, { status: 'success' }]) }),
                {
                    virtual: true,
                },
            );
            const validationOne = {
                name: 'Validation One',
                description: 'First Validation',
                validatorIds: [`generator-id-failed`, `generator-id-success`],
            };
            const workspaceValidations = {
                'validation-one': validationOne,
            };
            workspaceValidationMock.mockReturnValue(workspaceValidations);
            const schema: ValidateWorkspaceGeneratorSchema = {
                runAll: true,
                reports: ['json'],
            };

            // TEST
            try {
                const { validateWorkspaceGenerator } = await import('./generator');
                await validateWorkspaceGenerator(tree, schema);
                expect(true).toBeFalsy();
            } catch (e: unknown) {
                // EXPECT
                expect(createWorkspaceValidationResultSpy).toHaveBeenCalledWith(workspaceValidations);

                expect(updateValidatorResultSpy).toHaveBeenCalledWith(expect.any(Object), 'validation-one', `generator-id-failed`, {
                    status: 'failed',
                    data: [{ status: 'failed' }, { status: 'success' }],
                });

                expect(updateValidatorResultSpy).toHaveBeenCalledWith(expect.any(Object), 'validation-one', `generator-id-success`, {
                    status: 'success',
                    data: [{ status: 'success' }],
                });

                expect(updateValidatorResultSpy).toHaveBeenCalledTimes(2);
                expect(report).toHaveBeenCalled();
                expect(e).toBe('validate-workspace validation failed');
            }
        });
    });

    describe('Test Report Types', () => {
        it('should reports only json', async () => {
            // GIVEN
            const validationOne = {
                name: 'Validation One',
                description: 'First Validation',
                validatorIds: ['generator-id-success'],
            };
            const workspaceValidations = {
                'validation-one': validationOne,
            };
            workspaceValidationMock.mockReturnValue(workspaceValidations);
            const schema: ValidateWorkspaceGeneratorSchema = {
                runAll: true,
                reports: ['json'],
                reportsOutput: '.',
            };

            // TEST
            const { validateWorkspaceGenerator } = await import('./generator');
            await validateWorkspaceGenerator(tree, schema);

            // EXPECT
            expect(createWorkspaceValidationResultSpy).toHaveBeenCalledWith(workspaceValidations);

            expect(updateValidatorResultSpy).toHaveBeenCalledWith(expect.any(Object), 'validation-one', 'generator-id-success', {
                status: 'success',
                data: [{ status: 'success' }],
            });

            expect(updateValidatorResultSpy).toHaveBeenCalledTimes(1);
            expect(report).toHaveBeenCalledWith(['json'], expect.any(Object), true, '.', false);
        });
    });

    describe('Check node version', () => {
        it('Throw if nodejs version is outdated', async () => {
            jest.spyOn(child_process, 'execSync').mockImplementation(() => '17.0.0');

            const schema: ValidateWorkspaceGeneratorSchema = {
                runAll: true,
                reports: [],
            };

            const { validateWorkspaceGenerator } = await import('./generator');
            await expect(validateWorkspaceGenerator(tree, schema)).rejects.toMatch('Node.js is outdated');
        });

        it('Pass if migration-kit is up-to-date', async () => {
            jest.spyOn(child_process, 'execSync').mockImplementation(() => '18.0.0');

            const schema: ValidateWorkspaceGeneratorSchema = {
                runAll: true,
                reports: ['console'],
            };

            const { validateWorkspaceGenerator } = await import('./generator');
            await expect(validateWorkspaceGenerator(tree, schema)).resolves.toEqual(undefined);
        });

        it('Pass if migration-kit is newer', async () => {
            jest.spyOn(child_process, 'execSync').mockImplementation(() => '20.0.0');

            const schema: ValidateWorkspaceGeneratorSchema = {
                runAll: true,
                reports: ['console'],
            };

            const { validateWorkspaceGenerator } = await import('./generator');
            await expect(validateWorkspaceGenerator(tree, schema)).resolves.toEqual(undefined);
        });
    });

    describe('Check outdated migration-kit', () => {
        it('Throw if migration-kit is outdated', async () => {
            hasMigrationKitInTsPathsMock.mockReturnValue(false);
            getLocalMigrationKitVersionMock.mockReturnValue('0.5.0');
            getMigrationKitLatestVersionMock.mockReturnValue('0.6.0');

            const schema: ValidateWorkspaceGeneratorSchema = {
                runAll: true,
                reports: ['console'],
            };

            const { validateWorkspaceGenerator } = await import('./generator');
            await expect(validateWorkspaceGenerator(tree, schema)).rejects.toMatch('migration-kit is outdated');
        });

        it('Pass if migration-kit is present in ts-config paths', async () => {
            hasMigrationKitInTsPathsMock.mockReturnValue(true);

            const schema: ValidateWorkspaceGeneratorSchema = {
                runAll: true,
                reports: ['console'],
            };

            const { validateWorkspaceGenerator } = await import('./generator');
            await expect(validateWorkspaceGenerator(tree, schema)).resolves.toEqual(undefined);
        });

        it('Pass if migration-kit is up-to-date', async () => {
            hasMigrationKitInTsPathsMock.mockReturnValue(false);
            getLocalMigrationKitVersionMock.mockReturnValue('0.6.0');
            getMigrationKitLatestVersionMock.mockReturnValue('0.6.0');

            const schema: ValidateWorkspaceGeneratorSchema = {
                runAll: true,
                reports: ['console'],
            };

            const { validateWorkspaceGenerator } = await import('./generator');
            await expect(validateWorkspaceGenerator(tree, schema)).resolves.toEqual(undefined);
        });
    });
});
