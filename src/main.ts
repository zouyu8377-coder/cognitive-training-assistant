import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './styles/global.css';
import { flushSyncQueue, trackActivity, watchConnectivity } from './services/cloudTracking';
import { loadSettings } from './utils/storage';

createApp(App).use(router).mount('#app');

watchConnectivity();
void flushSyncQueue();
void trackActivity('app_opened', loadSettings().patientNickname);
