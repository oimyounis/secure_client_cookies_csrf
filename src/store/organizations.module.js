import Vue from "vue";
import {getAll, getById} from "../services/organizations.service";

export const organizations = {
  namespaced: true,
  state: {
    orgs: [],
    selectedOrg: {},
    errors: {
      username: [
        'this field is required'
      ]
    }
  },
  mutations: {
    setOrgs(state, orgs) {
      state.orgs = orgs;
    },
    setSelectedOrg(state, org) {
      state.selectedOrg = org;
    }
  },
  actions: {
    getAllOrgs({commit}) {
      getAll().then((res) => {
        if (res.data.status == 1) {
          commit('setOrgs', res.data.data);
        }
      });
    },
    getOrgById({commit}, id) {
      getById(id).then(res => {
        if (res.data.status == 1) {
          commit('setSelectedOrg', res.data.data);
        }
        else {

        }
      });
    }
  }
};