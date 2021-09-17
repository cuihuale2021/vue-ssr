import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home'

Vue.use(VueRouter)

export const createRouter = () => {
    const router = new VueRouter({
        mode: 'history',                // 不支持 Hash 模式, history 兼容前后端
        routes: [
            {
                name: 'home',
                path: '/',
                component: Home,
            },
            {
                name: 'about',
                path: '/about',
                component: () => import('@/pages/About'),
            },
            {
                name: 'error404',
                path: '*',
                component: () => import('@/pages/404'),
            },
        ]
    })

    return router 
}