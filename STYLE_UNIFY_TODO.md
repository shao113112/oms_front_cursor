# 全站样式与布局统一 - 待办清单

基于当前各页面的颜色、卡片、宽度、间距、按钮等使用情况整理，按优先级排序。

**已执行（最近一次）：** 颜色（Auth/主色/顶栏/Logo/必填/状态）、页面宽度与背景、白卡片（shadow-sm + border-gray-200 + p-6/p-4）、标题与 label（font-medium text-gray-700 mb-1）、间距（mb-6、gap-6）、返回链接（text-gray-600 hover:text-gray-900）、表格容器 shadow-sm、提货/收件空状态与收件信息空状态。

---

## 一、颜色统一

| 序号 | 项 | 现状 | 目标 |
|------|----|------|------|
| 1.1 | 主色 | 多数用 `primary` / `text-primary`，Auth 用 `bg-[#2563EB]` | 登录页背景、主按钮等全部改用 `bg-primary` / `text-primary`，去掉硬编码 `#2563EB` |
| 1.2 | 顶栏激活态 | `bg-blue-500/30 text-blue-200` | 保持或改为基于 `primary` 的浅色（如 `bg-primary/20 text-primary-light`），与主色一致 |
| 1.3 | Logo 图标 | `text-blue-400` | 改为 `text-primary-light` 或保留 blue-400，二选一统一 |
| 1.4 | 必填星号 | 多为 `text-red-500`，偶有 `text-red-400` | 统一为 `text-red-500` |
| 1.5 | 链接/强调 | 有 `text-primary`、`text-gray-800` 混用 | 可点击、强调用 `text-primary`，纯正文用 gray |
| 1.6 | 状态色 | 启用 green-600、禁用 red-600 / gray-500 混用 | 统一：启用 `text-green-600`，禁用 `text-gray-500`，错误/危险用 red |
| 1.7 | 物流产品价格 | `text-orange-600` | 可保留（价格强调），或统一为 `text-primary` |

---

## 二、页面背景与内容区宽度

| 序号 | 项 | 现状 | 目标 |
|------|----|------|------|
| 2.1 | 主内容区背景 | 主布局下为白底，新建专线订单单独 `bg-gray-100` | 约定：列表/详情/设置类页面白底；多步骤创建类可保留浅灰 `bg-gray-100`，并在文档说明 |
| 2.2 | 页面根容器宽度 | `max-w-full` / `w-full` / `max-w-6xl` / `max-w-3xl` 混用 | 统一规则：列表/表格/详情页 `w-full min-w-0`；仪表盘 `max-w-6xl mx-auto`；窄表单（整柜预约）`max-w-3xl` |
| 2.3 | 深色页（提货/收件） | `bg-content-dark -mx-4 -my-6 ...` 负边距撑满 | 保持，确保与主布局 padding 一致（p-4 md:p-6） |

---

## 三、卡片样式统一

| 序号 | 项 | 现状 | 目标 |
|------|----|------|------|
| 3.1 | 白卡片 | 有 `rounded-xl` + `border border-gray-200`，有无 `shadow-sm` / `shadow card` / `border-gray-100` 不一 | 统一：`bg-white rounded-xl border border-gray-200 shadow-sm`（或使用 tailwind 的 `shadow-card`）；删除混用的 `border-gray-100` |
| 3.2 | 卡片内边距 | `p-4` / `p-5` / `p-6` 混用 | 统一：表格/筛选区 `p-4`，表单/内容块 `p-6`；区块标题下 `mb-4` 或 `mb-6` 二选一 |
| 3.3 | 深色区卡片 | 提货/收件用 `bg-gray-800/50 rounded-xl border border-gray-700` | 保持，与 main.css 深色表格一致 |

---

## 四、标题与字体层级

| 序号 | 项 | 现状 | 目标 |
|------|----|------|------|
| 4.1 | 页面主标题 | 多为 `text-xl font-bold text-gray-800`，仪表盘欢迎 `text-2xl` | 统一：页面主标题 `text-xl font-bold text-gray-800`；仅仪表盘首屏大标题用 `text-2xl` |
| 4.2 | 副标题/描述 | `text-sm text-gray-500` 或 `text-gray-400` | 统一：`text-sm text-gray-500` |
| 4.3 | 区块标题 | `text-lg font-bold` 与 `text-base font-semibold` 混用 | 统一：卡片内区块标题 `text-base font-semibold text-gray-800` |
| 4.4 | 表单 label | `text-sm font-medium text-gray-700` 与 `text-sm text-gray-600` 混用 | 统一：`text-sm font-medium text-gray-700`，与 label 间距 `mb-1` |
| 4.5 | 辅助说明 | `text-xs text-gray-500` | 保持 |

