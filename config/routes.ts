export const routes = [
  {
    path: '/home',
    component: 'index',
    wrappers: ['@/wrappers/theme-wrapper', '@/wrappers/login-auth'],
  },
  {
    path: '/guide',
    component: 'guide',
    wrappers: ['@/wrappers/theme-wrapper', '@/wrappers/login-auth'],
  },
  {
    path: '/task',
    component: 'task',
    wrappers: ['@/wrappers/theme-wrapper', '@/wrappers/login-auth'],
  },
  {
    path: '/task-details',
    component: 'task-details',
    wrappers: ['@/wrappers/theme-wrapper', '@/wrappers/login-auth'],
  },

  {
    path: '/login',
    wrappers: ['@/wrappers/theme-wrapper', '@/wrappers/login-wrapper'],
    component: 'login',
  },
  {
    path: '/',
    wrappers: ['@/wrappers/theme-wrapper'],
    component: 'auth',
  },
];
