import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from './store/index'
import Antd from 'ant-design-vue'

const app = createApp(App);

async function setupApp() {
  setupStore(app)

  app.use(Antd)
  await setupRouter(app);
  app.mount('#app');
}


setupApp();
