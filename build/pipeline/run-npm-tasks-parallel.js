const path = require("path");
const workerPool = require("workerpool");

const poolSettings = { minWorkers: "max" };
const workerName = path.resolve(__dirname, "run-npm-task.js");
const pool = workerPool.pool(workerName, poolSettings);

module.exports = async function(apps, plugins, rootPath, task) {
    const getWorker = app => worker => worker.runBuild(app, task, rootPath);
    const runWorker = app => pool.proxy().then(getWorker(app));

    return Promise.all(apps.map(runWorker))
        .then(() => console.log("Workers are done."))
        .catch(err => {
            console.error("Error: ", err);
            pool.terminate();
        });
};
