import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import AdmUsers from './views/AdmUsers';
import AdmUsedQr from './views/AdmUsedQr';
import AdmQr from './views/AdmQr';
import AdmRazmenStatistic from './views/AdmRazmenStatistic';
import AdmCashOuts from './views/AdmCashOuts';
import AdmUserRequest from './views/AdmUserRequest';
import Faq from './views/Faq';
import Promocodes from './views/Promocodes';
import News from './views/News';
import AdmUsedPromo from './views/AdmUsedPromo';
import CashbackStory from './views/CashbackStory';
import AdmWaterCounters from './views/AdmWaterCounters';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter(to, from, next) {
        if (localStorage.getItem('user-token')) {
          next('/adm-users');
        } else {
          next();
        }
      }
    },
    {
      path: '/adm-users',
      name: 'AdmUsers',
      component: AdmUsers,
    },
    {
      path: '/adm-used-qr',
      name: 'AdmUsedQr',
      component: AdmUsedQr,
    },
    {
      path: '/adm-qr',
      name: 'AdmQr',
      component: AdmQr
    },
    {
      path: '/adm-razmen-statistic',
      name: 'AdmRazmenStatistic',
      component: AdmRazmenStatistic
    },
    {
      path: '/adm-cash-outs',
      name: 'AdmCashOuts',
      component: AdmCashOuts
    },
    {
      path: '/adm-user-request',
      name: 'AdmUserRequest',
      component: AdmUserRequest
    },
    {
      path: '/promocodes',
      name: 'Promocodes',
      component: Promocodes
    },
    {
      path: '/faq',
      name: 'Faq',
      component: Faq
    },
    {
      path: '/used-promo',
      name: 'AdmUsedPromo',
      component: AdmUsedPromo
    },
    {
      path: '/news',
      name: 'News',
      component: News
    },
    {
      path: '/cashback-story',
      name: 'Cashback',
      component: CashbackStory
    },
    {
      path: '/water-counters',
      name: 'WaterCounters',
      component: AdmWaterCounters
    },
    {
      path: '/media/*',
    },
    {
      path: '*',
      redirect: '/login'
    }
  ],
});
