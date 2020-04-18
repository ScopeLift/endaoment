
const routes = [
  {
    path: '/',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/Home.vue') },
      { name: 'join', path: '/join', component: () => import('pages/FindCause.vue') },
      { name: 'about', path: '/about', component: () => import('pages/About.vue') },
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
