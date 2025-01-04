import { request } from '@/utils/request';
import * as userType from '../type/user';
export function authLogin(form:userType.AuthLogin) {
    return request({
      url: '/login',
      method: 'post',
      requestType: 'form',
      data: form
    });
  }
  export function refreshToken(refresh_token:string) {
    return request({
      url: '/refresh_token',
      method: 'post',
      headers: {
        'Authorization': 'Bearer '+ refresh_token
      },
    });
  }
  export function logoutReq() {
    return request({
      url: '/logout',
      method: 'get',
    });
  }
  export function getUserInfoReq() {
    return request({
      url: '/userinfo',
      method: 'get',
    });
  }
  