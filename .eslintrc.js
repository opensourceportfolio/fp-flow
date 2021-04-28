module.exports = {
  env: {
    browser: true,
    amd: true,
    es6: true,
    node: true,
    jest: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['prettier', 'flowtype', 'simple-import-sort'],
  extends: ['eslint:recommended', 'plugin:flowtype/recommended', 'prettier/flowtype', 'plugin:prettier/recommended'],
  rules: {
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'no-param-reassign': 'error',
    //Stylistic Issues
    'no-trailing-spaces': 'error',
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
    ],
    quotes: ['error', 'single'],
    'quote-props': ['error', 'consistent-as-needed'],
    //ECMAScript 6
    'no-duplicate-imports': 'error',
    'no-return-await': 'error',
    'no-useless-computed-key': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'off',
    'prefer-const': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    //prettier
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    //imports
    'simple-import-sort/sort': 'error',
  },
};
