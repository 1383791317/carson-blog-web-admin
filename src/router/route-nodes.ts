
// 简化并明确类型定义
interface BaseRoute {
  path: string;
  name: string;
  checked?: boolean;
  component?: () => Promise<any>; // 明确组件为异步加载
  hidden?: boolean;
  redirect?: string;
  children?: BaseRoute[];
  meta?: RouteMeta;
}
type HandlerRoutesT = BaseRoute;
type ConstantRoutesT = BaseRoute;

// 元数据接口
interface RouteMeta {
  title: string;
  menuType?: string;
  noCache?: boolean; // 不缓存
  icon?: string;
}

// 优化后的动态路由配置
const handlerRoutes: HandlerRoutesT[] = [
  {
    path: '',
    name: 'index',
    meta: {title:'控制台',icon:'console'},
    redirect: '/index/dashboard',
    children: [
      {
        path: '/index/dashboard',
        name: 'dashboard',
        meta: {title:'控制台'},
        component: () => import('@/views/index/dashboard.vue')
      }
    ],
  },
  {
    path: '',
    name: 'article',
    meta: {title:'文章',icon:'article'},
    children: [
      {
        path: '/article/category',
        name: 'article_category',
        meta: {title:'分类管理'},
        component: () => import('@/views/article/category/index.vue')
      },
      {
        path: '/article/tags',
        name: 'article_tags',
        meta: {title:'标签管理'},
        component: () => import('@/views/article/tags.vue')
      },
      {
        path: '/article/manage',
        name: 'article_manage',
        meta: {title:'文章管理'},
        component: () => import('@/views/article/manage.vue')
      },
      {
        path: '/article/add',
        name: 'article_add',
        meta: {title:'创建文章'},
        component: () => import('@/views/article/add.vue')
      },
    ],
  },  
];

// 常量路由配置优化
const constantRoutes: ConstantRoutesT[] = [
  {
    path: '/login',
    name:'login',
    meta: {title:'登录'},
    component: () => import('@/views/index/login.vue')
  },
  {
    path: '/',
    name: 'main', 
    meta: {title:'首页'},
    component: () => import('@/views/layouts/basic.vue'),
    redirect: '/index/dashboard',
    children: handlerRoutes,
  },
];

export default {
  constantRoutes,
  handlerRoutes
};