module.exports = {
  root: true,
  extends: require.resolve('umi/eslint'),
  rules: {
    'react-hooks/exhaustive-deps': 0,
    'react-hooks/rules-of-hooks': 0,
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: false, variables: false },
    ],
  },
};
