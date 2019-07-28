module.exports = {
    root: true,
    extends: 'standard',
    parserOptions: {
        sourceType: 'module',
        parser: 'babel-eslint',
    },
    env: {
        node: true,
    },
    rules: {
        "indent": ["error", 2],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-console": "off",
        "arrow-parens": 0,
        "no-new": "off"
    }
}