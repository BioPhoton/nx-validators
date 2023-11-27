/* eslint-disable */
export default {
    displayName: 'migration-kit',
    preset: '../../jest.preset.js',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
    transformIgnorePatterns: [`<rootDir>/node_modules/`, '^.+\\.js$'],
    moduleFileExtensions: ['ts', 'js', 'html'],
};
