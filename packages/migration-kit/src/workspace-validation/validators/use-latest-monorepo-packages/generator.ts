import { getLatestVersion } from '@nx-validators/dev-kit';
import { Tree } from '@nx/devkit';

import { DataLog } from '../../../types/validation.types';
import { getLocalDevDependencies, hasMigrationKitInTsPaths } from '../../../utils/config-files.utils';

const PUBLISHABLE_PACKAGES = [
    '@themes/ladbrokes-betstation',
    '@themes/party-arcade-games',
    '@themes/sports-interaction',
    '@themes/coral-betstation',
    '@themes/borgata-sports-2',
    '@themes/wheel-of-fortune',
    '@themes/whitelabel-epcot',
    '@themes/borgata-casino-2',
    '@themes/borgata-poker-2',
    '@themes/cheeky-bingo-2',
    '@themes/party-sports-2',
    '@themes/party-casino-2',
    '@themes/party-poker-2',
    '@themes/borgata-bingo',
    '@themes/giocodigitale',
    '@themes/gala-casino-2',
    '@themes/ninja-casino',
    '@themes/party-gaming',
    '@themes/danske-poker',
    '@themes/party-casino',
    '@themes/mgm-casino-2',
    '@themes/premium-dark',
    '@themes/gala-bingo-3',
    '@themes/ladbrokes-de',
    '@themes/foxy-games-2',
    '@themes/foxy-bingo-4',
    '@themes/party-sports',
    '@themes/mgm-sports-2',
    '@themes/danske-spil',
    '@themes/party-poker',
    '@themes/gamebookers',
    '@themes/sportingbet',
    '@themes/mgm-poker-2',
    '@themes/gala-spins',
    '@themes/black-dark',
    '@themes/whitelabel',
    '@themes/casinoclub',
    '@themes/ladbrokes',
    '@themes/borgata-2',
    '@themes/slotclub',
    '@themes/vistabet',
    '@themes/premium',
    '@themes/enspire',
    '@themes/eurobet',
    '@themes/optibet',
    '@themes/unikrn',
    '@themes/betboo',
    '@themes/oddset',
    '@themes/black',
    '@themes/pmu-2',
    '@themes/mgm-3',
    '@themes/mgm-2',
    '@themes/mgm-4',
    '@themes/coral',
    '@themes/pmu',
    'moxxi',
    '@frontend/ui',
    '@frontend/vanilla',
    '@frontend/loaders',
    '@frontend/nx-plugin',
    '@nx-validators/dev-kit',
    '@themepark/nx-plugin',
];

export async function useLatestMonorepoPackagesGenerator(tree: Tree): Promise<DataLog[]> {
    const data: DataLog[] = [];

    // Skipping if migration-kit is configured in tsconfig paths
    // meaning we are in the monorepo so it's always the latest version.
    if (hasMigrationKitInTsPaths(tree)) {
        data.push({
            expected: `Repository is using the latest version of all packages`,
            status: 'success',
        });

        return data;
    }

    const localDevDependencies = getLocalDevDependencies(tree);
    const localDevDepsFromMonorepoPackageNames = Object.keys(localDevDependencies).filter((packageName) =>
        PUBLISHABLE_PACKAGES.includes(packageName),
    );
    const latestPublishableProjectVersions = await Promise.all(
        localDevDepsFromMonorepoPackageNames.map((packageName) => getLatestVersion(packageName)),
    );
    localDevDepsFromMonorepoPackageNames.forEach((packageName, index) => {
        const latestVersion = latestPublishableProjectVersions[index];
        const currentVersion = localDevDependencies[packageName];
        if (currentVersion) {
            data.push({
                expected: `Repository is using the latest version (${latestVersion}) of ${packageName} package.`,
                status: currentVersion === latestVersion ? 'success' : 'failed',
            });
        }
    });
    return data;
}

export default useLatestMonorepoPackagesGenerator;
