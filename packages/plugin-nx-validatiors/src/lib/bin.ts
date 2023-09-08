import * as process from 'process';
import { bundleRequire } from 'bundle-require';

const outputPath =
  process.argv
    .filter((arg) => arg.includes('outputPath'))
    .pop()
    ?.split('=')
    .pop() || '';

(async () => {
  if (outputPath !== '') {
    const { mod } = await bundleRequire({
      filepath: './implementation/run',
      format: 'esm',
    });
    const run = mod.default || mod;
    run({ outputPath });
  } else {
    throw new Error('--outputPath is required');
  }
})();
