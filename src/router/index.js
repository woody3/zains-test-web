import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                     if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true                 if set true, will always show the root menu
 *                                  if not set alwaysShow, when item has more than one children route,
 *                                  it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect             if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'               the name is used by <keep-alive> (must set!!!)
 * meta : {
    permissions: ['admin','editor'] control the page permissions (you can set multiple permissions)
    title: 'title'                  the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x'    the icon show in the sidebar
    noCache: true                   if set true, the page will no be cached(default is false)
    affix: true                     if set true, the tag will affix in the tags-view
    breadcrumb: false               if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'     if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all permissions can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }, {
        path: 'setting',
        component: () => import('@/views/dashboard/setting'),
        name: 'Setting',
        hidden: true,
        meta: { title: '个人设置' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user permissions
 */
export const asyncRoutes = [
  {
    path: '/template',
    component: Layout,
    redirect: '/template/list',
    meta: { title: '模板管理', icon: 'list', permissions: ['template'] },
    children: [
      {
        path: 'list',
        component: () => import('@/views/template/list'),
        name: 'TemplateList',
        meta: { title: '模板管理', permissions: ['template'] }
      },
      {
        path: 'create',
        component: () => import('@/views/template/edit'),
        name: 'TemplateCreate',
        hidden: true,
        meta: { title: '创建模板', permissions: ['template'] }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/template/edit'),
        name: 'TemplateEdit',
        hidden: true,
        meta: { title: '编辑模板', permissions: ['template'] }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统管理', icon: 'setting', permissions: ['user', 'permission', 'config'] },
    children: [
      {
        path: 'user',
        component: () => import('@/views/user/list'),
        name: 'UserList',
        meta: { title: '用户管理', permissions: ['user'] }
      },
      {
        path: 'role',
        component: () => import('@/views/role/list'),
        name: 'RoleList',
        meta: { title: '权限管理', permissions: ['permission'] }
      },
      {
        path: 'config',
        component: () => import('@/views/config/index'),
        name: 'SystemConfig',
        meta: { title: '系统设置', permissions: ['config'] }
      }
    ]
  },
  // {
  //   path: '/project',
  //   component: Layout,
  //   meta: { title: '项目管理', icon: 'setting', permissions: ['user', 'permission', 'config'] },
  //   name: 'Project'
  //   children: [
  //     {
  //       path: 'overView',
  //       component: () => import('@/views/project/overView'),
  //       name: 'overView',
  //       meta: { title: '项目概览', permissions: ['user'] }
  //     },
  //     {
  //       path: 'envConf',
  //       component: () => import('@/views/project/envConf'),
  //       name: 'envConf',
  //       meta: { title: '环境配置', permissions: ['permission'] }
  //     },
  //     {
  //       path: 'config',
  //       component: () => import('@/views/config/index'),
  //       name: 'SystemConfig',
  //       meta: { title: '系统设置', permissions: ['config'] }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
