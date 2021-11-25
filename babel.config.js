module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/transform-runtime"
  ]
}
