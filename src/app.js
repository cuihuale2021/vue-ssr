/**
 * 通用入口文件
 * 纯客户端时，负责创建实例，并挂载到DOM。SSR，责任转移到纯客户端的entry 文件
 * */
import Vue from 'vue'
import App from './App.vue'

// 导出一个工厂函数，用于创建新的应用程序、router、store 实例
export default function createApp() {
    const app = new Vue({
        render: h => h(App)
    })
    return {
        app
    }
}