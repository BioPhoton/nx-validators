import { join } from 'path';
import { readdir, readFile } from 'fs/promises';
import { executeProcess } from '@quality-metrics/utils';
import {
  RunnerOutput,
  runnerOutputSchema,
  Issue,
} from '@quality-metrics/models';
import { WorkspaceValidationResult } from '@nx-validators/migration-kit';

export async function run(config: {
  outputPath: string;
}): Promise<RunnerOutput> {
  const reportsOutput = config?.outputPath || 'dist/reports/nx-validators';

  await executeProcess({
    command: 'nx',
    args: [
      'g',
      '@nx-validators/migration-kit:validate-workspace',
      '--reports=json',
      `--reportsOutput=${reportsOutput}`,
    ],
    observer: { next: console.log },
  });

  const fileName = await readdir(reportsOutput).then((dir) =>
    dir.filter((file) => file.includes('validate-workspace-report')).pop()
  );
  if (!fileName) {
    throw new Error(
      `No file with pattern 'validate-workspace-report.*.json' found in ${join(
        reportsOutput
      )}.`
    );
  }

  const reportPath = join(reportsOutput, fileName);

  const validateWorkspaceReport: WorkspaceValidationResult = await readFile(
    reportPath
  ).then((b) => JSON.parse(b.toString()));
  console.log('validateWorkspaceReport: ', validateWorkspaceReport);
  const runnerOutput: RunnerOutput = {
    audits: [],
  };
  for (const group in validateWorkspaceReport) {
    const validatorResults =
      validateWorkspaceReport.validationResults[
        group as keyof WorkspaceValidationResult['validationResults']
      ].validatorResults;
    for (const slug in validatorResults) {
      runnerOutput.audits.push({
        slug,
        value: validatorResults[slug].severity === 'success' ? 1 : 0,
        details: {
          issues: validatorResults[slug].data.map(
            ({ severity, message }) => ({ message, severity } satisfies Issue)
          )
        },
      });
    }
  }
  try {
    return runnerOutputSchema.parse(runnerOutput);
  } catch (e) {
    throw new Error(`Can't parse content form file ${reportPath}`);
  }
}
