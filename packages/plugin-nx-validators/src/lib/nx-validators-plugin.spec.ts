import { afterEach, describe, expect, it } from 'vitest';
import { nxValidatorsPlugin } from './nx-validators-plugin';
import { pluginConfigSchema, Report } from '@quality-metrics/models';
import { readFile } from 'fs/promises';
import { cli } from '@quality-metrics/cli';
import { mockConfig, getDirname } from '../../test';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { unlinkSync, existsSync } from 'fs';
import {} from '@nx/plugin/testing';

const pluginSlug = 'nx-validators';
const outputPath = 'dist/reports/nx-validators';
const configPath = join(getDirname(import.meta.url), 'code-pushup.config.js');

describe('nxValidatorsPlugin', () => {
  afterEach(async () => {
    if (existsSync(configPath)) {
      unlinkSync(configPath);
    }
  });

  it('should create valid plugin config', async () => {
    const pluginConfig = await nxValidatorsPlugin({ outputPath });
    expect(() => pluginConfigSchema.parse(pluginConfig)).not.toThrow();
    expect(pluginConfig.meta.slug).toBe(pluginSlug);
  });

  it('should execute correctly', async () => {
    const coreConfig = mockConfig();
    coreConfig.plugins = [await nxValidatorsPlugin({ outputPath })];
    await writeFile(configPath, 'export default ' + JSON.stringify(coreConfig));

    await cli(['collect', `--configPath=${configPath}`])
      .parseAsync()
      .catch(console.log);
    const pluginOutput = (await readFile(outputPath).then((s) =>
      JSON.parse(s.toString())
    )) as Report;

    expect(pluginOutput.plugins[0].meta.slug).toBe(pluginSlug);
  });
});
