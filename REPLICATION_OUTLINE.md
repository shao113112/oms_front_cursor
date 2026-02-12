# Apex Cargo Core 网站 1:1 复刻 — 大纲与待办

## 一、项目概述

- **目标站点**：https://apex-cargo-core.lovable.app（EpochV TMS）
- **技术栈**：Vue 3 + Composition API + JavaScript、Vite、Tailwind、Element Plus
- **数据**：静态/Mock，不接真实后端
- **复刻范围**：全部页面；视觉与交互尽量 1:1，含响应式

---

## 二、参考材料说明

### 2.1 HTML（target-website-html）

- 各路由保存的 HTML 均为 **SPA 壳**（只有 `#root` + 全局 head/style），**没有各页面的实际 DOM 结构**。
- 能从 HTML 中确认：标题 apex-cargo-core，描述 EpochV TMS；字体 `CameraPlainVariable`（CDN woff2）；viewport `width=device-width, initial-scale=1.0`。

### 2.2 截图（target-website-screenshot）— 主要视觉与布局依据

已根据截图确认以下信息，复刻时以截图为准：

- **品牌**：EpochV OMS，副标题「专业的物流订单管理平台」。
- **主布局**：**无侧栏**，为 **顶部水平导航 + 主内容区**。顶栏深色（深蓝/深灰 #2D364A 等），左侧 Logo，中间导航链接，右侧「operator」+「退出」。
- **导航项**（从截图推断）：仪表盘、专线订单、整柜订单、提货地址、收件信息、**系统设置**（带下拉箭头，可能包含物流产品、定价规则、用户等子项）。当前页在顶栏高亮（亮蓝 + 下划线）。
- **主内容区背景**：部分页面为**白色**（仪表盘、整柜订单列表、专线订单详情），部分为**深灰**（新建专线订单步骤、提货地址管理、收件信息管理）。复刻时需按页面区分。

**截图与页面对应关系（截图索引）：**

| 截图文件 | 对应页面/说明 |
|----------|----------------|
| login.png | 登录页：蓝底、白卡片、登录/注册切换、邮箱/密码、登录按钮 |
| 注册.png | 注册页：同登录布局，注册 Tab、姓名/公司名称/邮箱/密码、注册按钮 |
| dashboard.png | 仪表盘：欢迎文案、4 个统计卡片、2 个功能卡片（专线订单管理、整柜订单管理） |
| containerOrders.png | 整柜订单列表：标题、搜索框、整柜预约按钮、订单表格 |
| containerOrdercreate.png | 整柜预约/创建页 |
| containerOrderdetail.png | 整柜订单详情 |
| lineOrders-create1.png | 新建专线订单 步骤 1：基本信息表单 +「选择物流产品」弹窗 |
| lineOrders-create1.1.png | 新建专线订单（步骤 1 另一状态） |
| lineOrders-create2.png | 新建专线订单 步骤 2 |
| lineOrders-create3.png | 新建专线订单 步骤 3 |
| lineOrders-scroll-left.png | 专线订单列表（向左滚动相关） |
| lineOrders-scroll-right.png | 专线订单列表（向右滚动相关） |
| lineOrdersdetail-basic.png | 专线订单详情 - 基本信息 Tab（订单信息、箱体、箱内商品表） |
| lineOrdersdetail-fee.png | 专线订单详情 - 订单费用 Tab |
| logisticsProducts.png | 物流产品页 |
| 提货地址.png | 提货地址管理：空状态 +「新增提货地址」弹窗 |
| receiveAddress.png | 收件信息管理：列表 +「新增收件信息」弹窗 |
| price-rules.png | 定价规则列表 |
| price-rules-create.png | 定价规则创建/编辑 |
| users.png | 用户管理 |

---

## 三、页面与路由清单（结合 HTML 与截图）

