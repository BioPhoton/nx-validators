import { WorkspaceValidationResult } from './validation.types';

export type ReportType = 'json' | 'console';
export type ReportTypes = ReportType[];

export type ReportArgs = {
    result: WorkspaceValidationResult;
    hasFinished: boolean;
    reportsOutput: string;
    showPassed: boolean;
};

export type Report = (reportArgs: ReportArgs) => void;
export type ReportModule = { default: Report };
