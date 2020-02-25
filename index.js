const core = require('@actions/core');
const { Toolkit } = require('actions-toolkit');


Toolkit.run(
    async tools => {
        const repository = tools.context.payload.repository;
        const pull_request = tools.context.payload.pull_request;
        tools.log(pull_request);
        const commitMessageRegex = core.getInput('commitMessageRegex');

        const params = {
            owner: repository.owner.login,
            repo: repository.name,
            pull_number: pull_request.number
        }

        const commits = (await tools.github.pulls.listCommits(params)).data;
        
        // Check for invalid commit messages
        const containInvalidCommitMessage = false;

        const regex = new RegExp(commitMessageRegex)
        commits.forEach(commit => {
            const message = commit.commit.message;
            if(!message.match(regex)) {
                containInvalidCommitMessage = true;
                tools.log('Invalid commit: ' + message);
            }
        });

        if (containInvalidCommitMessage) {
            tools.exit.failure("Invalid commits");
        } else {
            tools.exit.success();
        }
    }
)
