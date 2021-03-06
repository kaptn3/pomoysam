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
import AdmEnergyCounters from './views/AdmEnergyCounters';
import AdmBrokenStat from './views/AdmBrokenStat';
import AdmChem from './views/AdmChem';
import AdmTechs from './views/AdmTechs';
import RestChem from './views/RestChem';
import EditTechs from './views/EditTechs';
import EditOperators from './views/EditOperators';

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
      path: '/energy-counters',
      name: 'EnergyCounters',
      component: AdmEnergyCounters
    },
    {
      path: '/broken-stat',
      name: 'AdmBrokenStat',
      component: AdmBrokenStat
    },
    {
      path: '/chem',
      name: 'AdmChem',
      component: AdmChem
    },
    {
      path: '/techs',
      name: 'AdmTechs',
      component: AdmTechs
    },
    {
      path: '/rest-chem',
      name: 'RestChem',
      component: RestChem
    },
    {
      path: '/edit-techs',
      name: 'EditTechs',
      component: EditTechs
    },
    {
      path: '/edit-operators',
      name: 'EditOperators',
      component: EditOperators
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
