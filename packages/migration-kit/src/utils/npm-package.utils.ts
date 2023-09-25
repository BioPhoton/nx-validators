import { execSync } from 'child_process';

export const getMigrationKitLatestVersion = (): string => {
    return execSync('yarn npm tag list @frontend/migration-kit --json', { encoding: 'utf-8' })
        .trim()
        .split('\n')
        .map<{ descriptor: string; locator: string }>((v) => JSON.parse(v))
        .find((v) => v.descriptor === '@frontend/migration-kit@latest')!
        .locator.split('@frontend/migration-kit@')
        .at(-1)!;
};

export const getLocalMigrationKitVersion = (): string | null => {
    try {
        return JSON.parse(execSync('yarn info @frontend/migration-kit --json', { encoding: 'utf-8' }).trim()).children.Version;
    } catch {
        throw new Error('Unable to parse installed @frontend/migration-kit version');
    }
};
