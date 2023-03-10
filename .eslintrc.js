module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  rules: {
    'no-parameter-properties': 'error'
  },
  parserOptions: {
    project: [
      './tsconfig.json',
      './webpack.config.js',
    ]
  },
  plugins: [
    '@typescript-eslint',
    // 'prettier'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    // 'prettier/@typescript-eslint',
    // 'plugin:prettier/recommended'
  ],
  ignorePatterns: [
    '.eslintrc.*'
  ],
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
  }
}
