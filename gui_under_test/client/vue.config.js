const { defineConfig } = require('@vue/cli-service')

const qmonus = require("./qmonus-dev.js")({
  target   : "https://portal-045b6720-0024-4d09-81c0-642d2b6cef67.sdk-lab.qmonus.net/" ,
  username : "admin" ,
  password : "admin",
})

module.exports = defineConfig({
  transpileDependencies: true,
  devServer : {
    host: 'localhost',
    port: 8080,
    open: false,
    ...qmonus ,
  },
  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
