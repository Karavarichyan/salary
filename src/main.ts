// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'

// createApp(App).mount('#app')
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { router } from './router'

createApp(App).use(router).use(VueQueryPlugin).mount('#app')
