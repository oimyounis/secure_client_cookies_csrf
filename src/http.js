/* HTTP Provider
   Requires "axios" package.
   Do not modify any function or variable in this file except the lines marked with "CONFIG".
   Secures API calls issued to the corresponding server by appending the "Authorization" and "REQUEST-ID" headers.
*/

import axios from "axios";
import { logout, refreshToken } from "./services/auth.service";
import { parseJWT, getRequestId, jwtExcludes, reqIdExcludes,
  refreshExcludes, allExcludes, getCookie, deleteCookie, setCookie } from "./utils";


function responseError(error) {
  const reqUrl = error.config.url;
  const exclude = ["auth/token/refresh", "auth/login"]; // CONFIG -- to handle error manually

  let valid = true;
  for (let url of exclude) {
    if (reqUrl.indexOf(url) !== -1) {
      valid = false;
      break;
    }
  }

  if (valid) {
    const res = error.response;
    if (res.status === 401) {
      logout();
    } else {
      return Promise.reject(error);
    }
  } else {
    return Promise.reject(error);
  }
}

const instance = axios.create({
  baseURL: `http://sub1.auth.com/api/` // CONFIG -- set it to backend api url
});

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.withCredentials = true;

instance.interceptors.request.use(async function(config) {
  if (reqIdExcludes.indexOf(config.url) === -1) {
    config.headers.common["X-REQUEST-ID"] = getRequestId(config);
  }

  if (refreshExcludes.indexOf(config.url) === -1 && allExcludes.indexOf(config.url) === -1) {
    const jwt = getCookie('jwt_auth_token');
    if (jwt) {
      const parsed = parseJWT(jwt);
      const now = parseInt(Date.now() / 1000);
      const expired = parsed.exp < now;
      const nearExpired = parsed.exp - 5 < now;

      // console.log('nearExpired || expired', nearExpired, expired);

      if (nearExpired || expired) {
        await refreshToken();
      }
    }
  }
  else if (jwtExcludes.indexOf(config.url) !== -1 || allExcludes.indexOf(config.url) !== -1) {
    const tok = getCookie('jwt_auth_token');
    if (tok) {
      deleteCookie('jwt_auth_token');
      setTimeout(function(){
        setCookie('jwt_auth_token', tok);
      }, 80);
    }
  }

  return config;
});
instance.interceptors.response.use(res => res, responseError);

export default function(appendAuthHeader = true) {
  // const token = Vue.localStorage.get("token");
  const ct = getCookie('csrftoken');
  // console.log('ct', ct);
  if (ct) {
    instance.defaults.headers.common["X-CSRFTOKEN"] = ct;
  }

  // if (appendAuthHeader && token) {
  //   instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  // } else {
  //   delete instance.defaults.headers.common["Authorization"];
  // }

  return instance;
}
