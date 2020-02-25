const core = require('@actions/core');
const github = require('@actions/github');

try {

    const commitMessageRegex = core.getInput('commitMessageRegex');

    console.log('Hello ${commitMessageRegex}');

} catch (error) {
    core.setFailed(error.message);
}