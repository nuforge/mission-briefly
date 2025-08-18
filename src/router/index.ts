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
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'About' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { title: 'Fleet Command Dashboard' },
    },
    // Fleet routes
    {
      path: '/fleet',
      name: 'fleet',
      component: () => import('../views/FleetView.vue'),
      meta: { title: 'Fleet Overview' },
    },
    {
      path: '/ship/:shipName',
      name: 'ship',
      component: () => import('../views/ShipView.vue'),
      props: true,
      meta: { title: 'Ship Details' },
    },
    // Personnel routes
    {
      path: '/crew',
      name: 'crew-list',
      component: () => import('../views/CrewListView.vue'),
      meta: { title: 'Fleet Personnel' },
    },
    {
      path: '/crew/:crewName',
      name: 'crew-detail',
      component: () => import('../views/CrewView.vue'),
      props: true,
      meta: { title: 'Crew Member' },
    },
    // Mission routes
    {
      path: '/missions',
      name: 'missions',
      component: () => import('../views/MissionListView.vue'),
      meta: { title: 'Mission Operations' },
    },
    {
      path: '/mission/:missionId',
      name: 'mission',
      component: () => import('../views/MissionView.vue'),
      props: true,
      meta: { title: 'Mission Details' },
    },
  ],
})

export default router
