const npm = require("npm");
const path = require("path");

module.exports = _run;

async function _run(appName) {
    // console.log(`cwd [${appName}]: ${process.cwd()}`);

    const appPath = path.resolve(process.cwd(), appName);

    return new Promise((resolve, reject) => {
        npm.load({}, function(err) {
            if (err) {
                return reject(err);
            }

            npm.prefix = appPath; // sets a path when npm scripts should be executed

            npm.commands.run(["build"], err => {
                if (err) {
                    return reject(err);
                }

                resolve(null);
            });
        });
    });
}
