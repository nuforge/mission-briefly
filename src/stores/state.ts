import { ref } from 'vue'
import { defineStore } from 'pinia'

const useStateStore = defineStore('state', () => {
  const navigationDrawer = ref(false)

  const openDrawer = () => {
    navigationDrawer.value = true
  }

  const closeDrawer = () => {
    navigationDrawer.value = false
  }

  const toggleDrawer = () => {
    navigationDrawer.value = !navigationDrawer.value
  }

  return { navigationDrawer, openDrawer, closeDrawer, toggleDrawer }
})

export default useStateStore
