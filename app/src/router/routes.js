
const routes = [
  {
    path: '/',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/Home.vue') },
      { name: 'endaoments', path: '/endaoments', component: () => import('pages/FindEndaoment.vue') },
      { name: 'about', path: '/about', component: () => import('pages/About.vue') },
      { name: 'endaomentDetails', path: '/endaoment/:address', component: () => import('pages/EndaomentDetails.vue') },
      { name: 'create', path: '/create', component: () => import('pages/CreateEndaoment.vue') },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
