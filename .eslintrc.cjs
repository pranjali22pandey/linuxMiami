module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
      'eslint:recommended',
      "plugin:vue/vue3-recommended",
      "prettier"
    ],
  rules: {
      "vue/require-default-prop": "off",
    // override/add rules settings here, such as:
    'vue/no-unused-vars': 'error',
    'vue/no-deprecated-slot-attribute': 'off',
  }
}
