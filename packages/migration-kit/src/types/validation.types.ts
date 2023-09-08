import { Tree } from '@nx/devkit';

import * as generatorsSchema from '../../generators.json';

export type ValidatorId = Exclude<keyof typeof generatorsSchema.generators, 'validate-workspace'>;

export interface Validation {
    name: string;
    description: string;
    validatorIds: ValidatorId[];
}

export type ValidationId = 'use-nx-tooling' | 'use-quality-tooling' | 'use-workspace-layout' | 'normalize-typescript-config';
export type WorkspaceValidation = Record<ValidationId, Validation>;

export type ResultStatus = 'success' | 'warning' | 'error' | 'info';

export type DataLog = {
    expected: string;
    status: ResultStatus;
    log?: string;
};

export interface ValidatorResult {
    status: ResultStatus;
    data: DataLog[];
}

export type ValidatorResultWithDoc = ValidatorResult & { documentation: string };

export type Validator<T = unknown> = (tree: Tree, schema: T) => Promise<DataLog[]>;

export type ValidatorModule = { default: Validator };

export interface ValidationResult {
    name: string;
    description: string;
    status: ResultStatus;
    validatorResults: Record<ValidatorId, ValidatorResultWithDoc>;
}

export type WorkspaceValidationResult = {
    created: number;
    validationResults: Record<ValidationId, ValidationResult>;
};
