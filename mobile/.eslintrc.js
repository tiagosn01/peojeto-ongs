module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    __DEV__: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'jsx-a11y',
    'import',
    'react-hooks',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'error',
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    'react/jsx-filename-extension': ['error', {extensions: ['.js', '.jsx']}],
    'import/prefer-default-export': 'off',
    'no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
    'no-unused-expressions': 'off',
    'react/jsx-one-expression-per-line': 'off',
    "react/prop-types": ["error", { "ignore": ["navigation"] }],
    'react/jsx-props-no-spreading': 'off',
    'import/no-extraneous-dependencies': 'off',
    'global-require': 'off',
    'react-native/no-raw-text': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    camelcase: 'off',
    'no-console': ['error', {allow: ['tron']}],
  },
};
