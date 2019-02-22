const path = require("path");
const packageJson = require("../package");

const requireSequence = require("./common/require-sequence");

const buildConfig = packageJson.build;
if (!buildConfig) {
    throw new Error("There is no configuration for build.");
}

const pipeline = buildConfig.pipeline;
if (!pipeline) {
    throw new Error("There is no configuration for build pipeline.");
}

const apps = buildConfig.apps;
if (!apps) {
    throw new Error(
        "Nothing to build. Check 'apps' section in your package.json file. 'apps' should be an array of app names you want to build"
    );
}

const plugins = buildConfig.plugins || [];

const executionPath = path.resolve(__dirname, "..");

const tasks = pipeline.map(taskName => {
    const [task, argsString] = taskName.split(":");
    const args = (argsString || "").split(",").map(a => a.trim());

    return {
        path: path.resolve(__dirname, "..", "build", "pipeline", task),
        args: [apps, plugins, executionPath, ...args]
    };
});

requireSequence(tasks)
    .then(() => {
        console.log("Finished");
        process.exit(0);
    })
    .catch(err => {
        console.error("An error occurred: ", err);
        process.exit(-1);
    });
