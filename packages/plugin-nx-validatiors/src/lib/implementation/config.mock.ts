import { nxValidatorsPlugin } from '../nx-validators-plugin';
const outputPath = 'nx-validators-plugin--runner-output.json';

export default {
  persist: { outputPath },
  categories: [],
  plugins: [await nxValidatorsPlugin({ outputPath })],
};
