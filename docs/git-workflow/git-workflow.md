# How to use git and github as a team
You can type ⌘K V to view preview of this file in VSCode.

## Commands
Here are some useful commands you can use in the terminal. 

List of commands: 
|prefix    |description      |
|----------|-----------------|
| git checkout -b | Create a new branch and checkout into it|
| git pull --rebase origin <branch name>     | Pull latest from branch and rebase on top of it        |
| git fetch    | fetch latest changes but doesn't merge/rebase your branch|
| git status | List files that aren't staged for commit |
| git add file-name | Adds changed file to staging area |
| git add . | Adds all changed files to staging area |
| git restore --staged file-name | Unstage a specific file in staging area and keep changes |
| git commit -m "Commit message"| Create a commit |
| git push | Push commits to remote branch |
| git push -f | Use this command if you rebased but already pushed your branch before|
| npm or npm -i   | Installs dependencies |

## Workflow
All feature branches should be based off of **develop** branch.\
To mitigate against conflicts between feature branches and main/develop branch, we can use the following standard:

Github Issues - If you're using github issues to create your branch: 
- Select the 'issue' you want to work on and assign yourself to it. 
- In the "Development" panel on the right, you can click on "Create a branch". 
- Edit the branch name and use proper naming convention (see below).
- Make sure the branch source is 'develop' by clicking on "Change branch source". 
- Click 'create branch' and follow instructions by inputting commands in your terminal. 

Terminal - Git - Creating a new branch: 
- Pull latest changes from main / develop / parent branch before creating a new branch
- Create new branch 

Development - Happy Path: 
- Work on a single issue / ticket, staying within the work domain as best as possible. 
- Commit everytime you've finished a unit of work. (See below)
- Write test for that unit of work (if you aren't doing TDD).
- **IMPORTANT:** Once finished with the issue / ticket, pull latest changes from parent branch and rebase. 
- Install latest dependencies and check everything is working. 
- Push, open PR and request code review.

Conflicts:
- Fix conflicts if any arise from pull. 
- Fixing conflicts with rebase involves starting from your branche's first commit. 
- Once fixed, push to github and open a PR and code review.

CI tests:
- If CI tests fail, fix the test if possible or ask for help if it's outside your domain. 
- Push fixes and request code review. 

PR:
- Check that you merging to **develop** branch. 
- If you think your branch is going to main, close the PR and open a new one. 
- When integrating feature branch to **develop**, select Rebase. 

## Branch Naming
To organise our branches we should use the following prefixes to mark the type of work involved in the branch.\
Follow the prefixes with the name of the branch:
```zsh
feature/gamecard-component
```
 
If the branch was created from a github issue, the branch should also have an issue number:
```zsh
feature/20-gamecard-component
```

List of branch prefixes:
|prefix    |description      |
|----------|-----------------|
| feature/ | new features|
| fix/     | bug fixes       |
| enhancement/| refactors|
| docs/    | adding or updating docs|
| chore/   | updating development dependencies |

## Commit Naming
In addition to branch names, we can also utilise naming conventions for commits.\
During development we might encounter tasks in our working domain that we can add the following prefixes to when committing:

List of commit prefixes:
|prefix    |description      |
|----------|-----------------|
| feat: | new features|
| fix:    | bug fix       |
| style:| Changes relating to styling and not the meaning of the code |
| refactor:    | Refactors that neither fixes a bug nor adds new feature|
| perf: | Code change that improves performance |
| docs:   | Documentation only changes |
| test: | Adding new tests or updating old tests |
| chore: | Changes that don't src or test files |

