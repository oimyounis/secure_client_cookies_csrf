/* Authentication Store Module
   This file works together with the AuthService to provide authentication functionality.
*/

import Vue from "vue";
import {parseJWT} from "../utils";
import {refreshToken, logout} from "../services/auth.service";

export const auth = {
  namespaced: true,
  state: {
    loggedIn: false,
    loginErrorMsg: null,
    tokenExp: null
  },
  mutations: {
    loginSuccess(state) {
      let tok = Vue.localStorage.get('token');
      if (tok) {
        state.loginErrorMsg = null;

        let exp = parseJWT(tok).exp;
        state.loggedIn = true;
        state.tokenExp = exp;
        this.dispatch('auth/tokenCheck');
      }
    },
    logout(state, error = null) {
      Vue.localStorage.remove('token');
      state.loggedIn = false;
      state.tokenExp = null;
      // console.log('auth/login/error', error);
      state.loginErrorMsg = error;
    },
    checkTokenFail(state, error) {
      logout(null, error);
    }
  },
  actions: {
    checkLogin({commit}) {
      let tok = Vue.localStorage.get('token');
      if (tok){
        commit('loginSuccess', parseJWT(tok).exp);
      }
    },
    tokenCheck({commit, state}){
      let time = parseInt(Date.now() / 1000);
      let afterSecs = state.tokenExp - time - 5;
      // console.log('afterSecs', afterSecs);

      if (afterSecs >= 0) {
        // console.log('tokenCheck set in store');
        setTimeout(function(){
          // console.log('will update token');
          refreshToken();
        }, afterSecs * 1000);
      }
      else {
        commit('checkTokenFail', 'Your session has expired. Please login again.');
      }
    }
  }
};