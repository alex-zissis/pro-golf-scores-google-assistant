module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 16,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier', 'import'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],

    rules: {
        '@typescript-eslint/no-unused-vars': [2, {varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_'}],
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-namespace': 0,
        "import/extensions": [2, "ignorePackages"]
    },

    env: {
        browser: true,
        es2021: true,
    },
};
