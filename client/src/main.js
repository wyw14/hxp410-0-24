import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Confess from './views/Confess.vue'
import History from './views/History.vue'
import './style.css'

const routes = [
  { path: '/', component: Home },
  { path: '/confess', component: Confess },
  { path: '/history', component: History }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
