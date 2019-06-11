import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/http'

import { users } from './users.module'
import { auth } from './auth.module'
import { organizations } from './organizations.module'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    users,
    auth,
    organizations
  },
  state: {
    addr: null
  },
  mutations: {
    setAddr(state, addr) {
      state.addr = addr;
    }
  },
  actions: {
    lookupAddr({commit}) {
      http(false).get('lookup/addr').then(res => {
        commit('setAddr', res.data.addr);
      });
    }
  }
});
