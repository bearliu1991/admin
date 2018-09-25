import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/main/home'
    },
    {
      path: '/authorization',
      name: 'authorization',
      meta: {
        requireAuth: true
      },
      component: () => import('@/views/authorization/authorization')
    },
    {
      path: '/admin',
      redirect: '/admin/survey'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login')
    },
    {
      path: '/register/:step',
      name: 'register',
      component: () => import('@/views/register/register')
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('@/views/main/main'),
      children: [
        {
          path: '/main/home',
          name: 'home',
          component: () => import('@/views/home/home')
        },
        // 个人中心
        {
          path: '/main/personInfo',
          name: 'personInfo',
          meta: {
            requireAuth: true
          },
          component: () => import('@/views/personalCenter/personInfo')
        },
        // 注册协议
        {
          path: '/main/agreement',
          name: 'agreement',
          meta: {
            requireAuth: true
          },
          component: () => import('@/views/agreement/agreement')
        },
        // 我的企业
        {
          path: '/main/company',
          name: 'company',
          meta: {
            requireAuth: true
          },
          component: () => import('@/views/personalCenter/company')
        },
        // 创建新企业
        {
          path: '/main/createCompany',
          name: 'createCompany',
          meta: {
            requireAuth: true
          },
          component: () => import('@/views/personalCenter/createCompany')
        },
        // 修改手机号
        {
          path: '/main/editPhone/:oldMobile/:applyId',
          name: 'editPhone',
          meta: {
            requireAuth: true
          },
          component: () => import('@/views/personalCenter/editPhone')
        },
        // 修改手机号
        {
          path: '/main/webLink',
          name: 'webLink',
          component: () => import('@/views/webLink')
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      meta: {
        requireAuth: true
      },
      component: () => import('@/views/admin/admin-main/admin-main'),
      children: [
        {
          path: '/admin/survey',
          name: 'survey',
          meta: {
            requireAuth: true
          },
          component: () => import('@/views/admin/survey/survey')
        },
        // 坐席
        {
          path: '/admin/seats',
          name: 'seats',
          meta: {
            requireAuth: true
          },
          component: () => import('@/views/admin/seats/seats')
        },
        // 公众号
        {
          path: '/admin/tencent',
          name: 'tencent',
          redirect: '/admin/tencent/tencentManage',
          meta: {
            requireAuth: true
          },
          component: () => import('@/views/admin/tencent/tencent'),
          children: [
            {
              path: '/admin/tencent/tencentManage',
              name: 'tencentManage',
              meta: {
                requireAuth: true
              },
              component: () =>
                import('@/views/admin/tencentManage/tencentManage')
            }
          ]
        },
        {
          path: '/admin/stuff',
          name: 'stuff',
          meta: {
            requireAuth: true
          },
          component: () => import('@/views/admin/stuff/stuff')
        }
      ]
    }
  ]
})
