import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { rename } from 'fs-extra';

import { ReportArgs } from '../../types/reports.types';
import { WorkspaceValidationResult } from '../../types/validation.types';

function updateReport(reportPath: string, result: WorkspaceValidationResult): void {
    if (!existsSync(reportPath)) {
        writeFileSync(reportPath, JSON.stringify(result));
        return;
    }
    const fileContent: WorkspaceValidationResult = JSON.parse(readFileSync(reportPath, 'utf-8'));
    writeFileSync(
        reportPath,
        JSON.stringify({
            ...result,
            validationResults: {
                ...fileContent.validationResults,
                ...result.validationResults,
            },
        }),
    );
}

export default function reportToJson({ result, hasFinished, reportsOutput }: ReportArgs): void {
    const REPORT_PATH = `${reportsOutput}/validate-workspace-report.json`;
    if (!existsSync(reportsOutput)) {
        mkdirSync(reportsOutput, { recursive: true });
    }

    updateReport(REPORT_PATH, result);

    if (hasFinished) {
        const fileNameWithoutExtension = REPORT_PATH.split('.json')[0];
        const newName = `${fileNameWithoutExtension}.${Date.now()}.json`;
        rename(REPORT_PATH, newName, (err) => {
            console.error(err);
        });
        console.log(`Report generated at ${newName}`);
    }
}
