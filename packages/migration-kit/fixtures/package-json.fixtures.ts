import { PackageJson } from '@nx-validators/dev-kit';

// eslint-disable-next-line @nx/enforce-module-boundaries
import * as vanillaPackageJson from '../../../package.json';

export const MONOREPO_PACKAGE_JSON: PackageJson = vanillaPackageJson as unknown as PackageJson;
