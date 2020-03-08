import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Smart from './../views/Smart.vue'
import Detail from './../views/Detail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'smart',
    component: Smart
  },
    {
        path: '/smart',
        name: 'smart',
        component: Smart
    },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
    {
        path: '/detail',
        name: 'detail',
        component: () => import(/* webpackChunkName: "about" */ '../views/Detail.vue')
    }
]

const router = new VueRouter({
  routes
})

export default router
