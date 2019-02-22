const path = require("path");
const packageJson = require("../../package");
const requireSequence = require("../common/require-sequence");

const buildConfig = packageJson.build;
if (!buildConfig) {
    throw new Error("There is no configuration for build.");
}

module.exports = function(apps, plugins, executionPath) {
    console.log(
        `Running [${plugins}] scripts for each app from list - [${apps}]`
    );

    const tasks = apps.map(appName => _runPluginsForApp(appName, plugins));
    return Promise.all(tasks).then(() =>
        console.log(`[${plugins}] plugins for [${apps}] executed successfully.`)
    );
};

async function _runPluginsForApp(appName, plugins) {
    const pluginPath = plugin => path.resolve("build", "plugins", plugin);
    const tasks = plugins.map(p => ({ path: pluginPath(p), args: [appName] }));
    return requireSequence(tasks);
}
