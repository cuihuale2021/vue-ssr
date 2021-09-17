// 公共 webpack 配置文件
/**
 * 公共配置
*/
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const resolve = file => path.resolve(__dirname, file)

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    mode: isProd ? 'production' : 'development',
    output: {
        path: resolve('../dist/'),
        filename: '[name].[chunkhash].js',
        publicPath: '/dist/',
    },
    resolve: {
        alias: {        
            '@': resolve('../src/')             // 路径别名，@ 指向 src/
        },
        extensions: ['.js', '.vue', '.json']            // 可以省略的扩展名，从前往后的顺序依次解析
    },
    devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',            // 设置 sourceMap
    module: {
        rules: [
            // 处理图片资源
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ]
            },
            // 处理字体资源
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ]
            },
            // 处理 .vue 
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // 处理 css 资源
            // 普通的css块，以及 .vue 文件中的 style块
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new FriendlyErrorsWebpackPlugin()
    ]
}