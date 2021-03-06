import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('views/home/Home')
const Cart = () => import('views/cart/Cart')
const Category = () => import('views/category/Category')
const Detail = () => import('views/detail/Detail')
const Profile = () => import('views/profile/Profile')
 // 安装VueRouter
 Vue.use(VueRouter)

// 配置路由信息
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/cart',
    component: Cart
  },
  {
    path: '/category',
    component: Category
  },
  {
    path: '/detail',
    component: Detail
  },
  {
    path: '/profile',
    component: Profile
  }
]
// 创建VueRouter对象
const router = new VueRouter({
  mode:'history',
  routes
})
export default router
