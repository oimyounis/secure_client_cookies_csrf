/* Utility functions
   Do not modify any function or variable in this file except the lines marked with "CONFIG".
   You may use the "parseJWT" function to read the contents of the acquired JWT.
*/

import store from "./store";

const chars = Array.from('x4$59G!kW*'); // CONFIG -- probably will not require changes
export const reqIdExcludes = ["lookup/addr"]; // CONFIG -- urls that require reqid check bypass
export const jwtExcludes = ["auth/login"]; // CONFIG -- urls that require jwt bypass
export const refreshExcludes = ["auth/token/refresh", "lookup/addr"];
export const allExcludes = ["lookup/addr"];

export function parseJWT(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

function hashInt(intString) {
  let hashed = "";
  for (const char of intString) {
    hashed += char === "." ? "?" : chars[parseInt(char)];
  }
  return hashed;
}

function hash(string) {
  let hashed = "";
  for (let idx = 0; idx < string.length; idx++) {
    let charCode = string.charCodeAt(idx);
    charCode = charCode > 99 ? charCode.toString() : "0" + charCode;
    hashed += hashInt(charCode) + "";
  }
  return hashed;
}

export function getRequestId(req) {
  let url = req.url.split("/");
  url = url[url.length - 1] !== "" ? url[url.length - 1] : url[url.length - 2];
  const addr = store.state.addr ? hashInt(store.state.addr) : " ";
  const time = hashInt(Date.now().toString());
  return `${hash(url)}+${addr}+${time}`;
}

export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
    }
  }
  return cookieValue;
}

export function deleteCookie(name) {
  document.cookie = `${name}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function setCookie(name, value) {
  document.cookie = `${name}=${value};`;
}