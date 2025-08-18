import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: 'Home' },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'About' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { title: 'Fleet Command Dashboard' },
    },
    {
      path: '/ship/:shipName',
      name: 'ship',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ShipView.vue'), // Ensure this file exists
      props: true, // Pass the route parameter as a prop
      meta: { title: 'Ship Details' },
    },
    {
      path: '/crew/:crewName',
      name: 'crew',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/CrewView.vue'), // Ensure this file exists
      props: true, // Pass the route parameter as a prop
      meta: { title: 'Crew Member' },
    },
    {
      path: '/mission/:missionId',
      name: 'mission',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/MissionView.vue'), // Ensure this file exists
      props: true, // Pass the route parameter as a prop
      meta: { title: 'Mission Details' },
    },
  ],
})

export default router
