<template>
  <PageContainer>
    <section class="hero stack">
      <p class="kicker">公益家庭辅助工具</p>
      <h1>居家认知训练助手</h1>
      <p class="lead">帮助家属准备简单练习，记录每日完成情况。</p>
      <div class="notice">
        本工具仅用于家庭日常认知活动辅助和训练记录，不提供医学诊断、疾病分期、治疗建议、用药建议或紧急救助服务。训练内容不能替代医生或专业人员评估。若患者出现明显异常、症状加重或紧急情况，请及时联系医疗机构。
      </div>
      <RouterLink to="/setup"><AppButton block>开始设置训练</AppButton></RouterLink>
      <RouterLink to="/history"><AppButton tone="secondary" block>查看历史记录</AppButton></RouterLink>
    </section>
  </PageContainer>
</template>

<script setup lang="ts">
import AppButton from '../components/AppButton.vue';
import PageContainer from '../components/PageContainer.vue';
</script>

<style scoped>
.hero {
  padding-top: 18px;
}

.kicker {
  margin: 0;
  color: #58746c;
  font-weight: 800;
}

h1 {
  margin: 0;
  font-size: 2.2rem;
  line-height: 1.18;
}

.lead {
  margin: 0;
  font-size: 1.15rem;
  color: #52615d;
}
</style>
