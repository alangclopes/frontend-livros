import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CadastroView from '../views/CadastroView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/cadastro', component: CadastroView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
