// 客户端 webpack 配置文件
/**
 * 客户端打包配置
*/
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(baseConfig, {
    // 打包入口， entry的路径是相对于打包项目的
    entry: {
        app: './src/entry-client.js'
    },
    module: {
        rules: [
            // ES6 转 ES5   （服务端的node默认支持 ES6）
            {
                test: /\.m?js$/,
                exclude: /(node_modules | browser_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        cacheDirectory: true,
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            },
        ]
    },

    // 这将webpack 运行时分离到一个引导chunk中，以便可以在之后正确注入异步 chunk
    optimization: {
        splitChunks: {
            name: 'manifest',
            minChunks: Infinity
        }
    },

    plugins: [
        // 此插件在输出目录中生产 'vue-ssr-client-manifest.json'
        new VueSSRClientPlugin()
    ]
})