import { DataLog } from '../../../types/validation.types';

export async function checkManualStepsGenerator(): Promise<DataLog[]> {
    const MANUAL_CHECKS: string[] = [
        'There should be no unused dependency in the package.json.',
        'There should be no unused import in the polyfills.ts.',
        'There should be no unused import in the app.module.ts.',
        'There should be a release target in place for publishable projects.',
        'There should be no open PR just before the migration.',
    ];
    return MANUAL_CHECKS.map((expected) => ({
        expected,
        status: 'info',
    }));
}

export default checkManualStepsGenerator;
