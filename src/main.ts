import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './styles/global.css';
import { flushSyncQueue, syncTrainingSession, trackActivity, watchConnectivity } from './services/cloudTracking';
import { loadSessions, loadSettings } from './utils/storage';

createApp(App).use(router).mount('#app');

watchConnectivity();

async function restoreCloudRecords() {
  await flushSyncQueue();
  for (const session of loadSessions().slice(0, 10).reverse()) {
    await syncTrainingSession(session);
  }
  await trackActivity('app_opened', loadSettings().patientNickname);
}

void restoreCloudRecords();
