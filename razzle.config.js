const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
  modify(config, { target, dev }, webpack) {
    const appConfig = config // stay immutable here
    appConfig.plugins.push(
      new CopyWebpackPlugin([{ from: "images", to: "images" }])
    )

    return appConfig
  }
}
