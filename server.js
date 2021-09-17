// 在服务端将vue实例渲染为字符串
const Vue = require('vue')
const fs = require('fs')
const express = require('express')
const { createBundleRenderer } = require('vue-server-renderer')
const setupDevServer = require('./build/setup-dev-server.js')

// 启动服务
const server = express()

// 查找静态资源，处理返回
server.use('/dist/', express.static('./dist'))  // express.static 处理的物理磁盘中的资源

// 是否是生成环境
const isProd = process.env.NODE_ENV === 'production'
let renderer
if (isProd) {  // 生产环境直接生成 renderer 即可
    // 加载打包资源
    const template = fs.readFileSync('./index.template.html', 'utf-8')
    const serverBundle = require('./dist/vue-ssr-server-bundle.json')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = createBundleRenderer(serverBundle, { // 打包后的启动 createRenderer ——> createBundleRenderer, 并加载打包后的文件
        template,
        clientManifest
    })
} else { // 开发模式 ——> 监视打包构建 ——> 重新生成 Renderer 渲染器
    // 定义函数 setupDevServer 进行处理, onReady 是让外部拿到promise的状态
    onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {      // 监视打包构建完成后执行回调函数
        renderer = createBundleRenderer(serverBundle, {
            template,
            clientManifest
        })
    })
}

// 路由处理的渲染函数
const render = (req, res) => {
    renderer.renderToString({ // 打包中自动创建的实例 
        title: '打包运行',
        meta: `<meta name="description" content="vue ssr">`
    }, (err, html) => {
        if (err) {
            console.dir(err, 'err')
            return res.status(500).end('Internal Server Error.')
        }
        // 为html 设置 UTF-8编码
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(html)
    })
}
server.get('/', isProd 
            ? render 
            :  async (req, res) => {      // 开发模式等待有 renderer渲染器后，调用 render 进行渲染
                await onReady
                render(req, res)
            }                         
)

server.listen('8080', () => {
    console.log('server running at port 8080.')
})