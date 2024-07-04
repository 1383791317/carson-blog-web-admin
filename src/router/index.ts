import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from "vue-router"
import routes from './route-nodes'
import type { App } from 'vue';
import {useUserStoreWithOut} from '@/store/modules/auth';
import { whiteNameList } from './constant';

const userAuthStore = useUserStoreWithOut();

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes.constantRoutes as any as RouteRecordRaw[],
});

export async function setupRouter(app: App) {
  // 创建路由守卫
  await userAuthStore.userAuth(router, whiteNameList)
  app.use(router);

  // 路由准备就绪后挂载APP实例
  await router.isReady();
}
export default router;