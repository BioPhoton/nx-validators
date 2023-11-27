export const PROJECT_TYPES = [
    'app', // eg: themepark-app
    'utils', // eg: themes-data-utils
    'kit', // eg: dev-kit
    'nx-plugin', // eg: themepark-nx-plugin
    'theme', // eg: themepark-betboo-theme
    'lib', // eg: vanilla-lib
    'feature', // eg: vanilla-account-menu-feature
    'ui', // eg: vanilla-account-menu-ui
    'data-access', // eg: vanilla-account-data-access
    'storybook', // eg: design-system-storybook
] as const;

export const TAG_PREFIXES = [
    'type', // eg: type:app
    'scope', // eg: scope:shared
] as const;
