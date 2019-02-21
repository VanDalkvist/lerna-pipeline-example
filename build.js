const path = require("path");
const packageJson = require("./package");

const buildConfig = packageJson.build;
if (!buildConfig) {
    throw new Error("There is no configuration for build.");
}

const pipeline = buildConfig.pipeline;
if (!pipeline) {
    throw new Error("There is no scripts pipeline configuration for build.");
}

const apps = buildConfig.apps;
if (!apps) {
    throw new Error(
        "Nothing to build. Check 'apps' section in your package.json file. 'apps' should be an array of app names you want to build"
    );
}

console.log(`Running [${pipeline}] scripts for each app from list - [${apps}]`);

const tasks = apps.map(appName => _runPipelineForApp(appName, pipeline));
Promise.all(tasks).catch(err => {
    console.error("An error occurred: ", err);
    process.exit(-1);
});

async function _runPipelineForApp(appName, pipeline) {
    return pipeline.reduce((res, scriptName) => {
        return res.then(() => {
            const scriptPath = path.resolve("build-tools", scriptName);
            const runScript = require(scriptPath);
            return runScript(appName);
        });
    }, Promise.resolve());
}
