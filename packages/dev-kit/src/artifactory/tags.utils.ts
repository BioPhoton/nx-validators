/* eslint-disable no-console*/

import util = require('util');

const exec = util.promisify(require('child_process').exec);

export async function getLatestVersion(packageName: string): Promise<string | undefined> {
    try {
        const execResult = await exec(`yarn npm info ${packageName} --json`);
        const packageInfo = JSON.parse(execResult.stdout);
        return packageInfo['dist-tags'].latest;
    } catch (e) {
        console.error(e);
        throw new Error(
            `No latest version found in registry. Please specify which version is the latest by using: "npm dist-tags add ${packageName}@[latestVersion] latest"`,
        );
    }
}
