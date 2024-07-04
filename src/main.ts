import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from './store/index'
import Antd from 'ant-design-vue'

const app = createApp(App);

async function setupApp() {
  await setupRouter(app);

  setupStore(app)
  app.use(Antd)
 
  app.mount('#app');
}


setupApp();
