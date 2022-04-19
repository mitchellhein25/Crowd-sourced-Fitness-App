module.exports = {
    extends: 'airbnb',
    plugins: [
        'react',
        'react-native',
        'react-hooks'
    ],
    parser: '@babel/eslint-parser',
    parserOptions: {
        requireConfigFile: false,
    },
    env: {
        jest: true,
        'react-native/react-native': true,
    },
    rules: {
        'no-use-before-define': 'off',
        'react/jsx-filename-extension': 'off',
        'react/prop-types': 'off',
        'comma-dangle': 'off',
        'padded-blocks': 'off',
        'arrow-body-style': 'off',
        'react-hooks/exhaustive-deps': 'warn',
        'react-native/no-unused-styles': 2,
        'react-native/split-platform-components': 2,
        'react-native/no-inline-styles': 2,
        'react-native/no-color-literals': 2,
        // 'react-native/no-raw-text': 2,
        'react-native/no-single-element-style-arrays': 2,
        'linebreak-style': 0,
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'import/no-mutable-exports': 0,
        'global-require': 0,
        'jsx-quotes': 0,
        'react/no-children-prop': 0,
        'no-shadow': 0,
        'import/prefer-default-export': 0,
        'prefer-destructuring': 0,
        'react/no-array-index-key': 0

    },
    globals: {
        fetch: false
    }
};
