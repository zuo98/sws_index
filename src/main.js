import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.css'

import Axios from '@/api/axios-config.js'

const app = createApp(App)

app.use(router)
app.use(Axios)

app.mount('#app')
