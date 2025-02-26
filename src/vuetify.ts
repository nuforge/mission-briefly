// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { aliases as aliases_md, md } from 'vuetify/iconsets/md'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      ...aliases_md,
      menu: 'mdi-menu',
    },
    sets: {
      mdi,
      md,
    },
  },
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
  },
})

export default vuetify
