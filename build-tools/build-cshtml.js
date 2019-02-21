const fs = require("fs");
const path = require("path");

const mainViewName = "Index.cshtml";

module.exports = _build;

async function _build(appName) {
    // console.log("Building Index.cshtml file for .net application.\n");

    const assetsPath = path.resolve("./", appName, "build", "asset-manifest");
    const assetsManifest = require(assetsPath);
    // console.log("Assets: ");
    // console.dir(assetsManifest, { colors: true });

    return new Promise((resolve, reject) =>
        _writeMainView(appName, assetsManifest, resolve, reject)
    );
}

function _writeMainView(appName, assetsManifest, resolve, reject) {
    const templatePath = path.resolve("./", appName, "public", mainViewName);
    // console.debug("templatePath: ", templatePath);

    const buildPath = path.resolve("./", appName, "build", mainViewName);
    // console.debug("buildPath: ", buildPath);

    fs.readFile(templatePath, "utf-8", (err, indexCshtmlTemplate) => {
        if (err) return reject(err);

        const builtMainView = _replaceAssetsPaths(
            assetsManifest,
            indexCshtmlTemplate
        );
        fs.writeFile(buildPath, builtMainView, "utf-8", (err, res) => {
            if (err) return reject(err);

            resolve(res);
        });
    });
}

function _replaceAssetsPaths(assetsManifest, indexCshtmlTemplate) {
    return indexCshtmlTemplate
        .replace("{css-bundle}", assetsManifest["main.css"])
        .replace("{js-bundle}", assetsManifest["main.js"]);
}
