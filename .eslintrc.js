module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "import/prefer-default-export": "off",
    "implicit-arrow-linebreak": "off",
    "no-return-await": "off"
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".ts"]
      }
    }
  },
};
