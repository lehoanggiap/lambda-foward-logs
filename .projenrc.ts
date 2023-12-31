import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'lambda-forward-logs',
  projenrcTs: true,
  gitignore: [
    '/lib/lambda/',
    '/test-reports/',
    '**/test/__snapshots__/',
  ],

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.eslint?.addRules({
  'linebreak-style': ['error', 'unix'],
});

project.gitattributes.addLfsPattern('autolf=false');
project.synth();