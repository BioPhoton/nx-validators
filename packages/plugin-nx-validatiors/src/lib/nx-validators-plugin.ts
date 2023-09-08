import { PluginConfig } from '@quality-metrics/models';
import { join } from 'path';
import {
  docsUrlBaseUrl,
  generateAuditsFromValidators,
  generateGroupsFromValidators,
} from './implementation/utils';
import { getDirname } from '../../test';

type NxValidatorsPluginConfig = {
  outputPath?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function nxValidatorsPlugin(config?: NxValidatorsPluginConfig) {
  const { outputPath } = config || {};
  return {
    audits: generateAuditsFromValidators(),
    groups: generateGroupsFromValidators(),
    runner: {
      command: 'npx',
      args: [
        'ts-node',
        join(getDirname(import.meta.url), 'bin.ts'),
        `--outputPath=${outputPath}`,
      ],
      outputPath: outputPath || 'nx-validators-plugin-runner-output.json',
    },
    meta: {
      // package and version optional
      slug: 'nx-validators',
      name: 'NxValidatorsPlugin',
      docsUrl: `${docsUrlBaseUrl}/README.md`,
    },
  } satisfies PluginConfig;
}