---

## 五、间距与布局

| 序号 | 项 | 现状 | 目标 |
|------|----|------|------|
| 5.1 | 页面标题与内容间距 | `mb-6` / `mt-8` / `mt-4` / `mt-6` 不一 | 统一：标题区块下 `mb-6`；列表页“标题+按钮”与表格之间 `mb-6` |
| 5.2 | 卡片之间 | `gap-4` / `gap-6` / `space-y-6` 混用 | 列表内卡片/区块间距统一用 `gap-6` 或 `space-y-6` |
| 5.3 | 表单项之间 | `gap-4` / `gap-8` / `space-y-4` 等 | 表单内统一：单列 `space-y-4`，多列 grid 用 `gap-4` 或 `gap-6` |
| 5.4 | 标题行布局 | 左标题 + 右按钮，flex 换行与对齐不一 | 统一：`flex flex-wrap items-center justify-between gap-4 mb-6` |

---

## 六、按钮与操作区

| 序号 | 项 | 现状 | 目标 |
|------|----|------|------|
| 6.1 | 主操作按钮 | 有 `el-button type="primary"`，有自定义 `rounded-lg bg-primary ...` | 统一：全部使用 `el-button type="primary"`，或统一自定义类（如 `.btn-primary`） |
| 6.2 | 主按钮圆角 | 自定义为 `rounded-lg`，Element 默认 | 若保留自定义，与 tailwind `button: 8px` 一致；列表页“新建”等与截图一致即可 |
| 6.3 | 返回链接 | 专线详情 `bg-amber-100`，专线新建 `text-gray-600` | 统一：`text-gray-600 hover:text-gray-900` 或与设计稿一致，避免单独黄色块 |

---

## 七、表格与列表容器

| 序号 | 项 | 现状 | 目标 |
|------|----|------|------|
| 7.1 | 表格外容器 | 白底页：`bg-white rounded-xl border border-gray-200 overflow-hidden` | 保持，与卡片规范一致（可加 `shadow-sm`） |
| 7.2 | 分页栏 | 专线订单已统一为整行、每页条数选择器 | 其他列表若有分页，风格与专线订单一致 |
| 7.3 | 空状态 | 提货地址有“暂无…”文案 | 其他列表空状态样式与文案风格统一 |

---

## 八、弹窗与表单

| 序号 | 项 | 现状 | 目标 |
|------|----|------|------|
| 8.1 | 弹窗宽度 | 多为 `500px` | 保持 500px，复杂表单可 560px |
| 8.2 | 表单 label 宽度 | `label-width="100px"` | 统一 100px |
| 8.3 | 弹窗内说明文案 | `text-gray-500 text-sm mb-4` | 保持 |

---

## 九、执行顺序建议

1. **先做设计 token 与全局**：确认 `tailwind.config.js`、`main.css` 中 primary/header/card 等与设计一致；顶栏激活色、Logo 色定稿。
2. **颜色**：按 1.1～1.6 全站替换硬编码色与不一致状态色。
3. **卡片**：统一白卡片类名（3.1、3.2），再逐页替换。
4. **标题与字体**：统一页面标题、区块标题、label（4.1～4.4）。
5. **间距**：统一标题区、卡片间、表单项间距（5.1～5.4）。
6. **按钮与返回**：统一主按钮与返回链接样式（6.1～6.3）。
7. **宽度与背景**：按 2.1～2.3 收尾页面宽度和背景。
8. **表格/弹窗**：按七、八做最后检查。

---

## 十、可选：抽成公共类（后续优化）

- `.page-title`：页面主标题
- `.page-subtitle`：副标题
- `.card` / `.card--form`：白卡片（含 padding 变体）
- `.section-title`：区块标题
- `.form-label`：表单 label

当前可先按上述待办逐项在页面内改 class，稳定后再抽成组件或 @apply 类。
