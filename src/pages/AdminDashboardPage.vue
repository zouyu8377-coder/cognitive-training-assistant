<template>
  <main class="admin-page">
    <header class="admin-header">
      <div>
        <p>试用活动记录</p>
        <h1>用户使用概览</h1>
      </div>
      <div class="header-actions">
        <button type="button" title="刷新" aria-label="刷新" @click="refresh">↻</button>
        <button type="button" title="退出登录" aria-label="退出登录" @click="logout">退出</button>
      </div>
    </header>

    <p v-if="loading" class="state">正在加载活动记录...</p>
    <p v-else-if="errorMessage" class="state error">{{ errorMessage }}</p>

    <template v-else>
      <section class="summary" aria-label="使用概览">
        <div>
          <span>试用用户</span>
          <strong>{{ patients.length }}</strong>
        </div>
        <div>
          <span>完成练习</span>
          <strong>{{ completedSessions.length }}</strong>
        </div>
        <div>
          <span>近 7 天活跃</span>
          <strong>{{ activePatientCount }}</strong>
        </div>
        <div>
          <span>完成率</span>
          <strong>{{ completionRate }}%</strong>
        </div>
      </section>

      <section class="toolbar">
        <label>
          用户
          <select v-model="selectedPatientId">
            <option value="">全部用户</option>
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.nickname }}
            </option>
          </select>
        </label>
        <label>
          日期
          <input v-model="selectedDate" type="date" />
        </label>
      </section>

      <section class="table-section">
        <div class="section-heading">
          <h2>练习记录</h2>
          <span>云端仅保留最近 100 条</span>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>患者昵称</th>
                <th>日期</th>
                <th>状态</th>
                <th>数学正确</th>
                <th>开始时间</th>
                <th>完成时间</th>
                <th>详情</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="session in filteredSessions" :key="session.id">
                <td>{{ patientName(session.patient_id) }}</td>
                <td>{{ session.session_date }}</td>
                <td>{{ session.status === 'completed' ? '已完成' : '进行中' }}</td>
                <td>{{ mathCorrect(session) }} / {{ session.result_data.mathQuestions.length }}</td>
                <td>{{ dateTime(session.started_at) }}</td>
                <td>{{ session.completed_at ? dateTime(session.completed_at) : '未完成' }}</td>
                <td>
                  <RouterLink class="detail-link" :to="`/admin/session/${encodeURIComponent(session.id)}`">
                    查看详情
                  </RouterLink>
                </td>
              </tr>
              <tr v-if="filteredSessions.length === 0">
                <td colspan="7" class="empty">暂无符合条件的练习记录</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="table-section">
        <h2>最近活动</h2>
        <div class="activity-list">
          <div v-for="event in filteredEvents.slice(0, 50)" :key="event.id" class="activity-row">
            <strong>{{ patientName(event.patient_id) }}</strong>
            <span>{{ eventName(event.event_type) }}</span>
            <time>{{ dateTime(event.occurred_at) }}</time>
          </div>
          <p v-if="filteredEvents.length === 0" class="empty">暂无符合条件的活动</p>
        </div>
      </section>
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type {
  AdminActivityEvent,
  AdminPatient,
  AdminTrainingSession,
} from '../services/cloudTracking';
import {
  getCurrentSession,
  isCurrentUserAdmin,
  loadAdminDashboard,
  signOutAdmin,
} from '../services/cloudTracking';

const router = useRouter();
const patients = ref<AdminPatient[]>([]);
const sessions = ref<AdminTrainingSession[]>([]);
const events = ref<AdminActivityEvent[]>([]);
const selectedPatientId = ref('');
const selectedDate = ref('');
const loading = ref(true);
const errorMessage = ref('');

const completedSessions = computed(() => sessions.value.filter((session) => session.status === 'completed'));
const activePatientCount = computed(() => {
  const threshold = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return patients.value.filter((patient) => new Date(patient.last_active_at).getTime() >= threshold).length;
});
const completionRate = computed(() =>
  sessions.value.length ? Math.round((completedSessions.value.length / sessions.value.length) * 100) : 0,
);
const filteredSessions = computed(() =>
  sessions.value.filter(
    (session) =>
      (!selectedPatientId.value || session.patient_id === selectedPatientId.value) &&
      (!selectedDate.value || session.session_date === selectedDate.value),
  ),
);
const filteredEvents = computed(() =>
  events.value.filter(
    (event) =>
      (!selectedPatientId.value || event.patient_id === selectedPatientId.value) &&
      (!selectedDate.value || event.occurred_at.slice(0, 10) === selectedDate.value),
  ),
);

