module.exports = async function _requireSequence(tasks) {
    const seed = Promise.resolve();
    const execute = task => () => require(task.path)(...(task.args || []));
    return tasks.reduce((res, task) => res.then(execute(task)), seed);
};
