import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/welcome'
import Users from '../components/user/User'
import Roles from '../components/power/Roles'
import Rights from '../components/power/Rights'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'

const routes = [
  {
    path: '/login',
    component: Login
  }, {
    path: '/',
    redirect: '/login'
  }, {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/categories',
      component: Cate
    }, {
      path: '/params',
      component: Params
    }]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 挂载路由导航守卫
// to是将要访问的路由，from代表从哪个路径跳转而来，next是个函数，表示放行，next()放行  next('/login')强制跳转
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取touken
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
