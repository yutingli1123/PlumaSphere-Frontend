import './assets/main.css'

import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// create app
const app = createApp(App)

// use pinia
app.use(createPinia())

// use router
app.use(router)

// mount app
app.mount('#app')
