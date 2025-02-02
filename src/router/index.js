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
    const publicPages = ['/']; 
    const authRequired = !publicPages.includes(to.path);

    if (authRequired && !authToken) {
      next('/'); // Redirect to login page if not authenticated
    } else {
      next(); // Proceed to the route
    }
  });

  return Router;
});