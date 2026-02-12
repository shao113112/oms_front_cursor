-- ============================================================
-- EpochV OMS 数据库结构
-- 基于前端页面与 Mock 逻辑：用户/角色、物流产品、定价、地址、专线订单(订单-箱-商品)、整柜订单
-- MySQL 5.7+ / 8.0, utf8mb4
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------
-- 1. 角色与用户（登录、用户管理、分配角色）
-- -------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL COMMENT '角色名称',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(128) NOT NULL COMMENT '用户名',
  `email` varchar(255) NOT NULL COMMENT '邮箱（登录账号）',
  `password_hash` varchar(255) NOT NULL COMMENT '密码哈希',
  `company` varchar(255) DEFAULT NULL COMMENT '公司名称',
  `role_id` bigint unsigned DEFAULT NULL COMMENT '当前角色',
  `register_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_role_id` (`role_id`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 用户-角色多对多（可选：支持一人多角色）
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `role_id`),
  KEY `idx_role_id` (`role_id`),
  CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户-角色关联';

-- -------------------------------
-- 2. 集运仓（专线订单-基本信息）
-- -------------------------------
CREATE TABLE IF NOT EXISTS `warehouses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL COMMENT '仓名称',
  `address` varchar(512) DEFAULT NULL COMMENT '详细地址',
  `contact` varchar(128) DEFAULT NULL COMMENT '联系人',
  `phone` varchar(64) DEFAULT NULL COMMENT '联系电话',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='集运仓';

-- -------------------------------
-- 3. 物流产品（专线订单选择、定价规则关联）
-- -------------------------------
CREATE TABLE IF NOT EXISTS `logistics_products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL COMMENT '产品名称',
  `transport_method` varchar(32) NOT NULL COMMENT '运输方式：海运/空运',
  `cargo_type` varchar(32) NOT NULL COMMENT '货物类型：普货/特货',
  `remark` varchar(255) DEFAULT NULL COMMENT '产品备注',
  `status` varchar(16) NOT NULL DEFAULT '启用' COMMENT '启用/停用',
  `sort_order` int NOT NULL DEFAULT 0 COMMENT '排序',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='物流产品';

-- -------------------------------
-- 4. 定价规则（通用报价管理）
-- -------------------------------
CREATE TABLE IF NOT EXISTS `pricing_rules` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `logistics_product_id` bigint unsigned NOT NULL COMMENT '物流产品ID',
  `fee_name` varchar(128) NOT NULL COMMENT '费用名称',
  `calc_method` varchar(64) NOT NULL COMMENT '计算方式：按计费重/按计费体积',
  `currency` varchar(16) NOT NULL DEFAULT '$' COMMENT '币种',
  `unit_price` decimal(18,4) NOT NULL COMMENT '单价',
  `unit` varchar(32) NOT NULL COMMENT '单位：KG/CBM',
  `formula` varchar(255) DEFAULT NULL COMMENT '计算公式(可选)',
  `status` varchar(16) NOT NULL DEFAULT '启用' COMMENT '启用/停用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_logistics_product_id` (`logistics_product_id`),
  CONSTRAINT `fk_pricing_rules_product` FOREIGN KEY (`logistics_product_id`) REFERENCES `logistics_products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='定价规则';

-- -------------------------------
-- 5. 提货地址（整柜/专线可选）
-- -------------------------------
CREATE TABLE IF NOT EXISTS `pickup_addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(128) DEFAULT NULL COMMENT '地址名称',
  `contact` varchar(128) NOT NULL COMMENT '联系人',
  `phone` varchar(64) NOT NULL COMMENT '联系方式',
  `address` varchar(512) NOT NULL COMMENT '详细地址',
  `remark` varchar(512) DEFAULT NULL COMMENT '备注',
  `is_default` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否默认',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_is_default` (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='提货地址';