| 序号 | 路由（建议） | 对应 HTML 文件 | 页面说明 |
|------|--------------|----------------|----------|
| 1 | `/auth` | auth.html | 登录页（登录/注册切换，独立布局） |
| 2 | `/auth?tab=register` 或单独 `/register` | — | 注册页（与登录同布局，见 注册.png） |
| 3 | `/` 或 `/dashboard` | dashboard.html | 仪表盘（白底，4 统计卡 + 2 功能卡） |
| 4 | `/container-orders` | container-orders.html | 整柜订单列表（白底，表格） |
| 5 | `/container-orders/create` | container-orders_create.html | 整柜预约/创建 |
| 6 | `/container-orders/:id` | — | 整柜订单详情（见 containerOrderdetail.png） |
| 7 | `/line-orders` | line-orders.html | 专线订单列表 |
| 8 | `/line-orders/create` | line-orders_create.html | 新建专线订单（步骤 1/2/3，深色内容区） |
| 9 | `/line-orders/:id` | line-orders-detail.html | 专线订单详情（Tab：基本信息/订单费用/物流轨迹，白底） |
| 10 | `/logistics-products` | logistics-products.html | 物流产品（可能在系统设置下拉下） |
| 11 | `/pickup-addresses` | pickup-addresses.html | 提货地址管理（深色内容区，弹窗增改） |
| 12 | `/shipping-addresses` | shipping-addresses.html | 收件信息管理（深色内容区，弹窗增改） |
| 13 | `/pricing-rules` | pricing-rules.html | 定价规则（列表 + 创建/编辑） |
| 14 | `/users` | users.html | 用户管理 |

**布局结论（按截图）：**

- **Auth 布局**：登录/注册页，无顶栏，蓝底 + 居中白卡片。
- **主布局**：**顶栏水平导航 + 主内容区**（无侧栏）。顶栏固定深色；主内容区背景按页面区分为**白色**或**深灰**。

**专线订单业务逻辑（数据层级）：**

- 专线订单为 **订单 → 箱 → 商品** 三层结构：
  - **订单**（Order）：一张专线订单，含物流产品、集运仓、收件信息、重量/体积汇总等。
  - **箱**（Box）：订单下的箱体，每个箱有箱型、长宽高、重量、计费重/体积等；一单可有多箱。
  - **商品**（Item）：每个箱内的商品明细，如商品名称、编码、数量、申报价、单品重量等；一箱可有多条商品。
- Mock 数据、新建专线订单（步骤 2/3）及详情页「基本信息」中的箱体与箱内商品表，均按此三层关系组织。

---

## 四、复刻大纲（按模块）

### 1. 工程与基础

- 使用 Vite 创建 Vue 3（Composition API + JavaScript）项目。
- 集成 Tailwind CSS、Element Plus。
- 配置 Vue Router，预留上表所有路由。
- 引入字体：CameraPlainVariable（或 fallback），与目标站一致。
- 定义全局设计 token（颜色、圆角、阴影、间距等），尽量从目标站提取或后续对照调整。

### 2. 布局与通用组件

- **Auth 布局**：蓝底 + 居中白卡片，登录/注册 Tab 切换，无顶栏。
- **主布局**：**顶栏水平导航 + 主内容区**（无侧栏）。顶栏深色，左侧 Logo，中间导航（含「系统设置」下拉），右侧用户与退出；主内容区按页面使用白底或深灰底。
- **顶栏**：导航高亮（亮蓝 + 下划线）、系统设置下拉、用户与退出；移动端可为汉堡菜单等，断点按截图/常见 768 或 1024 处理。

### 3. 页面与路由

按上表逐页实现：

- 登录/注册页：同一卡片内 Tab 切换，表单与校验（Mock），登录/注册成功后跳转仪表盘。
- 仪表盘：欢迎文案、4 个统计卡片、2 个功能卡片（用 Mock 数据）。
- 柜子订单：列表（表格/卡片）、筛选、分页、操作按钮；创建页为表单。
- 专线订单：**订单 → 箱 → 商品** 三层数据；列表、新建（步骤 1/2/3，步骤 2/3 维护箱与商品）、详情（订单信息 + 按箱展示箱体与箱内商品表）。
- 物流产品、提货地址、收货地址、定价规则、用户管理：列表 + 增删改查（弹窗/抽屉/表单页按原站），均用 Mock。

