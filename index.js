const core = require('@actions/core');
const { Toolkit } = require('actions-toolkit');


Toolkit.run(
    async tools => {
        const repository = tools.context.payload.repository;
        const number = tools.context.payload.number;
        const commitMessageRegex = core.getInput('commitMessageRegex');

        const params = {
            owner: repository.owner.login,
            repo: repository.name,
            pull_number: number
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
    },
    { event: ['pull_request.opened', 'pull_request.edited', 'pull_request.synchronize'], secrets: ['GITHUB_TOKEN'] }
)
