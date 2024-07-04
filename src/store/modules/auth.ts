
import { defineStore } from 'pinia';
import { authLogin,refreshToken } from '@/api/request/user';
import { AuthLogin } from '@/api/type/user';
import { WhiteNameList } from '@/router/constant';
import { ref } from 'vue';
import type { Router } from 'vue-router';
import { store } from '@/store';
import { message } from 'ant-design-vue';

interface TokenType {
  token: string;
  refresh_token: string;
  expire_time: number;
  refresh_time: number;
}

export const useUserAuthStore = defineStore(
  'useUserAuthStore',
  () => {
    const authToken: string = localStorage.getItem('auth_token') || '';
    const tokenData = ref<TokenType>({
      token: '',
      refresh_token: '',
      expire_time: 0,
      refresh_time: 0
    })
    if(authToken){
      let authTokenObject = JSON.parse(authToken);
      tokenData.value = {
        token: authTokenObject.token,
        refresh_token: authTokenObject.refresh_token,
        expire_time: authTokenObject.expire_time,
        refresh_time: authTokenObject.refresh_time
      }
    }
    const setToken = async(token : TokenType) => {
      localStorage.setItem('auth_token',JSON.stringify(token));
      tokenData.value = token
    };
    const clearToken = async() => {
      localStorage.removeItem('auth_token');
      tokenData.value = {
        token: '',
        refresh_token: '',
        expire_time: 0,
        refresh_time: 0
      }
    };
    const getToken = () => {
      return tokenData.value.token;
    };
    const verfiyToken = async() => {
      if(!tokenData.value.token){
        return false;
      }
      if(tokenData.value.refresh_time * 1000 < Date.now()){
        message.error('身份已过期，请重新登录')
        return false;
      }
      if(tokenData.value.expire_time * 1000 < Date.now()){
        refreshToken(tokenData.value.refresh_token).then(async ({isSuccess,apiResultData}) => {
          if(isSuccess){
            setToken(apiResultData as TokenType)
            return true
           }else{
            message.error('刷新token失败，请重新登录')
            return false;
           }
        })
      }
      return true;
    };
    const userLogin = async (params: AuthLogin) => {
      const { isSuccess, apiResultData } = await authLogin(params);
      if (isSuccess) {
        setToken(apiResultData as TokenType)
      }
      return Promise.reject(isSuccess);
    };

    const userAuth = async (router: Router, whiteNameList: WhiteNameList) => {
      router.beforeEach(async (to, from, next) => {
        if (whiteNameList.some((n) => n === to.name)) {
          next();
        }else{
          if (await verfiyToken()) {
            next()
          }else{
            next({ name: 'login', query: { redirect: to.fullPath }, replace: true });
          }
        }
      })
    }
    return {
      getToken,
      setToken,
      userLogin,
      userAuth
    }
  })
// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUserAuthStore(store);
}
