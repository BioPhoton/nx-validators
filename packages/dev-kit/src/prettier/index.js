module.exports = {
    overrides: [
        {
            files: '*.html',
            options: {
                parser: 'angular',
            },
        },
    ],
    printWidth: 150,
    tabWidth: 4,
    useTabs: false,
    singleQuote: true,
    trailingComma: 'all',
    arrowParens: 'always',
    bracketSpacing: true,
    bracketSameLine: true,
    endOfLine: 'lf',
    quoteProps: 'consistent',
    importOrder: ['<BUILTIN_MODULES>', '@angular/*', '<THIRD_PARTY_MODULES>', '^[.]'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderParserPlugins: ['typescript', 'decorators-legacy'],
};
