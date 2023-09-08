import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { AuditMetadata, AuditGroup } from '@quality-metrics/models';
import {
  GroupSlugs,
  validatorsFolder,
  WORKSPACE_VALIDATIONS,
} from '@nx-validators/migration-kit';

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
    const { title, audits, description } =
      WORKSPACE_VALIDATIONS[slug as GroupSlugs];
    groups.push({
      slug,
      description,
      title,
      refs: audits.map((auditRef) => ({
        slug: auditRef.toString(),
        weight: 0,
      })),
    });
  }

  return groups;
}
