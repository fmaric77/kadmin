import { route } from 'quasar/wrappers';
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './routes';

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const authToken = localStorage.getItem('authToken');
    if (to.path === '/' && authToken) {
      next('/admin-board'); // Redirect to admin board if authenticated
    } else if (to.path === '/admin-board' && !authToken) {
      next('/'); // Redirect to login page if not authenticated
    } else {
      next(); // Proceed to the route
    }
  });

  return Router;
});