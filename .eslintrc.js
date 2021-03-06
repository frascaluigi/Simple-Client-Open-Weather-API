module.exports =  {
    env: {
        es6: true,
        node: true
      },
      extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
        'plugin:jest/recommended'
      ],
      globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
      },
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module"
      },
      rules: {
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }]
      }
  };