import { WorkspaceValidationResult } from './validation.types';

export type ReportType = 'json' | 'console';
export type ReportTypes = ReportType[];

export type Report = (result: WorkspaceValidationResult, reportsOutput: string) => void;
export type ReportModule = { default: Report };
