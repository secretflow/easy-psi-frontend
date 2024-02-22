export const routes = [
  // {
  //   path: '/',
  //   wrappers: ['@/wrappers/theme-wrapper', '@/wrappers/login-auth'],
  //   component: '@/modules/layout/layout.view',
  //   routes: [
  //     { path: '/', component: 'new-home' },
  //     { path: '/home', component: 'new-home' },
  //     { path: '/dag', component: 'dag' },
  //     { path: '/node', component: 'new-node', wrappers: ['@/wrappers/node-auth'] },
  //     { path: '/record', component: 'record' },
  //     { path: '/my-node', component: 'my-node', wrappers: ['@/wrappers/node-auth'] },
  //     { path: '/message', component: 'message', wrappers: ['@/wrappers/node-auth'] },
  //   ],
  // },
  // {
  //   path: '/guide',
  //   wrappers: ['@/wrappers/theme-wrapper', '@/wrappers/login-auth'],
  //   component: 'guide',
  // },
  {
    path: '/',
    wrappers: ['@/wrappers/theme-wrapper', '@/wrappers/login-auth'],
    routes: [
      { path: '/', component: 'index' },
      { path: '/guide', component: 'guide' },
      {
        path: '/task',
        component: 'task',
      },
      {
        path: '/task-details',
        component: 'task-details',
      },
    ],
  },

  {
    path: '/login',
    wrappers: ['@/wrappers/theme-wrapper', '@/wrappers/login-wrapper'],
    component: 'login',
  },
];
