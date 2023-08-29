export interface PackageJson {
    name: string;
    version: string;
    license?: string;
    private?: boolean;
    scripts?: Record<string, string>;
    type?: 'module' | 'commonjs';
    main?: string;
    types?: string;
    module?: string;
    exports?:
        | string
        | Record<
              string,
              | string
              | {
                    types?: string;
                    require?: string;
                    import?: string;
                }
          >;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    peerDependenciesMeta?: Record<
        string,
        {
            optional: boolean;
        }
    >;
    resolutions?: Record<string, string>;
    bin?: Record<string, string>;
    workspaces?:
        | string[]
        | {
              packages: string[];
          };
    generators?: string;
    schematics?: string;
    builders?: string;
    executors?: string;
}
