/* Authentication Service
   Provides "login" and "logout" functions.
   The "refreshToken" function runs automatically. It is not intended for manual use.
*/

import http from '@/http'
import store from "@/store"
import router from '@/router'
import Vue from 'vue'

export function login(username, password){
  return new Promise((resolve, reject) => {
    http(false).post(`auth/login/`, {username: username, password: password})
      .then(res => {
        if (res) {
          if (res.data.hasOwnProperty('token')) {
            let token = res.data.token;
            Vue.localStorage.set('token', token);
            store.commit('auth/loginSuccess');
            resolve();
          }
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function logout(returnLocation = null, error = null){
  if (returnLocation == null) {
    returnLocation = {name: 'login'};
  }
  store.commit('auth/logout', error);
  router.replace(returnLocation);
}

export function refreshToken(){
  const token = Vue.localStorage.get('token');
  return new Promise((resolve, reject) => {
    if (token) {
      http(false).post('auth/token/refresh/', {token})
        .catch(error => {
          logout(null, 'Your session has expired. Please login again.');
          reject(error);
        })
        .then(res => {
          if (res) {
            Vue.localStorage.set('token', res.data.token);
            // console.log('token refreshed');
            store.commit('auth/loginSuccess');
            resolve();
          }
        });
    }
    else{
      resolve();
    }
  });
}