import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/main/home"
    },
    {
      path: "/authorization",
      name: "authorization",
      meta: {
        requireAuth: true
      },
      component: () => import("@/pages/authorization/authorization")
    },
    {
      path: "/admin",
      redirect: "/admin/survey"
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/login/login")
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/pages/register/register")
    },
    {
      path: "/main",
      name: "main",
      component: () => import("@/pages/main/main"),
      children: [
        {
          path: "/main/home",
          name: "home",
          component: () => import("@/pages/home/home")
        },
        // 个人中心
        {
          path: "/main/personInfo",
          name: "personInfo",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/personalCenter/personInfo")
        },
        // 注册协议
        {
          path: "/main/agreement",
          name: "agreement",
          component: () => import("@/pages/agreement/agreement")
        },
        // 我的企业
        {
          path: "/main/company",
          name: "company",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/personalCenter/company")
        },
        // 创建新企业
        {
          path: "/main/createCompany",
          name: "createCompany",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/personalCenter/createCompany")
        },
        // 修改手机号
        {
          path: "/main/editPhone/:oldMobile/:applyId",
          name: "editPhone",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/personalCenter/editPhone")
        },
        // 修改手机号
        {
          path: "/main/webLink",
          name: "webLink",
          component: () => import("@/pages/webLink")
        }
      ]
    },
    {
      path: "/admin",
      name: "admin",
      meta: {
        requireAuth: true
      },
      component: () => import("@/pages/admin/admin-main/admin-main"),
      children: [
        {
          path: "/admin/survey",
          name: "survey",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/admin/survey/survey")
        },
        // 坐席
        {
          path: "/admin/seats",
          name: "seats",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/admin/seats/seats")
        },
        // 公众号
        {
          path: "/admin/tencent",
          name: "tencent",
          redirect: "/admin/tencent/tencentManage",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/admin/secondMenu/secondMenu"),
          children: [
            {
              path: "/admin/tencent/tencentManage",
              name: "tencentManage",
              meta: {
                requireAuth: true
              },
              component: () =>
                import("@/pages/admin/tencentManage/tencentManage")
            }
          ]
        },
        // setting
        {
          path: "/admin/setting",
          name: "setting",
          redirect: "/admin/setting/seatSetting",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/admin/secondMenu/secondMenu"),
          children: [
            {
              path: "/admin/setting/seatSetting",
              name: "seatSetting",
              meta: {
                requireAuth: true
              },
              component: () =>
                import("@/pages/admin/setting/seatSetting/seatSetting")
            },
            {
              path: "/admin/setting/records",
              name: "records",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/orderRecords/records")
            },
            {
              path: "/admin/setting/corpInfo",
              name: "corpInfo",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/setting/corpInfo/corpInfo")
            }
          ]
        },
        {
          path: "/admin/stuff",
          name: "stuff",
          meta: {
            requireAuth: true
          },
          component: () => import("@/pages/admin/stuff/stuff")
        }
      ]
    },
    {
      path: "/pay",
      name: "pay",
      meta: {
        requireAuth: true
      },
      component: () => import('@/pages/admin/pay/pay')
    },
    {
      path: '/payMain',
      name: 'payMain',
      meta: {
        requireAuth: true
      },
      component: () => import('@/pages/admin/pay/payMain')
    }
  ]
})
