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
      redirect: "/admin/survey",
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
                import("@/pages/admin/tencent/tencentManage/tencentManage")
            },
            {
              // 自定义菜单
              path: "/admin/tencent/customMenu",
              name: "customMenu",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/tencent/customMenu")
            },
            {
              // 个性化菜单
              path: "/admin/tencent/personalizedMenu",
              name: "personalizedMenu",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/tencent/personalizedMenu")
            },
            {
              // 素材管理
              path: "/admin/tencent/material",
              name: "material",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/tencent/materialManage/material")
            },
            {
              // 模板消息
              path: "/admin/tencent/messageTemplate",
              name: "messageTemplate",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/tencent/messageTemplate")
            },
            {
              // 自动回复
              path: "/admin/tencent/autoReplay",
              name: "autoReplay",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/tencent/autoReplay")
            },
            {
              // 粉丝标签
              path: "/admin/tencent/fansLabel",
              name: "fansLabel",
              meta: {
                requireAuth: true
              },
              component: () => import("@/pages/admin/tencent/fansLabel")
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
    }
  ]
})
