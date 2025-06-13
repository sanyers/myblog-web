import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

const title = import.meta.env.VITE_NAME
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/views/pages/index.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/pages/home/index.vue'),
        meta: {
          title: '主页',
        },
      },
      {
        path: 'list/:types+',
        name: 'list',
        component: () => import('@/views/pages/list/index.vue'),
        meta: {
          title: '列表',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录后台',
    },
  },
  {
    path: '/manage',
    component: () => import('@/views/manage/index.vue'),
    children: [
      {
        path: '',
        name: 'manage',
        component: () => import('@/views/manage/home/index.vue'),
        meta: {
          title: '管理后台',
        },
      },
      {
        path: 'user-info',
        name: 'user-info',
        component: () => import('@/views/manage/user-info/index.vue'),
        meta: {
          title: '个人中心',
        },
      },
      {
        path: 'my-document',
        name: 'my-document',
        component: () => import('@/views/manage/my-document/index.vue'),
        meta: {
          title: '我的文档',
        },
      },
      {
        path: 'my-comment',
        name: 'my-comment',
        component: () => import('@/views/manage/my-comment/index.vue'),
        meta: {
          title: '我的评论',
        },
      },
      {
        path: 'user-manage',
        name: 'user-manage',
        component: () => import('@/views/manage/user-manage/index.vue'),
        meta: {
          title: '用户管理',
        },
      },
      {
        path: 'category-manage',
        name: 'category-manage',
        component: () => import('@/views/manage/category-manage/index.vue'),
        meta: {
          title: '栏目管理',
        },
      },
      {
        path: 'document-manage',
        name: 'document-manage',
        component: () => import('@/views/manage/document-manage/index.vue'),
        meta: {
          title: '文档管理',
        },
      },
      {
        path: 'comment-manage',
        name: 'comment-manage',
        component: () => import('@/views/manage/comment-manage/index.vue'),
        meta: {
          title: '评论管理',
        },
      },
      {
        path: 'document-edit',
        name: 'document-edit',
        component: () => import('@/views/manage/document-edit/index.vue'),
        meta: {
          title: '文档编辑',
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
