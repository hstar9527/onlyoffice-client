import { createApp } from 'vue';
import App from './App.vue';
import './styles/index.scss';
import { setup as setupRouter } from '@/router'

const app = createApp(App);
setupRouter(app)
app.mount('#app');
