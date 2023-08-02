import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@/assets/styles/main.css'
import 'highlight.js/lib/common'
import 'highlight.js/styles/github.css'
import hljsVuePlugin from '@highlightjs/vue-plugin'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(hljsVuePlugin)

app.mount('#app')
