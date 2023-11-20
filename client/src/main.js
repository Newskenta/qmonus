import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

// axios
import api  from './plugins/api.js'
// store
import { store } from './store/index.js'

loadFonts()
;(async ()=>{

  // Get Casval session API
  await api.getSession()

  createApp(App)
    .use(api)
    .use(store)
    .use(vuetify)
    .mount('#app')
})();