<template>
  <PageContainer>
    <section class="complete stack">
      <div class="flower">小红花</div>
      <h1>今天的练习完成啦，辛苦了！</h1>
      <p>今日训练已完成，可以休息一下。</p>
      <RouterLink to="/"><AppButton tone="secondary" block>返回首页</AppButton></RouterLink>
      <RouterLink to="/result"><AppButton block>查看结果</AppButton></RouterLink>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
import { useTrainingStore } from '../stores/trainingStore';

const store = useTrainingStore();

onMounted(() => {
  store.finishSession();
});
</script>

<style scoped>
.complete {
  min-height: 82vh;
  align-content: center;
  text-align: center;
}

.flower {
  width: 112px;
  height: 112px;
  display: grid;
  place-items: center;
  margin: 0 auto;
  border-radius: 50%;
  background: #f0d991;
  color: #4c4220;
  font-weight: 900;
}

h1 {
  margin: 0;
  font-size: 2rem;
}
</style>
