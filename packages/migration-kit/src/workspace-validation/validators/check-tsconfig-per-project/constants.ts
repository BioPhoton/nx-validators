import { ProjectTypeTSConfigMap } from './types';

export const NG_PROJECT_TSCONFIG = {
    compilerOptions: {
        useDefineForClassFields: false,
        forceConsistentCasingInFileNames: true,
        strictNullChecks: true,
        noImplicitOverride: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        // TODO: make these options default when all projects are using it.
        // strict: true,
        // noPropertyAccessFromIndexSignature: true,
    },
    angularCompilerOptions: {
        enableI18nLegacyMessageIdFormat: false,
        strictInjectionParameters: true,
        strictInputAccessModifiers: true,
        // TODO: make these options default when all projects are using it.
        // strictTemplates: true,
    },
};

export const NX_PLUGIN_TSCONFIG = {
    compilerOptions: {
        module: 'commonjs',
    },
};

export const JS_LIB_TSCONFIG = {
    compilerOptions: {
        module: 'commonjs',
        forceConsistentCasingInFileNames: true,
        strict: true,
        noImplicitOverride: true,
        noPropertyAccessFromIndexSignature: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
    },
};

export const NG_PROJECT_TSCONFIG_LIB = {
    compilerOptions: {
        declaration: true,
        declarationMap: true,
        inlineSources: true,
    },
};

export const JS_LIB_OR_PLUGIN_TSCONFIG_LIB = {
    compilerOptions: {
        declaration: true,
        types: ['node'],
    },
};

export const PROJECT_TYPE_TSCONFIG_MAP: ProjectTypeTSConfigMap = {
    'app': NG_PROJECT_TSCONFIG,
    'lib': NG_PROJECT_TSCONFIG,
    'ui': NG_PROJECT_TSCONFIG,
    'utils': JS_LIB_TSCONFIG,
    'data-access': JS_LIB_TSCONFIG,
    'nx-plugin': NX_PLUGIN_TSCONFIG,
    'kit': NX_PLUGIN_TSCONFIG,
};

export const PROJECT_TYPE_TSCONFIG_LIB_MAP: ProjectTypeTSConfigMap = {
    'lib': NG_PROJECT_TSCONFIG_LIB,
    'ui': NG_PROJECT_TSCONFIG_LIB,
    'utils': JS_LIB_OR_PLUGIN_TSCONFIG_LIB,
    'data-access': JS_LIB_OR_PLUGIN_TSCONFIG_LIB,
    'nx-plugin': JS_LIB_OR_PLUGIN_TSCONFIG_LIB,
    'kit': JS_LIB_OR_PLUGIN_TSCONFIG_LIB,
};
