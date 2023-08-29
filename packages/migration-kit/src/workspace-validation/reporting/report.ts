import { ReportModule, ReportTypes } from '../../types/reports.types';
import { WorkspaceValidationResult } from '../../types/validation.types';

export const report = async (reportTypes: ReportTypes, result: WorkspaceValidationResult, reportsOutput: string): Promise<void> => {
    for (const reportType of reportTypes) {
        const reportToFn = ((await import(`./report-to-${reportType}`)) as ReportModule).default;
        await reportToFn(result, reportsOutput);
    }
};
