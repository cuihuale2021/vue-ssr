// 在服务端将vue实例渲染为字符串
const Vue = require('vue')
const fs = require('fs')
const renderer = require('vue-server-renderer').createRenderer({
    template: fs.readFileSync('./index.template.html', 'utf-8')
})
const express = require('express')

const server = express()

server.get('/', (req, res) => {
    const app = new Vue({
        template: `<div>
            <h1>{{ msg }}</h1>
        </div>`,
        data: {
            msg: 'lagou 拉勾'
        }
    })

    renderer.renderToString(app, {
        title: '使用外部数据',
        meta: `<meta name="description" content="vue ssr 插入外部数据">`
    },(err, html) => {
        if (err) {
            return res.status(500).end('Internal Server Error.')
        }
        // 为html 设置 UTF-8编码
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(html)
    })
})

server.listen('3000', () => {
    console.log('server running at port 3000.')
})