/**
 * 客户端入口文件
 * 负责创建应用程序，并挂载到DOM
 * 
 * */
import {
    createApp
} from './app'

// 客户端特定引导逻辑...

const {
    app
} = createApp()

// 挂载到 App.vue 中的 id="app"
app.$mount('#app')