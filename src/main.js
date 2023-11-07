import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//Importación de la librería de Semantic UI
import "semantic-ui-css/semantic.min.css"

createApp(App).use(store).use(router).mount('#app')
