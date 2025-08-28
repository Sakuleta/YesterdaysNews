module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'eslint:recommended',
    '@react-native-async-storage/async-storage'
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react']
    }
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    'react-native/react-native': true,
  },
  rules: {
    // Code Style Rules
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-trailing-spaces': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    'eol-last': ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'computed-property-spacing': ['error', 'never'],
    'func-call-spacing': ['error', 'never'],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'keyword-spacing': ['error', { before: true, after: true }],
    'space-before-blocks': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': ['error', 'always'],
    'arrow-spacing': 'error',
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'comma-spacing': ['error', { before: false, after: true }],
    'comma-style': ['error', 'last'],

    // Best Practices
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-alert': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unused-labels': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-escape': 'error',
    'no-useless-return': 'error',
    'no-void': 'error',
    'no-with': 'error',
    'prefer-promise-reject-errors': 'error',
    'require-await': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'no-useless-constructor': 'error',
    'no-duplicate-imports': 'error',
    'prefer-destructuring': ['error', { object: true, array: false }],
    'object-shorthand': 'error',
    'prefer-spread': 'error',

    // React Native Specific
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'react-native/no-raw-text': ['error', {
      skip: ['CustomText', 'Text', 'ErrorBoundary']
    }],

    // Import/Export Rules
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true }
    }],
    'import/no-unresolved': 'error',
    'import/no-cycle': 'error',
    'import/no-unused-modules': 'error',
    'import/no-deprecated': 'warn',

    // JSDoc Rules
    'require-jsdoc': 'off', // We use JSDoc for important functions only
    'valid-jsdoc': ['error', {
      requireReturn: false,
      requireReturnType: false,
      requireParamDescription: false,
      requireReturnDescription: false,
    }],

    // Performance Rules
    'react/jsx-no-bind': ['error', {
      ignoreRefs: true,
      allowArrowFunctions: true,
      allowBind: false,
    }],
    'react/jsx-no-constructed-context-values': 'error',
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react/jsx-no-useless-fragment': 'error',
    'react/no-array-index-key': 'warn',
    'react/self-closing-comp': 'error',
    'react/jsx-boolean-value': ['error', 'never'],
    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],
    'react/hook-use-state': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      'babel-module': {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['*.test.js', '*.spec.js', '__tests__/**/*.js'],
      env: {
        jest: true,
      },
      rules: {
        'react-native/no-inline-styles': 'off',
        'react-native/no-color-literals': 'off',
        'no-console': 'off',
      },
    },
    {
      files: ['src/types/*.js'],
      rules: {
        'no-unused-vars': 'off', // Type definitions may have unused exports
        'require-jsdoc': 'off',
      },
    },
    {
      files: ['src/utils/constants.js'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
