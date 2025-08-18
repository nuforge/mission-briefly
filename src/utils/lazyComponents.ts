// Dynamic component loader for lazy loading
// This reduces the initial bundle size by loading components only when needed

// Lazy load all view components
export const HomeView = () => import('@/views/HomeView.vue')
export const AboutView = () => import('@/views/AboutView.vue')
export const ShipView = () => import('@/views/ShipView.vue')
export const CrewView = () => import('@/views/CrewView.vue')
export const MissionView = () => import('@/views/MissionView.vue')
export const DashboardView = () => import('@/views/DashboardView.vue')

// Lazy load component cards (loaded only when first view is accessed)
export const CharacterCard = () => import('@/components/cards/CharacterCard.vue')
export const MissionCard = () => import('@/components/cards/MissionCard.vue')
export const StarshipCard = () => import('@/components/cards/StarshipCard.vue')

// Lazy load tag components
export const ATag = () => import('@/components/tags/ATag.vue')
export const CharacterTag = () => import('@/components/tags/CharacterTag.vue')
export const StarshipTag = () => import('@/components/tags/StarshipTag.vue')

// Lazy load other components
export const AppHeader = () => import('@/components/AppHeader.vue')
export const DepartmentIcon = () => import('@/components/DepartmentIcon.vue')
export const MissionLogs = () => import('@/components/MissionLogs.vue')
export const NavigationDrawer = () => import('@/components/NavigationDrawer.vue')
export const NuProgressBars = () => import('@/components/NuProgressBars.vue')
export const RankPips = () => import('@/components/RankPips.vue')

// Error boundary components (keep these eager loaded since they're critical for error handling)
export const ErrorBoundary = () => import('@/components/error/ErrorBoundary.vue')
export const ErrorAlert = () => import('@/components/error/ErrorAlert.vue')

// Create a component registry for on-demand loading
export const ComponentRegistry = {
  // Views
  HomeView,
  AboutView,
  ShipView,
  CrewView,
  MissionView,
  DashboardView,

  // Cards
  CharacterCard,
  MissionCard,
  StarshipCard,

  // Tags
  ATag,
  CharacterTag,
  StarshipTag,

  // Components
  AppHeader,
  DepartmentIcon,
  MissionLogs,
  NavigationDrawer,
  NuProgressBars,
  RankPips,

  // Error handling
  ErrorBoundary,
  ErrorAlert,
}

// Utility function to preload critical components
export const preloadCriticalComponents = async () => {
  // Preload components that are likely to be used immediately
  await Promise.all([HomeView(), AppHeader(), NavigationDrawer()])
}

// Utility function to preload components based on route
export const preloadRouteComponents = async (routeName: string) => {
  const preloadMap: Record<string, Array<() => Promise<any>>> = {
    home: [HomeView, DashboardView],
    ship: [ShipView, StarshipCard, StarshipTag],
    crew: [CrewView, CharacterCard, CharacterTag],
    mission: [MissionView, MissionCard],
    about: [AboutView],
  }

  const loadersToExecute = preloadMap[routeName] || []
  if (loadersToExecute.length > 0) {
    const promises = loadersToExecute.map((loader) => loader())
    await Promise.all(promises)
  }
}