onMounted(refresh);

async function refresh() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const authSession = await getCurrentSession();
    if (!authSession || !(await isCurrentUserAdmin())) {
      await router.replace('/admin/login');
      return;
    }
    const data = await loadAdminDashboard();
    patients.value = data.patients;
    sessions.value = data.sessions;
    events.value = data.events;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '加载失败';
  } finally {
    loading.value = false;
  }
}

async function logout() {
  await signOutAdmin();
  await router.replace('/admin/login');
}

function patientName(patientId: string) {
  return patients.value.find((patient) => patient.id === patientId)?.nickname ?? '未知用户';
}

function mathCorrect(session: AdminTrainingSession) {
  return session.result_data.mathQuestions.filter((question) => question.isCorrect).length;
}

function dateTime(value: string) {
  return new Date(value).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function eventName(type: string) {
  const names: Record<string, string> = {
    app_opened: '打开应用',
    settings_saved: '保存练习设置',
    training_started: '开始练习',
    training_completed: '完成练习',
    caregiver_note_saved: '保存家属记录',
  };
  return names[type] ?? type;
}
</script>

<style scoped>
.admin-page {
  width: min(100%, 1180px);
  min-height: 100vh;
  margin: 0 auto;
  padding: 24px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.admin-header p,
.admin-header h1 {
  margin: 0;
}

.admin-header p {
  color: #64706c;
  font-size: 0.9rem;
}

.admin-header h1 {
  margin-top: 4px;
  font-size: 1.7rem;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-actions button {
  min-width: 44px;
  min-height: 40px;
  border: 1px solid #c8d5cc;
  border-radius: 8px;
  background: #ffffff;
  color: #36504a;
  cursor: pointer;
}

.summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid #d8e1db;
  border-bottom: 1px solid #d8e1db;
  background: #ffffff;
}

.summary div {
  display: grid;
  gap: 6px;
  padding: 18px;
  border-right: 1px solid #d8e1db;
}

.summary div:last-child {
  border-right: 0;
}

.summary span {
  color: #64706c;
  font-size: 0.88rem;
}

.summary strong {
  font-size: 1.6rem;
}

.toolbar {
  display: flex;
  gap: 16px;
  padding: 18px 0;
}

.toolbar label {
  display: grid;
  gap: 6px;
  min-width: 190px;
  font-size: 0.86rem;
  font-weight: 700;
}

.toolbar select,
.toolbar input {
  min-height: 42px;
  border: 1px solid #c9d6cf;
  border-radius: 6px;
  padding: 7px 10px;
  background: #ffffff;
}

.table-section {
  margin-top: 22px;
}

.table-section h2 {
  margin: 0 0 10px;
  font-size: 1.12rem;
}

.section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.section-heading span {
  color: #64706c;
  font-size: 0.82rem;
}

.detail-link {
  color: #206a56;
  font-weight: 700;
  white-space: nowrap;
}

.table-scroll {
  overflow-x: auto;
  border: 1px solid #d8e1db;
}

table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  background: #ffffff;
  font-size: 0.88rem;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #e2e8e4;
  text-align: left;
}

th {
  color: #52615d;
  background: #f3f6f3;
}

.activity-list {
  border-top: 1px solid #d8e1db;
}

.activity-row {
  display: grid;
  grid-template-columns: minmax(120px, 1fr) minmax(160px, 2fr) 180px;
  gap: 16px;
  padding: 12px 4px;
  border-bottom: 1px solid #d8e1db;
  font-size: 0.9rem;
}

.activity-row time {
  color: #64706c;
  text-align: right;
}

.state,
.empty {
  padding: 24px;
  color: #64706c;
  text-align: center;
}

.error {
  color: #9b2c2c;
}

@media (max-width: 720px) {
  .admin-page {
    padding: 16px;
  }

  .summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .summary div:nth-child(2) {
    border-right: 0;
  }

  .summary div:nth-child(-n + 2) {
    border-bottom: 1px solid #d8e1db;
  }

  .toolbar {
    display: grid;
  }

  .toolbar label {
    min-width: 0;
  }

  .activity-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .activity-row time {
    text-align: left;
  }
}
</style>
