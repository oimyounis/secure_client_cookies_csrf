import { getAll, getById } from "../services/users.service";

export const users = {
  namespaced: true,
  state: {
    items: [],
    syncing: false
  },
  mutations: {
    setItems(state, items) {
      console.log('users synced');
      state.items = items;
    },
    syncStart(state) {
      state.syncing = true;
    },
    syncFinish(state) {
      state.syncing = false;
    }
  },
  actions: {
    getAll({commit}) {
      commit('syncStart');
      getAll().then(res => {
        if (res) {
          commit('setItems', res.data);
        }
        commit('syncFinish');
      });
    }
  }
};
