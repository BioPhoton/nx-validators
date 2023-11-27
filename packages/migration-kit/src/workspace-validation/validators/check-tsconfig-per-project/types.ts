import { CompilerOptions } from 'typescript';

import { PROJECT_TYPES } from '../../../utils/project-conventions.utils';

export type TSConfig = {
    compilerOptions?: Omit<CompilerOptions, 'target'> & { target?: string };
    angularCompilerOptions?: Record<string, boolean | undefined>;
};

export type LibraryType = (typeof PROJECT_TYPES)[number];

export type TSConfigType = 'app' | 'lib' | 'spec' | 'prod';

export type ProjectTypeTSConfigMap = { [Key in LibraryType]?: TSConfig };
