import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from "vue-router"
import routes from './route-nodes'
import type { App } from 'vue';
import {useUserStoreWithOut} from '@/store/modules/auth';
import { whiteNameList } from './constant';

const userAuthStore = useUserStoreWithOut();

export const router = createRouter({
  // process.env.BASE_URL
  history: createWebHashHistory(''),
  routes: routes.constantRoutes as RouteRecordRaw[],
});

// export function resetRouter() {
//   router.getRoutes().forEach((route) => {
//     const { name } = route;
//     if (name && !whiteNameList.some((n) => n === name)) {
//       router.hasRoute(name) && router.removeRoute(name);
//     }
//   });
// }

export async function setupRouter(app: App) {
  // 创建路由守卫
  userAuthStore.userAuth(router, whiteNameList)
  app.use(router);

  // 路由准备就绪后挂载APP实例
  await router.isReady();
}
export default router;