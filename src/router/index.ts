import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import SetupPage from '../pages/SetupPage.vue';
import TodayTrainingPage from '../pages/TodayTrainingPage.vue';
import MathTrainingPage from '../pages/MathTrainingPage.vue';
import NumberConnectPage from '../pages/NumberConnectPage.vue';
import WritingTaskPage from '../pages/WritingTaskPage.vue';
import SingingTaskPage from '../pages/SingingTaskPage.vue';
import CompletePage from '../pages/CompletePage.vue';
import ResultPage from '../pages/ResultPage.vue';
import HistoryPage from '../pages/HistoryPage.vue';
import WeeklySummaryPage from '../pages/WeeklySummaryPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/setup', component: SetupPage },
    { path: '/today', component: TodayTrainingPage },
    { path: '/math', component: MathTrainingPage },
    { path: '/number-connect', component: NumberConnectPage },
    { path: '/writing', component: WritingTaskPage },
    { path: '/singing', component: SingingTaskPage },
    { path: '/complete', component: CompletePage },
    { path: '/result/:id?', component: ResultPage },
    { path: '/history', component: HistoryPage },
    { path: '/weekly-summary', component: WeeklySummaryPage },
  ],
});

export default router;
