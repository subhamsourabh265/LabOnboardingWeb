# Lab Onboarding Website

Internal GENEICD website to automate onboarding of labs.

- Dev environment: https://dev.lab-onboarding.geneicd.com
- Prod environment: https://lab-onboarding.geneicd.com

## Documentation

This is an Angular project with JamStack architecture. Scully transforms the Angular build into a JamStack build. The GENEICD design system, based on Angular Material, controls the visual theme.

- Angular docs: https://angular.io/docs
- JamStack docs: https://jamstack.org/
- Scully docs: https://scully.io/
- Angular Material guides: https://material.angular.io/guides
- GENEICD Lab Onboarding: https://geneicd.atlassian.net/l/c/RjeXHB9N
- GENEICD design system: https://geneicd.atlassian.net/l/c/00v1dDT1

## CICD

If you merge into the Main branch, Bitbucket Pipelines will automatically deploy the code to the Dev Environment. If you merge into the Release/Publish branch, Bitbucket Pipelines will automatically deploy the code to the Production Environment. Only merge into Release/Publish with business approval.

## Installation

You will need an npm account that is part of the GENEICD organization to install the private dependency `@geneicd/fhir-library`.

## Pushing code

All commit messages must be of form:

- ABC-123 commit message

where ABC-123 is the Jira story the code relates to.

The program husky runs scripts in both pre-commit and pre-push hooks. The pre-commit hook performs linting and checks library security. The pre-push hook runs unit tests. If you need to push code that does not pass these checks, you can do it from the command line with `git push --no-verify`
