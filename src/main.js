/* Main Entry Point
   This file should be the entry point for all projects that require the authentication functionality.
*/

import Vue from 'vue'
import http from './http'
import App from './App.vue'
import VueLocalStorage from 'vue-localstorage'
import store from './store'
import router from './router'

Vue.config.productionTip = false;
Vue.use(VueLocalStorage);
Vue.prototype.$http = http;

// store.dispatch('lookupAddr'); // Do not remove this line
// store.dispatch('auth/checkLogin'); // Do not remove this line

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
