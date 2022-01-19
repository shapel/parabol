module.exports = {
  extends: ['../../.eslintrc.js', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    project: 'tsconfig.eslint.json',
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  ignorePatterns: [
    '*.js',
    'checkForUpdate.ts',
    'dumpy.ts',
    'emailSSR.ts',
    'graphql/intranetSchema/mutations/githubAddAssignee.ts',
    'hotSwap.ts',
    'integrations/gitlab/GitLabServerManager.ts',
    'makeLiveReloadable.ts',
    'parseBodyDEBUG.ts',
    'types/gitlabTypes.ts',
    'types/githubTypes.ts',
    'postgres/queries/generated',
    'database'
  ]
}
