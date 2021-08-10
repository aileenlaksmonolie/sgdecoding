import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      component: () => import('@/components/layouts/MainLayout'),
      children: [
        {
          path: '/',
          name: 'Home',
          component: () => import('@/components/pages/offline/Home'),
          meta: {
            feature: 'offline'
          }
        },
        {
          path: '/online-decoder',
          name: 'OnlineDecoder',
          component: () => import('@/components/pages/online/Online'),
          meta: {
            feature: 'online'
          }
        },
        {
          path: '/recording',
          name: 'Recording',
          component: () => import('@/components/pages/offline/Recording')
        },
        {
          path: '/conversation/:id',
          name: 'View Conversation',
          component: () => import('@/components/pages/offline/ViewConversation')
        },
        {
          path: '/profile',
          name: 'Profile',
          component: () => import('@/components/pages/user/Profile')
        },
        {
          path: '/users',
          name: 'User',
          component: () => import('@/components/pages/user/User')
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/components/pages/auth/Login')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (store.state.isDoingASR) {
    const cf = confirm('Are you sure want to change page? The ASR will stop!')

    if (cf) {
      next()
    }
  } else {
    next()
  }
})

export default router
