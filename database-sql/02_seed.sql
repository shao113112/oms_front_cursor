-- ============================================================
-- EpochV OMS 初始数据（与前端 Mock 对齐）
-- 执行前请先执行 01_schema.sql
-- ============================================================

SET NAMES utf8mb4;

-- -------------------------------
-- 角色
-- -------------------------------
INSERT INTO `roles` (`id`, `name`) VALUES
(1, '一般用户'),
(2, '管理员')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- -------------------------------
-- 用户（登录账号 opr@dotmatrix.com / 密码 operator）
-- password_hash 为 bcrypt 加密后的 "operator"，后端需用 bcrypt 校验
-- -------------------------------
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `company`, `role_id`, `register_time`) VALUES
(1, 'operator', 'opr@dotmatrix.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 1, NOW()),
(2, '12321', 'qq1@sina.cn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '-', 1, NOW()),
(3, '1', 'qq@sina.cn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '-', 1, NOW()),
(4, 'Eason', 'eason.sun@globalsnp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '-', 1, NOW())
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`), `email` = VALUES(`email`), `role_id` = VALUES(`role_id`);

-- 用户-角色关联（可选，若使用多角色）
INSERT IGNORE INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 1), (2, 1), (3, 1), (4, 1);

-- -------------------------------
-- 集运仓
-- -------------------------------
INSERT INTO `warehouses` (`id`, `name`, `address`, `contact`, `phone`) VALUES
(1, '深圳布吉仓', '深圳市龙岗区布吉储运路44号(导航:深圳市华辰天投资有限公司)', '周敏', '18928485015')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `address` = VALUES(`address`), `contact` = VALUES(`contact`), `phone` = VALUES(`phone`);

-- -------------------------------
-- 物流产品
-- -------------------------------
INSERT INTO `logistics_products` (`id`, `name`, `transport_method`, `cargo_type`, `remark`, `status`, `sort_order`) VALUES
(1, '巴西海运散装普货', '海运', '普货', '王牌产品', '启用', 1),
(2, '巴西空运散装普货', '空运', '普货', '-', '启用', 2),
(3, '巴西海运散装特货', '海运', '特货', '-', '停用', 3)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `transport_method` = VALUES(`transport_method`), `cargo_type` = VALUES(`cargo_type`), `remark` = VALUES(`remark`), `status` = VALUES(`status`), `sort_order` = VALUES(`sort_order`);

-- -------------------------------
-- 定价规则
-- -------------------------------
INSERT INTO `pricing_rules` (`id`, `logistics_product_id`, `fee_name`, `calc_method`, `currency`, `unit_price`, `unit`, `status`) VALUES
(1, 2, '空运公斤费', '按计费重', '$', 55.0000, 'KG', '启用'),
(2, 1, '海运体积费', '按计费体积', '$', 50.0000, 'CBM', '启用')
ON DUPLICATE KEY UPDATE `fee_name` = VALUES(`fee_name`), `calc_method` = VALUES(`calc_method`), `unit_price` = VALUES(`unit_price`), `unit` = VALUES(`unit`), `status` = VALUES(`status`);

-- -------------------------------
-- 收件信息
-- -------------------------------
INSERT INTO `shipping_addresses` (`id`, `recipient`, `contact`, `address`, `is_default`) VALUES
(1, 'Thomas BESSA', '+88932312344432', 'Bouvervard Jourdan 75014 Sao Paulo, Brazil', 1)
ON DUPLICATE KEY UPDATE `recipient` = VALUES(`recipient`), `contact` = VALUES(`contact`), `address` = VALUES(`address`), `is_default` = VALUES(`is_default`);

-- -------------------------------
-- 专线订单示例（订单-箱-商品 三层）
-- -------------------------------
INSERT INTO `line_orders` (
  `id`, `order_no`, `reference_no`, `customer_ref`, `warehouse_id`, `warehouse_name`, `logistics_product_id`, `logistics_product_name`, `cargo_type`,
  `shipping_address_id`, `recipient_display`, `order_remark`, `status`, `fee_confirmed`, `total_weight`, `total_volume`, `billing_volume`, `billing_weight`,
  `fee_display`, `latest_track`, `creator_id`, `creator_name`
) VALUES
(1, 'EP0120251117008', '-', NULL, 1, '深圳布吉仓', 2, '巴西空运散装普货', '普货', 1, 'Thomas BESSA || Bouvervard Jourdan 75014 Sao Paulo, Brazil', '-', '待处理', 0, 20.0000, 0.100000, 0.008000, 20.0000, '$1100.00', '', 1, '未知'),
(2, 'TEST002', '-', NULL, 1, '深圳布吉仓', 1, '巴西海运散装普货', '普货', 1, 'Thomas BESSA', NULL, '待处理', 0, 20.0000, 36000.000000, NULL, NULL, '$1800000.00', '', 1, '未知'),
(3, 'test001', '-', NULL, NULL, '-', NULL, NULL, '-', NULL, '-', NULL, '待处理', 0, 30.0000, 94000.000000, NULL, NULL, NULL, '', 4, 'Roy')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`), `fee_display` = VALUES(`fee_display`), `creator_name` = VALUES(`creator_name`);

-- 专线订单-箱（示例：EP0120251117008 一箱）
INSERT INTO `line_order_boxes` (`id`, `line_order_id`, `box_no`, `box_type`, `weight`, `length`, `width`, `height`, `volume`, `billing_volume`, `billing_weight`, `box_mark`, `sort_order`) VALUES
(1, 1, 'EP0120251117008_001', '纸箱', 20.0000, 50.00, 40.00, 50.00, 0.100000, 0.008000, 20.0000, NULL, 0)
ON DUPLICATE KEY UPDATE `box_type` = VALUES(`box_type`), `weight` = VALUES(`weight`), `volume` = VALUES(`volume`), `billing_volume` = VALUES(`billing_volume`), `billing_weight` = VALUES(`billing_weight`);

-- 专线订单-箱内商品
INSERT INTO `line_order_items` (`line_order_box_id`, `product_name`, `english_name`, `product_code`, `brand`, `material`, `specification`, `purpose`, `quantity`, `unit`, `declared_price`, `declared_currency`, `single_weight`, `sort_order`) VALUES
(1, '唇膏plus', 'lipcream', 'sku001', '-', '塑料', '-', '-', '500件', '件', 2.9900, 'USD', '0.2', 0),
(1, '船pro', 'vessel', '-', '-', 'steel', '-', '-', '1件', '件', 39999.0000, 'USD', '2333', 1)
ON DUPLICATE KEY UPDATE `product_name` = VALUES(`product_name`), `quantity` = VALUES(`quantity`), `declared_price` = VALUES(`declared_price`);

-- 专线订单-费用明细
INSERT INTO `line_order_fees` (`line_order_id`, `fee_item`, `calc_method`, `unit_price`, `quantity`, `amount`, `currency`, `sort_order`) VALUES
(1, '空运公斤费', '按重量', '$55', '20', '$1100.00', 'USD', 0)
ON DUPLICATE KEY UPDATE `amount` = VALUES(`amount`);

-- -------------------------------
-- 整柜订单示例
-- -------------------------------
INSERT INTO `container_orders` (`id`, `waybill_no`, `pickup_address_id`, `recipient_name`, `transport_method`, `box_count`, `box_spec`, `status`, `remark`, `submit_time`) VALUES
(1, '20251113-001', NULL, NULL, '海运', 1, '1箱', '待处理', '-', '2025-11-13 13:57:27')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`), `remark` = VALUES(`remark`);

INSERT INTO `container_order_declarations` (`container_order_id`, `product_name`, `english_name`, `brand`, `declared_price`, `quantity`, `unit`, `box_count`, `total_price`, `material`, `specification`, `purpose`, `sort_order`) VALUES
(1, 'hanger', 'hanger', '-', 1.9900, 1000.0000, '件', 1000, '1990.00', '木头', '-', '-', 0)
ON DUPLICATE KEY UPDATE `product_name` = VALUES(`product_name`), `quantity` = VALUES(`quantity`), `total_price` = VALUES(`total_price`);
