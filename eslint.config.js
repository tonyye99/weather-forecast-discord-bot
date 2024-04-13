import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    {
        extends: ['prettier'],
        rules: {
            semi: 'error',
            'no-var': 'error',
            indent: ['error', 'tab'],
            quotes: ['error', 'single'],
        },
    },
];
