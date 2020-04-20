
const routes = [
  {
    path: '/',
    component: () => import('layouts/BaseLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/Home.vue') },
      { name: 'causes', path: '/causes', component: () => import('pages/FindCause.vue') },
      { name: 'about', path: '/about', component: () => import('pages/About.vue') },
      { name: 'causeDetails', path: '/cause/:id', component: () => import('pages/CauseDetails.vue') },
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
