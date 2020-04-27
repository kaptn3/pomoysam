/* eslint-disable */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('user-token') || '',
    nds: [
      'Без НДС',
      'Основная ставка 0%',
      'Основная ставка 10%',
      'Расчётная ставка 10%',
      'Основная ставка 18%',
      'Расчётная ставка 18%'
    ]
  },
  mutations: {
    auth(state, token) {
      state.token = token;
      localStorage.setItem('user-token', token);
    },
    logout(state) {
      state.token = '';
      localStorage.removeItem('user-token');
    }
  },
});
