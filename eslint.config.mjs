import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import { fixupConfigRules } from '@eslint/compat';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    extends: ['prettier', 'prettier/react'],
  },
  {
    languageOptions: {
      parser: 'babel-eslint',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      'prettier/prettier': 'error',
      'react/jsx-filename-extension': [
        'warn',
        { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      ],
      'import/prefer-default-export': 'off',
      'jsx-quotes': ['error', 'prefer-single'],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
];
