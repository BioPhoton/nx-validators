import { TSConfig } from './types';

function normalizeOptions<T extends object>(options: T): Partial<T> {
    return Object.entries(options ?? {}).reduce(
        (acc, [key, value]) => ({
            ...acc,
            ...(value != null ? { [key]: value } : {}),
        }),
        {},
    );
}

export function normalizeDiff({ compilerOptions, angularCompilerOptions }: TSConfig): TSConfig {
    const normalizedCompilerOptions = normalizeOptions(compilerOptions ?? {});
    const normalizedAngularCompilerOptions = normalizeOptions(angularCompilerOptions ?? {});
    return {
        ...(!!Object.keys(normalizedCompilerOptions).length && { compilerOptions: normalizedCompilerOptions }),
        ...(!!Object.keys(normalizedAngularCompilerOptions).length && { angularCompilerOptions: normalizedAngularCompilerOptions }),
    };
}
