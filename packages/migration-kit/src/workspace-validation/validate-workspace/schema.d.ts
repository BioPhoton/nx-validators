import { ReportTypes } from '../../types/reports.types';

export interface ValidateWorkspaceGeneratorSchema {
    runAll: boolean;
    reports: ReportTypes;
    reportsOutput?: string;
    showPassed?: boolean;
}
