module.exports = {
    '*.{html,scss,js,ts,jsx,tsx,json}': [(files) => `nx format:write --files=${files.join(',')}`],
};
