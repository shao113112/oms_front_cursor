# EpochV OMS 数据库脚本

根据前端页面与 Mock 逻辑生成的 MySQL 建表与初始数据脚本。

## 执行顺序

1. **01_schema.sql** — 建库无需单独建，直接建表。表结构包含：
   - 角色与用户（登录、用户管理、分配角色）
   - 集运仓、物流产品、定价规则
   - 提货地址、收件信息
   - 专线订单（订单 → 箱 → 商品 三层）、费用、物流轨迹
   - 整柜订单及申报信息

2. **02_seed.sql** — 初始数据（角色、用户、集运仓、物流产品、定价、收件信息、示例专线/整柜订单）。可重复执行，主要表已做 `ON DUPLICATE KEY UPDATE` 处理。

## 使用方式

```bash
# 创建数据库（可选，若库已存在可跳过）
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS oms_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 执行建表
mysql -u root -p oms_db < database-sql/01_schema.sql

# 执行初始数据
mysql -u root -p oms_db < database-sql/02_seed.sql
```

或在 MySQL 客户端中：

```sql
USE oms_db;
SOURCE /path/to/oms-front/database-sql/01_schema.sql;
SOURCE /path/to/oms-front/database-sql/02_seed.sql;
```

## 默认登录账号

| 邮箱 | 密码 | 说明 |
|------|------|------|
| opr@dotmatrix.com | operator | 与前端 Mock 一致，用于登录 |

`password_hash` 为 bcrypt 加密，后端校验时需使用 bcrypt 比对。

## 表与页面对应关系

| 页面/功能 | 主要表 |
|-----------|--------|
| 登录/注册、用户管理、分配角色 | `users`, `roles`, `user_roles` |
| 专线订单列表/新建/详情 | `line_orders`, `line_order_boxes`, `line_order_items`, `line_order_fees`, `line_order_tracks` |
| 整柜订单列表/预约/详情 | `container_orders`, `container_order_declarations` |
| 物流产品 | `logistics_products` |
| 定价规则 | `pricing_rules`（关联 `logistics_products`） |
| 提货地址 | `pickup_addresses` |
| 收件信息 | `shipping_addresses` |
| 专线订单-集运仓 | `warehouses` |

## 说明

- 字符集：`utf8mb4`，排序规则 `utf8mb4_unicode_ci`。
- 主键：除业务主键（如 `order_no`、`waybill_no`）外，表使用 `BIGINT AUTO_INCREMENT` 作为主键。
- 专线订单与整柜订单中部分字段冗余（如 `recipient_display`、`creator_name`）便于列表与详情展示，可按需在应用层维护。
