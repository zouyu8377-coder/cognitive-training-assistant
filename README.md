# 居家认知训练助手

一个公益性质的小型 Web MVP，用于帮助已经接受医生建议进行家庭认知训练的家庭，降低每日准备题目、记录训练和事后查看的负担。

## 非医疗声明

本工具仅用于家庭日常认知活动辅助和训练记录，不提供医学诊断、疾病分期、治疗建议、用药建议或紧急救助服务。训练内容不能替代医生或专业人员评估。若患者出现明显异常、症状加重或紧急情况，请及时联系医疗机构。

## 本地启动

```bash
npm install
npm run dev
```

## 公开部署

本项目已配置 GitHub Pages 自动部署。推送到公开 GitHub 仓库的 `main` 分支后，可在仓库 Settings → Pages 中选择 GitHub Actions 作为发布来源。

默认访问路径适配仓库名：

```text
https://<github-user>.github.io/cognitive-training-assistant/
```

## 当前 MVP 功能

- 照护者设置训练难度和任务开关。
- 开始训练前记录今日状态，用于提示是否采用短练习。
- 自动生成今日数学练习和数字顺序练习。
- 自动生成看图说名称、照着画图形、找不同等轻量图形训练。
- 触屏手写和手绘任务不做 OCR 识别，直接保存输入痕迹供家属查看。
- 患者按页完成数学题、数字点击、写名字和跟唱记录。
- 写名字页提供可选触屏书写区，仅用于当场辅助，不保存、不识别、不评分。
- 家属查看本次训练结果、逐题作答记录、下次设置建议，补充备注和状态。
- 使用 localStorage 保存历史记录。
- 训练过程中自动保存未完成草稿，误关页面后可继续。
- 同一天已有记录时，在开始新训练前提示家属。
- 家属端通过日期选择查看当天训练结果。

## 不做的功能

不做医学诊断、疾病筛查、疾病分期、治疗建议、药物建议、医生端、商业化支付、音乐版权内容、跟唱评分、拍照识别或医学量表测试。

## 后续路线

后续可能扩展内容记录在 `docs/future-roadmap.md`。所有扩展都应保持非医疗辅助工具边界。

## 目录结构

- `src/pages`：页面级训练流程。
- `src/components`：大按钮、容器、结果卡片等通用组件。
- `src/stores/trainingStore.ts`：当前训练状态和保存逻辑。
- `src/utils/mathGenerator.ts`：数学题生成。
- `src/utils/storage.ts`：localStorage 读写。
- `docs/product-scope.md`：当前产品范围。
- `docs/future-roadmap.md`：后续路线图。

## 云端试用记录

匿名试用用户、活动日志、管理员查看和 GitHub Pages 环境变量的配置步骤见
[`docs/cloud-tracking-setup.md`](docs/cloud-tracking-setup.md)。
