import { readdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { AuditGroup, AuditMetadata } from '@quality-metrics/models';
import {
  validatorsFolder,
  WORKSPACE_VALIDATIONS,
  WorkspaceValidation,
} from '@nx-validators/migration-kit';
import { fileURLToPath } from 'url';

export const getDirname = (import_meta_url: string) =>
  dirname(fileURLToPath(import_meta_url));

export const docsUrlBaseUrl =
  'https://github.com/BioPhoton/nx-validators/tree/main';
export const migrationKitRootUrl = `${docsUrlBaseUrl}/packages/migration-kit`;

function auditsFromValidatorFolder(slug: string) {
  const readmePath = join(validatorsFolder, slug, 'README.md');
  const readmeText = readFileSync(readmePath, 'utf8');

  const title = readmeText.match(/^# (.*)/)?.[1] + '';
  const description = readmeText.match(/## Description\n(.*)/)?.[1] || '';
  return {
    slug,
    title,
    description,
    docsUrl: `${migrationKitRootUrl}/lib/workspace-validation/validators/${slug}/Readme.md`,
  } satisfies AuditMetadata;
}

export function generateAuditsFromValidators(): AuditMetadata[] {
  const validatorFolder = readdirSync(validatorsFolder, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  return validatorFolder.map((folder) => auditsFromValidatorFolder(folder));
}

export function generateGroupsFromValidators() {
  const groups: AuditGroup[] = [];

  for (const slug in WORKSPACE_VALIDATIONS) {
    const { name, validatorIds, description } =
      WORKSPACE_VALIDATIONS[slug as keyof WorkspaceValidation];
    groups.push({
      slug,
      description,
      title: name,
      refs: validatorIds.map((auditRef) => ({
        slug: auditRef.toString(),
        weight: 0,
      })),
    });
  }

  return groups;
}
