import { createRouter, createWebHistory } from 'vue-router'

import EditTable from '../components/EditTable.vue'
import Create from '../views/Create.vue'
import Home from '../views/Home.vue'
import Tables from '../views/Tables.vue'
const routes = [
  { path: '/', component: Home },
  { path: '/tables', component: Tables },
  { path: '/create', component: Create },
  { path: '/tables/:id/edit', component: EditTable },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
