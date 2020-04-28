/* eslint-disable */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('user-token') || ''
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
  getters: {
    config: state => {
      return {
        headers: {
          Authorization: `Token ${state.token}`
        }
      }
    }
  }
});
