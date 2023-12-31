const fs = require('fs');
const path = require('path');

const validatorIds = fs
    .readdirSync(__dirname, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const readREADME = (folder) => {
    const readmePath = path.join(folder, 'README.md');
    const readmeText = fs.readFileSync(readmePath, 'utf8');

    const title = readmeText.match(/^# (.*)/)[1];
    const descriptionMatch = readmeText.match(/## Description\r?\n(.*)/);
    if (!descriptionMatch?.length) {
        throw new Error(`Description is missing in the README.md: ${readmePath}`);
    }
    return {
        title,
        description: descriptionMatch[1],
    };
};

const validators = validatorIds.map((id) => ({ id, ...readREADME(id) }));

const validatorsREADME = `
# Validators

Below, you can find a list of all validators that are used by the workspace validation.

| Id | Name | Description |
|---|---|---|
${validators.map(({ id, title, description }) => `| [${id}](./${id}/README.md) | ${title} | ${description} |`).join('\n')}

This list was generated by using the script
\`\`\`
    node update-README.js
\`\`\`
`;

const readmePath = path.join(__dirname, 'README.md');

fs.writeFileSync(readmePath, validatorsREADME);