### 4. 样式与交互

- 颜色、字体、间距、圆角、阴影按原站（Tailwind + 必要时自定义 CSS）。
- 按钮、输入框、表格、弹窗、Tab、筛选器等与目标站一致；若有轮播、步骤条等一并还原。
- 响应式：桌面/平板/手机断点与目标站一致。

### 5. 图标与资源

- 若目标站有图标库或 SVG，尽量复用或自建同风格图标（可统一放在 `src/assets/icons` 或组件内）。

### 6. 数据与权限

- 所有接口用 Mock（可集中放在 `src/mock` 或 `src/api` 的 mock 实现）。
- 登录态用前端存储（如 localStorage + 路由守卫），不接真实后端；不明确的功能不脑补。

---

## 五、待办列表（Todo）

### 阶段一：工程与基础

- [ ] 使用 Vite 创建 Vue 3 项目（Composition API + JavaScript）
- [ ] 集成 Tailwind CSS 并做基础配置
- [ ] 集成 Element Plus 并按需或全局引入
- [ ] 配置 Vue Router，添加上述 12 个路由（占位组件即可）
- [ ] 引入 CameraPlainVariable 字体（及 fallback）
- [ ] 对照目标站整理设计 token（颜色、间距、圆角、阴影等）并写入 Tailwind/全局样式

### 阶段二：布局与壳子

- [x] 实现 Auth 布局（蓝底 + 白卡片，登录/注册 Tab）
- [x] 实现主布局（顶栏水平导航 + 主内容区，无侧栏）
- [x] 实现顶栏（Logo、导航项、系统设置下拉、用户与退出；当前页高亮）
- [ ] 主内容区支持白底/深灰底两种主题（按页面切换）
- [ ] 响应式断点（移动端顶栏折叠为汉堡菜单等）

### 阶段三：登录与首页

- [x] 登录页：表单、校验、Mock 登录、跳转
- [x] 注册页：Tab 切换、表单（姓名/公司/邮箱/密码）、Mock 注册
- [x] 仪表盘页：欢迎文案、4 统计卡、2 功能卡（Mock 数据）

### 阶段四：订单相关

- [x] 整柜订单列表页（标题、搜索、整柜预约按钮、表格）
- [x] 整柜订单创建页（表单 + Mock 提交）
- [x] 整柜订单详情页（见 containerOrderdetail.png）
- [x] 专线订单列表页（见 lineOrders-scroll 截图）
- [x] 新建专线订单页（步骤 1/2/3、深色内容区、物流产品弹窗等）
- [x] 专线订单详情页（Tab：基本信息/订单费用/物流轨迹）

### 阶段五：基础数据与配置

- [x] 物流产品页（列表 + 增删改查 Mock）
- [x] 提货地址页（列表 + 增删改查 Mock，深色内容区）
- [x] 收件信息页（列表 + 增删改查 Mock，深色内容区）
- [x] 定价规则页（通用报价管理，列表 + 添加/编辑 Mock）
- [x] 用户管理页（用户权限管理，搜索 + 分配角色 + 列表 Mock）

### 阶段六：细节与收尾

- [x] 主内容区深色主题（提货地址/收件信息/新建专线订单）
- [x] 响应式：移动端顶栏折叠为汉堡菜单 + 抽屉导航
- [x] 深色区域内表格样式覆盖（main.css）
- [ ] 全站 1:1 微调（可按需继续对照截图细化）

---

## 六、需要你确认或补充的信息（可选）

1. **系统设置下拉**：子项是否包含「物流产品、定价规则、用户管理」等？顺序与文案以截图/实际为准。
2. **断点**：移动端顶栏折叠的具体断点（可先按 768px 或 1024px，后续对照截图再调）。
3. **注册页路由**：注册与登录同卡片内 Tab 即可，是否需独立路由（如 `/register`）由你定。

---

**截图已就绪**：`target-website-screenshot` 已作为主要视觉与布局依据写入大纲；开发时按该目录下截图逐页 1:1 还原即可。若你确认上述可选点（或按常见做法先做），即可从阶段一开始实现。
