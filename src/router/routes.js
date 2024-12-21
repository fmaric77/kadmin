const MainLayout = () => import('layouts/MainLayout.vue');

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') }, // Login page
    ],
  },
  {
    path: '/admin-board',
    component: MainLayout,
    children: [
      { path: '', component: () => import('pages/AdminBoardPage.vue') }, // Admin board page
    ],
  },
  {
    path: '/customers',
    component: MainLayout,
    children: [
      { path: '', component: () => import('pages/CustomersPage.vue') }, // Customers page
    ],
  },
  {
    path: '/sellers',
    component: MainLayout,
    children: [
      { path: '', component: () => import('pages/SellersPage.vue') }, // Sellers page
    ],
  },
  {
    path: '/orders',
    component: MainLayout,
    children: [
      { path: '', component: () => import('pages/OrdersPage.vue') }, // Orders page
    ],
  },
  {
    path: '/products',
    component: MainLayout,
    children: [
      { path: '', component: () => import('pages/ProductsPage.vue') }, // Products on Order page
    ],
  },
  {
    path: '/products-on-order',
    component: MainLayout,
    children: [
      { path: '', component: () => import('pages/ProductsOnOrderPage.vue') }, // Products on Order page
    ],
  },
  {
    path: '/:catchAll(.*)*', // Catch-all for non-existent pages
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;