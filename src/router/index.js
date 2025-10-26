import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: '/office',
    component: () => import('@/views/office/index.vue'),
  },
  {
    path: '/contract/create',
    component: () => import('@/views/contract/create/index.vue'),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

//页面白名单
const whiteList = ['/login', '/404', '/401', '/500'];
let firstLoad = true;
router.beforeEach(async (to, from) => {
  return true;
});

export function setup(app) {
  app.use(router);
}
