/* Authentication Store Module
   This file works together with the AuthService to provide authentication functionality.
*/

import Vue from "vue";
import {parseJWT, getCookie, deleteCookie} from "../utils";
import {refreshToken, logout} from "../services/auth.service";

export const auth = {
  namespaced: true,
  state: {
    loggedIn: false,
    loginErrorMsg: null,
    tokenExp: null,
    timer: null
  },
  mutations: {
    loginSuccess(state) {
      const tok = getCookie('jwt_auth_token');
      if (tok) {
        state.loginErrorMsg = null;

        let exp = parseJWT(tok).exp;
        state.loggedIn = true;
        state.tokenExp = exp;
        this.dispatch('auth/tokenCheck');
      }
    },
    logout(state, error = null) {
      deleteCookie('jwt_auth_token');
      state.loggedIn = false;
      state.tokenExp = null;
      // console.log('auth/login/error', error);
      state.loginErrorMsg = error;
    },
    checkTokenFail(state, error) {
      logout(null, error);
    },
    clearTimer(state) {
      if (state.timer) {
        clearTimeout(state.timer);
        state.timer = null;
      }
    },
    setTimer(state, timer) {
      state.timer = timer;
    }
  },
  actions: {
    checkLogin({commit}) {
      // let tok = Vue.localStorage.get('token');
      const tok = getCookie('jwt_auth_token');
      if (tok){
        commit('loginSuccess', parseJWT(tok).exp);
      }
    },
    tokenCheck({commit, state}){
      let time = parseInt(Date.now() / 1000);
      let afterSecs = state.tokenExp - time - 5;
      console.log('afterSecs', afterSecs);

      if (afterSecs >= 0) {
        commit('clearTimer');
        commit('setTimer', setTimeout(function(){
          console.log('will update token');
          refreshToken();
        }, afterSecs * 1000));
      }
      else {
        refreshToken();
      }
    }
  }
};