module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': 'off',
    'vue/script-indent': ['warn', 2, {
      'baseIndent': 1
    }],
    'import/no-unresolved': 0,
    'import/extensions': ['.vue'],
    'no-plusplus': 0,
    'quote-props': 0,
    'comma-dangle': 0,
    'vue/html-closing-bracket-spacing': 0,
    'no-restricted-syntax': 0
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
