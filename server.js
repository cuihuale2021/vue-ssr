// 在服务端将vue实例渲染为字符串
const Vue = require('vue')
const fs = require('fs')
const express = require('express')

// 加载打包资源
const template = fs.readFileSync('./index.template.html', 'utf-8')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {        // 打包后的启动 createRenderer ——> createBundleRenderer, 并加载打包后的文件
    template,
    clientManifest
})

// 启动服务
const server = express()

// 查找静态资源，处理返回
server.use('/dist/', express.static('./dist'))

server.get('/', (req, res) => {     
    renderer.renderToString({           // 打包中自动创建的实例 
        title: '打包运行',
        meta: `<meta name="description" content="vue ssr">`
    },(err, html) => {
        if (err) {
            console.dir(err, 'err')
            return res.status(500).end('Internal Server Error.')
        }
        // 为html 设置 UTF-8编码
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(html)
    })
})

server.listen('8080', () => {
    console.log('server running at port 8080.')
})