-- -------------------------------
-- 6. 收件信息（专线订单-基本信息）
-- -------------------------------
CREATE TABLE IF NOT EXISTS `shipping_addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `recipient` varchar(128) NOT NULL COMMENT '收件人',
  `contact` varchar(64) NOT NULL COMMENT '联系方式',
  `address` varchar(512) NOT NULL COMMENT '详细地址',
  `is_default` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否默认',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_is_default` (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收件信息';

-- -------------------------------
-- 7. 专线订单（订单-箱-商品 三层）
-- -------------------------------
CREATE TABLE IF NOT EXISTS `line_orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_no` varchar(64) NOT NULL COMMENT '订单号',
  `reference_no` varchar(128) DEFAULT NULL COMMENT '参考号',
  `customer_ref` varchar(128) DEFAULT NULL COMMENT '客户参考号',
  `warehouse_id` bigint unsigned DEFAULT NULL COMMENT '集运仓ID',
  `warehouse_name` varchar(128) DEFAULT NULL COMMENT '集运仓名称(冗余)',
  `logistics_product_id` bigint unsigned DEFAULT NULL COMMENT '物流产品ID',
  `logistics_product_name` varchar(128) DEFAULT NULL COMMENT '物流产品名称(冗余)',
  `cargo_type` varchar(32) DEFAULT NULL COMMENT '货物属性',
  `shipping_address_id` bigint unsigned DEFAULT NULL COMMENT '收件信息ID',
  `recipient_display` varchar(512) DEFAULT NULL COMMENT '收件人展示(冗余)',
  `order_remark` text COMMENT '订单备注',
  `status` varchar(32) NOT NULL DEFAULT '草稿' COMMENT '草稿/待处理/运输中/送达',
  `fee_confirmed` tinyint(1) NOT NULL DEFAULT 0 COMMENT '费用是否已确认',
  `total_weight` decimal(18,4) DEFAULT NULL COMMENT '总重量(KG)',
  `total_volume` decimal(18,6) DEFAULT NULL COMMENT '总体积(CBM)',
  `billing_volume` decimal(18,6) DEFAULT NULL COMMENT '计费体积',
  `billing_weight` decimal(18,4) DEFAULT NULL COMMENT '计费重',
  `fee_display` varchar(64) DEFAULT NULL COMMENT '费用展示(如 $1100.00)',
  `latest_track` varchar(255) DEFAULT NULL COMMENT '最新轨迹摘要',
  `creator_id` bigint unsigned DEFAULT NULL COMMENT '创建人用户ID',
  `creator_name` varchar(64) DEFAULT NULL COMMENT '创建人名称(冗余)',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_status` (`status`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_logistics_product_id` (`logistics_product_id`),
  KEY `idx_warehouse_id` (`warehouse_id`),
  KEY `idx_shipping_address_id` (`shipping_address_id`),
  CONSTRAINT `fk_line_orders_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_line_orders_product` FOREIGN KEY (`logistics_product_id`) REFERENCES `logistics_products` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_line_orders_shipping` FOREIGN KEY (`shipping_address_id`) REFERENCES `shipping_addresses` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_line_orders_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专线订单主表';

CREATE TABLE IF NOT EXISTS `line_order_boxes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `line_order_id` bigint unsigned NOT NULL,
  `box_no` varchar(64) NOT NULL COMMENT '箱号',
  `box_type` varchar(32) DEFAULT NULL COMMENT '箱型：纸箱/木箱',
  `weight` decimal(18,4) DEFAULT NULL COMMENT '重量(KG)',
  `length` decimal(10,2) DEFAULT NULL COMMENT '长(CM)',
  `width` decimal(10,2) DEFAULT NULL COMMENT '宽(CM)',
  `height` decimal(10,2) DEFAULT NULL COMMENT '高(CM)',
  `volume` decimal(18,6) DEFAULT NULL COMMENT '体积(CBM)',
  `billing_volume` decimal(18,6) DEFAULT NULL COMMENT '计费体积',
  `billing_weight` decimal(18,4) DEFAULT NULL COMMENT '计费重',
  `box_mark` text COMMENT '箱唛',
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_line_order_box_no` (`line_order_id`, `box_no`),
  KEY `idx_line_order_id` (`line_order_id`),
  CONSTRAINT `fk_line_order_boxes_order` FOREIGN KEY (`line_order_id`) REFERENCES `line_orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专线订单-箱';

CREATE TABLE IF NOT EXISTS `line_order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `line_order_box_id` bigint unsigned NOT NULL,
  `product_name` varchar(255) DEFAULT NULL COMMENT '商品名称',
  `english_name` varchar(255) DEFAULT NULL COMMENT '英文名称',
  `product_code` varchar(128) DEFAULT NULL COMMENT '商品编码',
  `brand` varchar(128) DEFAULT NULL COMMENT '品牌',
  `material` varchar(128) DEFAULT NULL COMMENT '材质',
  `specification` varchar(255) DEFAULT NULL COMMENT '规格',
  `purpose` varchar(255) DEFAULT NULL COMMENT '用途',
  `quantity` varchar(64) DEFAULT NULL COMMENT '数量(含单位如 500件)',
  `quantity_num` decimal(18,4) DEFAULT NULL COMMENT '数量数值',
  `unit` varchar(32) DEFAULT '件' COMMENT '单位',
  `declared_price` decimal(18,4) DEFAULT NULL COMMENT '申报价',
  `declared_currency` varchar(16) DEFAULT 'USD' COMMENT '申报币种',
  `single_weight` varchar(64) DEFAULT NULL COMMENT '单品重量(KG)',
  `image_url` varchar(512) DEFAULT NULL COMMENT '商品图片',
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_line_order_box_id` (`line_order_box_id`),
  CONSTRAINT `fk_line_order_items_box` FOREIGN KEY (`line_order_box_id`) REFERENCES `line_order_boxes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专线订单-箱内商品';

CREATE TABLE IF NOT EXISTS `line_order_fees` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `line_order_id` bigint unsigned NOT NULL,
  `fee_item` varchar(128) NOT NULL COMMENT '费用项',
  `calc_method` varchar(64) DEFAULT NULL COMMENT '计算方式',
  `unit_price` varchar(64) DEFAULT NULL COMMENT '单价展示',
  `quantity` varchar(64) DEFAULT NULL COMMENT '数量',
  `amount` varchar(64) DEFAULT NULL COMMENT '金额展示',
  `currency` varchar(16) DEFAULT NULL COMMENT '币种',
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_line_order_id` (`line_order_id`),
  CONSTRAINT `fk_line_order_fees_order` FOREIGN KEY (`line_order_id`) REFERENCES `line_orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专线订单-费用明细';

CREATE TABLE IF NOT EXISTS `line_order_tracks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `line_order_id` bigint unsigned NOT NULL,
  `track_time` datetime DEFAULT NULL COMMENT '轨迹时间',
  `description` varchar(512) DEFAULT NULL COMMENT '描述',
  `location` varchar(255) DEFAULT NULL COMMENT '地点',
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_line_order_id` (`line_order_id`),
  CONSTRAINT `fk_line_order_tracks_order` FOREIGN KEY (`line_order_id`) REFERENCES `line_orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专线订单-物流轨迹';

-- -------------------------------
-- 8. 整柜订单
-- -------------------------------
CREATE TABLE IF NOT EXISTS `container_orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `waybill_no` varchar(64) NOT NULL COMMENT '运单号',
  `pickup_address_id` bigint unsigned DEFAULT NULL COMMENT '提货地址ID',
  `pickup_contact` varchar(128) DEFAULT NULL COMMENT '提货联系人(冗余)',
  `pickup_phone` varchar(64) DEFAULT NULL,
  `pickup_address_detail` varchar(512) DEFAULT NULL,
  `shipping_address_id` bigint unsigned DEFAULT NULL COMMENT '收件地址ID',
  `recipient_name` varchar(128) DEFAULT NULL COMMENT '收件人(冗余)',
  `recipient_phone` varchar(64) DEFAULT NULL,
  `recipient_address_detail` varchar(512) DEFAULT NULL,
  `transport_method` varchar(32) NOT NULL DEFAULT '海运' COMMENT '运输方式',
  `box_count` int NOT NULL DEFAULT 0 COMMENT '箱数',
  `box_spec` varchar(128) DEFAULT NULL COMMENT '箱规/数量描述',
  `status` varchar(32) NOT NULL DEFAULT '待处理' COMMENT '运单状态',
  `remark` text COMMENT '备注',
  `submit_time` datetime DEFAULT NULL COMMENT '提交时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_waybill_no` (`waybill_no`),
  KEY `idx_status` (`status`),
  KEY `idx_pickup_address_id` (`pickup_address_id`),
  KEY `idx_shipping_address_id` (`shipping_address_id`),
  CONSTRAINT `fk_container_orders_pickup` FOREIGN KEY (`pickup_address_id`) REFERENCES `pickup_addresses` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_container_orders_shipping` FOREIGN KEY (`shipping_address_id`) REFERENCES `shipping_addresses` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='整柜订单主表';

CREATE TABLE IF NOT EXISTS `container_order_declarations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `container_order_id` bigint unsigned NOT NULL,
  `product_name` varchar(255) DEFAULT NULL COMMENT '商品名称',
  `english_name` varchar(255) DEFAULT NULL COMMENT '英文名称',
  `brand` varchar(128) DEFAULT NULL COMMENT '品牌',
  `declared_price` decimal(18,4) DEFAULT NULL COMMENT '申报价格',
  `quantity` decimal(18,4) DEFAULT NULL COMMENT '数量',
  `unit` varchar(32) DEFAULT '件' COMMENT '单位',
  `box_count` int DEFAULT NULL COMMENT '箱数',
  `total_price` varchar(64) DEFAULT NULL COMMENT '总价展示',
  `material` varchar(128) DEFAULT NULL COMMENT '材质',
  `specification` varchar(255) DEFAULT NULL COMMENT '规格',
  `purpose` varchar(255) DEFAULT NULL COMMENT '用途',
  `sort_order` int NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_container_order_id` (`container_order_id`),
  CONSTRAINT `fk_container_declarations_order` FOREIGN KEY (`container_order_id`) REFERENCES `container_orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='整柜订单-申报信息';

SET FOREIGN_KEY_CHECKS = 1;
