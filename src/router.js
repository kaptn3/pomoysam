import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import AdmUsers from './views/AdmUsers';
import AdmUsedQr from './views/AdmUsedQr';

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
      path: '*',
      redirect: '/login'
    }
  ],
});
