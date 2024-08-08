import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

const title = '我的博客'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/pages/pages.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/pages/home/home.vue'),
        meta: {
          title: '主页',
        },
      },
      {
        path: 'list/:types+',
        name: 'list',
        component: () => import('@/views/pages/list/list.vue'),
        meta: {
          title: '列表',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
    meta: {
      title: '登录后台',
    },
  },
  {
    path: '/manage',
    component: () => import('@/views/manage/manage.vue'),
    children: [
      {
        path: '',
        name: 'manage',
        component: () => import('@/views/manage/home/home.vue'),
        meta: {
          title: '管理后台',
        },
      },
      {
        path: 'category-page',
        name: 'category-page',
        component: () =>
          import('@/views/manage/category-page/category-page.vue'),
        meta: {
          title: '分类管理',
        },
      },
      {
        path: 'blog-page',
        name: 'blog-page',
        component: () => import('@/views/manage/blog-page/blog-page.vue'),
        meta: {
          title: '博客管理',
        },
      },
      {
        path: 'comment-page',
        name: 'comment-page',
        component: () => import('@/views/manage/comment-page/comment-page.vue'),
        meta: {
          title: '评论管理',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

document.title = title
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta?.title + ' - ' + title
  }
  next()
})

export default router
