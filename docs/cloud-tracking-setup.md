# 云端试用记录配置

当前实现使用 GitHub Pages 托管 Vue 前端，使用 Supabase 提供匿名身份、数据库和管理员登录。
未配置 Supabase 时，应用仍按原方式运行，只保存浏览器本地记录。

## 1. 创建 Supabase 项目

1. 在 Supabase 创建项目。
2. 在 Authentication 的 Providers 设置中启用 Anonymous Sign-Ins。
3. 在 SQL Editor 运行：
   `supabase/migrations/202606110001_anonymous_training_tracking.sql`

## 2. 创建管理员

1. 在 Authentication 的 Users 页面创建一个邮箱密码用户。
2. 复制该用户的 UUID。
3. 在 SQL Editor 执行：

```sql
insert into public.admin_users (user_id)
values ('管理员用户 UUID');
```

管理员入口：

```text
https://zouyu8377-coder.github.io/cognitive-training-assistant/#/admin
```

只有 `admin_users` 表中的账号可以读取全部患者、练习记录和活动日志。

## 3. 本地环境变量

复制 `.env.example` 为 `.env.local`，填写 Supabase 项目的 URL 和 Publishable Key：

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

不要在前端、GitHub Variables 或代码仓库中放入 Secret Key 或 Service Role Key。

## 4. GitHub Pages 环境变量

在 GitHub 仓库中打开：

```text
Settings -> Secrets and variables -> Actions -> Variables
```

新增两个 Repository variables：

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

推送到 `main` 后，现有 GitHub Actions 会自动构建和发布。

## 5. 当前数据行为

- 用户在练习设置中明确允许上传后，Supabase Auth 才会创建匿名用户。
- 当前设备默认建立一个患者档案，昵称变化时更新同一档案。
- 开始练习时上传进行中的训练记录。
- 完成练习或保存家属备注时更新云端记录。
- 打开应用、保存设置、开始和完成练习会写入活动日志。
- 网络失败时数据进入本地同步队列，恢复联网后自动重试。
- 浏览器数据被清除或换设备后，会创建新的匿名患者档案。

## 6. 未来账号体系

训练记录始终关联 `patient_id`，不会依赖昵称。未来可增加 `families` 和
`family_members` 表，并将患者授权给一个或多个家属账号。匿名患者完成认领后只需更新
归属关系，已有 `training_sessions` 和 `activity_events` 无需迁移结构。
