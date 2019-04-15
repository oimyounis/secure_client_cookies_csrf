/* HTTP Provider
   Requires "axios" package.
   Do not modify any function or variable in this file except the lines marked with "CONFIG".
   Secures API calls issued to the corresponding server by appending the "Authorization" and "REQUEST-ID" headers.
*/

import axios from "axios";
import Vue from "vue";
import { logout, refreshToken } from "./services/auth.service";
import { parseJWT, getRequestId, jwtExcludes, reqIdExcludes } from "./utils";


function responseError(error) {
  const reqUrl = error.config.url;
  const exclude = ["auth/token/refresh/", "auth/login/"]; // CONFIG -- to handle error manually

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
  baseURL: `http://localhost:8000/api/` // CONFIG -- set it to backend api url
});

instance.interceptors.request.use(async function(config) {
  if (reqIdExcludes.indexOf(config.url) === -1) {
    config.headers.common["X-REQUEST-ID"] = getRequestId(config);
  }

  if (jwtExcludes.indexOf(config.url) === -1) {
    if (
      config.headers.common["Authorization"] &&
      Object.keys(config.headers.common["Authorization"]).length > 0
    ) {
      const jwt = config.headers.common["Authorization"].replace("Bearer ", "");
      const parsed = parseJWT(jwt);
      const expired = parsed.exp < parseInt(Date.now() / 1000);
      const nearExpired = parsed.exp - 5 < parseInt(Date.now() / 1000);

      if (nearExpired || expired) {
        await refreshToken();
      }
    }
  }
  return config;
});
instance.interceptors.response.use(res => res, responseError);

export default function(appendAuthHeader = true) {
  const token = Vue.localStorage.get("token");

  if (appendAuthHeader && token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }

  return instance;
}
