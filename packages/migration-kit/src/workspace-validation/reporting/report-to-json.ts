import { existsSync, mkdirSync, writeFileSync } from 'fs';

import { WorkspaceValidationResult } from '../../types/validation.types';

export default function reportToJson(result: WorkspaceValidationResult, reportsOutput: string): void {
    const REPORT_PATH = `${reportsOutput}/validate-workspace-report.${Date.now()}.json`;
    if (!existsSync(reportsOutput)) {
        mkdirSync(reportsOutput, { recursive: true });
    }
    writeFileSync(REPORT_PATH, JSON.stringify(result), { flag: 'a+' });

    console.log(`Report generated at ${REPORT_PATH}`);
}
