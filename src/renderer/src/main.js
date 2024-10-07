import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import { createPinia } from 'pinia';
import { ComponentLibrary } from '@infineon/infineon-design-system-vue';

const app = createApp(App)
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.use(ComponentLibrary);
app.mount('#app');
