import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import SetupPage from '../pages/SetupPage.vue';
import TodayTrainingPage from '../pages/TodayTrainingPage.vue';
import MathTrainingPage from '../pages/MathTrainingPage.vue';
import NumberConnectPage from '../pages/NumberConnectPage.vue';
import ObjectNamingPage from '../pages/ObjectNamingPage.vue';
import ShapeCopyPage from '../pages/ShapeCopyPage.vue';
import OddOneOutPage from '../pages/OddOneOutPage.vue';
import WritingTaskPage from '../pages/WritingTaskPage.vue';
import SingingTaskPage from '../pages/SingingTaskPage.vue';
import CompletePage from '../pages/CompletePage.vue';
import ResultPage from '../pages/ResultPage.vue';
import HistoryPage from '../pages/HistoryPage.vue';
import AdminLoginPage from '../pages/AdminLoginPage.vue';
import AdminDashboardPage from '../pages/AdminDashboardPage.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/setup', component: SetupPage },
    { path: '/today', component: TodayTrainingPage },
    { path: '/math', component: MathTrainingPage },
    { path: '/number-connect', component: NumberConnectPage },
    { path: '/object-naming', component: ObjectNamingPage },
    { path: '/shape-copy', component: ShapeCopyPage },
    { path: '/odd-one-out', component: OddOneOutPage },
    { path: '/writing', component: WritingTaskPage },
    { path: '/singing', component: SingingTaskPage },
    { path: '/complete', component: CompletePage },
    { path: '/result/:id?', component: ResultPage },
    { path: '/history', component: HistoryPage },
    { path: '/admin/login', component: AdminLoginPage },
    { path: '/admin', component: AdminDashboardPage },
  ],
});

export default router;
