// server.js 中的setupDevServer()
const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

module.exports = (server, callback) => {
    let ready // ready 为了拿到 resolve()
    const onReady = new Promise(r => ready = r)

    // 监视构建 ——> 更新 Renderer
    let serverBundle
    let template
    let clientManifest

    const update = () => {
        if (serverBundle && template && clientManifest) {
            ready()
            callback(serverBundle, template, clientManifest)
        }
    }

    // 监视构建 template ——> 调用 update ——> 更新 renderer 渲染器
    const templatePath = path.resolve(__dirname, '../index.template.html')
    template = fs.readFileSync(templatePath, 'utf-8')
    chokidar.watch(templatePath).on('change', () => {
        // console.log('template change')
        template = fs.readFileSync(templatePath, 'utf-8')
        update()
    })

    // 监视构建 serverBundle ——> 调用 update ——> 更新 renderer 渲染器       
    const serverConfig = require('./webpack.server.config')
    const serverCompiler = webpack(serverConfig)
    // 将数据写入内存中
    const serverDevMiddleware = devMiddleware(serverCompiler, {
        logLevel: 'silent' // 关闭日志输出
    })
    serverCompiler.hooks.done.tap('server', () => {
        serverBundle = JSON.parse(serverDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8'))
        update()
    })
    // 物理磁盘中的数据不用再监视了       
    // serverCompiler.watch({}, (err, stats) => {
    //     if (err) throw err // webpack的err
    //     if (stats.hasErrors()) return // 源代码错误
    //     // console.log('success')
    //     serverBundle = JSON.parse(fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8'))
    //     update()
    // })

    // 监视构建 clientManifest ——> 调用 update ——> 更新 renderer 渲染器       【同上】
    const clientConfig = require('./webpack.client.config')
    // 热更新
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())     
    clientConfig.entry.app = [
        'webpack-hot-middleware/client?quiet=true&reload=true',
        clientConfig.entry.app
    ]
    // 热更新模式下不使用 chunkhash
    clientConfig.output.filename = '[name].js'     
    const clientCompiler = webpack(clientConfig)
    const clientDevMiddleware = devMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        logLevel: 'silent' // 关闭日志输出
    })
    clientCompiler.hooks.done.tap('client', () => {
        clientManifest = JSON.parse(clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8'))
        update()
    })
    server.use(hotMiddleware(clientCompiler,{
        log: false,     // 关闭它本身的日志输出
    }))
    // 重要！！！将clientDevMiddleware 挂载到Express 服务中，提供对其内部内存中数据的访问 【客户端需要，服务端不需要】
    server.use(clientDevMiddleware)

    return onReady
}