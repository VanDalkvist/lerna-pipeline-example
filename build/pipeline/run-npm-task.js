const workerPool = require("workerpool");

const npm = require("npm");
const path = require("path");

workerPool.worker({ runBuild: run });

function run(app, taskName, executionPath) {
    return new Promise((resolve, reject) => {
        console.log(`Root path - '${executionPath}'.`);
        console.log(`Running task '${taskName}' for '${app}'...`);

        npm.load({}, function(err) {
            if (err) {
                return reject(err);
            }

            npm.prefix = path.resolve(executionPath, app); // sets a path where npm scripts should be executed

            npm.commands.run([taskName], err => {
                if (err) {
                    return reject(err);
                }

                resolve(null);
            });
        });
    });
}
