-- ============================================================
--  GoCart — Seed data đầy đủ cho 11 bảng
--  Sau khi backend đã khởi động (tables đã được tạo bởi JPA),
--  chạy file này để insert dữ liệu mẫu.
--
--  Cách dùng:
--    psql -U postgres -d gocart -f seed-data.sql
--    (hoặc paste vào pgAdmin / DBeaver)
--
--  Mật khẩu mẫu cho mọi user (trừ admin): password123
--  Mật khẩu admin (betacomagency@gmail.com)  : admin123
-- ============================================================

-- 0) DỌN DỮ LIỆU CŨ (KHÔNG XOÁ SCHEMA)
TRUNCATE
    order_status_history,
    rating,
    order_item,
    "Order",
    product_images,
    product,
    category,
    address,
    store,
    coupon,
    "User"
RESTART IDENTITY CASCADE;


-- ============================================================
-- 1) USERS (5: 1 admin + 2 seller + 2 buyer)
-- ============================================================
INSERT INTO "User" (id, name, email, image, phone, bio, address, password, role, cart) VALUES
('user-admin-001',
 'Admin Lê Văn Đức',
 'betacomagency@gmail.com',
 'https://i.pravatar.cc/200?img=12',
 '0901111111',
 'Quản trị viên hệ thống GoCart',
 '123 Nguyễn Trãi, Q1, TP.HCM',
 '$2b$10$KBA.kskZKm9e.7/P0lqfAOAa7.PDMeYSL7J7JbKRDQkYJ/nK0LBTa',
 'ADMIN',
 '{}'::jsonb),

('user-seller-001',
 'TechHub Seller',
 'techhub@gocart.local',
 'https://i.pravatar.cc/200?img=33',
 '0902222222',
 'Chủ cửa hàng TechHub — chuyên đồ Apple',
 '456 Lý Thường Kiệt, Q10, TP.HCM',
 '$2b$10$uGLv1/P3fwEsOH4Dhw/urup7jcflYGTwSlU4dF2WGG1CLw8i4G5zy',
 'USER',
 '{}'::jsonb),

('user-seller-002',
 'GadgetWorld Seller',
 'gadget@gocart.local',
 'https://i.pravatar.cc/200?img=51',
 '0903333333',
 'Chủ cửa hàng GadgetWorld — Android + phụ kiện',
 '789 Trần Hưng Đạo, Q5, TP.HCM',
 '$2b$10$uGLv1/P3fwEsOH4Dhw/urup7jcflYGTwSlU4dF2WGG1CLw8i4G5zy',
 'USER',
 '{}'::jsonb),

('user-buyer-001',
 'Nguyễn Văn An',
 'an.nguyen@example.com',
 'https://i.pravatar.cc/200?img=8',
 '0904444444',
 NULL,
 '12 Đinh Tiên Hoàng, Q1, TP.HCM',
 '$2b$10$uGLv1/P3fwEsOH4Dhw/urup7jcflYGTwSlU4dF2WGG1CLw8i4G5zy',
 'USER',
 '{}'::jsonb),

('user-buyer-002',
 'Trần Thị Bích',
 'bich.tran@example.com',
 'https://i.pravatar.cc/200?img=47',
 '0905555555',
 NULL,
 '88 Phan Đăng Lưu, Phú Nhuận, TP.HCM',
 '$2b$10$uGLv1/P3fwEsOH4Dhw/urup7jcflYGTwSlU4dF2WGG1CLw8i4G5zy',
 'USER',
 '{}'::jsonb);


-- ============================================================
-- 2) CATEGORY (5 danh mục — match với assets/shop)
-- ============================================================
INSERT INTO category (id, name, slug, description, icon, parent_id, display_order, created_at, updated_at) VALUES
('cat-001', 'Laptop',      'laptop',      'Máy tính xách tay',         NULL, NULL, 1, NOW(), NOW()),
('cat-002', 'Smartphone',  'smartphone',  'Điện thoại di động',         NULL, NULL, 2, NOW(), NOW()),
('cat-003', 'Audio',       'audio',       'Tai nghe, loa, âm thanh',    NULL, NULL, 3, NOW(), NOW()),
('cat-004', 'Tablet',      'tablet',      'Máy tính bảng',              NULL, NULL, 4, NOW(), NOW()),
('cat-005', 'Accessories', 'accessories', 'Phụ kiện công nghệ',         NULL, NULL, 5, NOW(), NOW());


-- ============================================================
-- 3) STORES (2 cửa hàng đã được duyệt)
-- ============================================================
INSERT INTO store (id, user_id, name, description, username, address, status, is_active, logo, email, contact, created_at, updated_at) VALUES
('store-001', 'user-seller-001',
 'TechHub Store',
 'Cửa hàng công nghệ chính hãng — chuyên Apple, MacBook, iPhone, iPad',
 'techhub',
 '456 Lý Thường Kiệt, Q.10, TP.HCM',
 'approved', true,
 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200',
 'contact@techhub.vn', '0902222222',
 NOW(), NOW()),

('store-002', 'user-seller-002',
 'GadgetWorld',
 'Android, gaming gear, phụ kiện hi-tech',
 'gadgetworld',
 '789 Trần Hưng Đạo, Q.5, TP.HCM',
 'approved', true,
 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
 'hello@gadgetworld.vn', '0903333333',
 NOW(), NOW());


-- ============================================================
-- 4) PRODUCTS (10 sản phẩm)
-- ============================================================
INSERT INTO product (id, name, description, mrp, price, category, in_stock, store_id, created_at, updated_at) VALUES
-- TechHub: Apple
('prod-001', 'MacBook Air M3 13"',
 'Laptop Apple chip M3, 16GB RAM, SSD 512GB, màn Retina 13.6". Pin 18h, thiết kế siêu mỏng.',
 32990000, 28990000, 'Laptop', true, 'store-001', NOW(), NOW()),

('prod-002', 'iPhone 15 Pro 256GB',
 'Apple A17 Pro, khung titan, camera 48MP với Tetraprism zoom, USB-C, màn ProMotion 120Hz.',
 28990000, 25990000, 'Smartphone', true, 'store-001', NOW(), NOW()),

('prod-003', 'iPad Pro 11" M4',
 'Chip M4, màn Tandem OLED, Apple Pencil Pro support, mỏng hơn cả iPod Nano.',
 24990000, 22490000, 'Tablet', true, 'store-001', NOW(), NOW()),

('prod-004', 'AirPods Pro 2 (USB-C)',
 'Tai nghe Apple chống ồn chủ động, Spatial Audio, sạc USB-C, hộp sạc MagSafe.',
 6490000, 5290000, 'Audio', true, 'store-001', NOW(), NOW()),

('prod-005', 'Apple Magic Mouse',
 'Chuột không dây Apple, cảm ứng đa điểm, sạc Lightning, tương thích Mac/iPad.',
 2490000, 2090000, 'Accessories', true, 'store-001', NOW(), NOW()),

-- GadgetWorld: Android & misc
('prod-006', 'Samsung Galaxy S24 Ultra',
 'Snapdragon 8 Gen 3, S Pen tích hợp, camera 200MP, màn Dynamic AMOLED 6.8" QHD+.',
 33990000, 27990000, 'Smartphone', true, 'store-002', NOW(), NOW()),

('prod-007', 'Sony WH-1000XM5',
 'Tai nghe chống ồn flagship Sony, pin 30h, kết nối đa thiết bị, driver 30mm.',
 8990000, 6990000, 'Audio', true, 'store-002', NOW(), NOW()),

('prod-008', 'Dell XPS 15 OLED',
 'Intel i7-13700H, RTX 4060, 32GB RAM, màn OLED 3.5K cảm ứng. Workstation cho dân chuyên nghiệp.',
 54990000, 47990000, 'Laptop', false, 'store-002', NOW(), NOW()),

('prod-009', 'Logitech MX Master 3S',
 'Chuột không dây cao cấp, cảm biến 8000 DPI, sạc USB-C, kết nối 3 thiết bị.',
 2990000, 2290000, 'Accessories', true, 'store-002', NOW(), NOW()),

('prod-010', 'JBL Charge 5',
 'Loa Bluetooth chống nước IP67, pin 20h, công suất 30W, kèm sạc dự phòng.',
 3990000, 3190000, 'Audio', true, 'store-002', NOW(), NOW());


-- ============================================================
-- 5) PRODUCT IMAGES (2 ảnh/sản phẩm)
-- ============================================================
INSERT INTO product_images (product_id, image) VALUES
('prod-001', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'),
('prod-001', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'),
('prod-002', 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=800'),
('prod-002', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'),
('prod-003', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800'),
('prod-003', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'),
('prod-004', 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800'),
('prod-004', 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'),
('prod-005', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'),
('prod-006', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800'),
('prod-006', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800'),
('prod-007', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'),
('prod-007', 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800'),
('prod-008', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'),
('prod-008', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800'),
('prod-009', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800'),
('prod-010', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800');


-- ============================================================
-- 6) ADDRESSES (mỗi buyer có 1-2 địa chỉ)
-- ============================================================
INSERT INTO address (id, user_id, name, email, street, city, state, zip, country, phone, created_at) VALUES
('addr-001', 'user-buyer-001', 'Nguyễn Văn An',  'an.nguyen@example.com',   '12 Đinh Tiên Hoàng',     'TP.HCM',  'Quận 1',         '70000', 'Việt Nam', '0904444444', NOW()),
('addr-002', 'user-buyer-001', 'Nguyễn Văn An',  'an.nguyen@example.com',   '99 Nguyễn Văn Cừ',       'Hà Nội',  'Quận Long Biên', '10000', 'Việt Nam', '0904444444', NOW()),
('addr-003', 'user-buyer-002', 'Trần Thị Bích',  'bich.tran@example.com',   '88 Phan Đăng Lưu',       'TP.HCM',  'Phú Nhuận',      '70000', 'Việt Nam', '0905555555', NOW()),
('addr-004', 'user-admin-001', 'Lê Văn Đức',     'betacomagency@gmail.com', '123 Nguyễn Trãi',        'TP.HCM',  'Quận 1',         '70000', 'Việt Nam', '0901111111', NOW());


-- ============================================================
-- 7) COUPONS (3 mã giảm giá)
-- ============================================================
INSERT INTO coupon (code, description, discount, for_new_user, for_member, is_public, expires_at, created_at) VALUES
('NEW20',    'Giảm 20% cho khách hàng mới',          20.0, true,  false, true,  NOW() + INTERVAL '90 days',  NOW()),
('MEMBER10', 'Giảm 10% cho thành viên',              10.0, false, true,  true,  NOW() + INTERVAL '180 days', NOW()),
('SUMMER15', 'Khuyến mãi mùa hè — giảm 15%',         15.0, false, false, true,  NOW() + INTERVAL '60 days',  NOW());


-- ============================================================
-- 8) ORDERS (5 đơn — đủ các trạng thái)
-- ============================================================
INSERT INTO "Order" (id, total, status, user_id, store_id, address_id, is_paid, payment_method, is_coupon_used, coupon, created_at, updated_at) VALUES
-- Đơn 1: An mua MacBook + AirPods, đã giao + đã thanh toán
('order-001', 34280000, 'DELIVERED', 'user-buyer-001', 'store-001', 'addr-001', true,  'COD',    false, '{}'::jsonb, NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days'),

-- Đơn 2: An mua iPhone, đang giao + chưa thanh toán (COD)
('order-002', 25990000, 'SHIPPED',   'user-buyer-001', 'store-001', 'addr-002', false, 'COD',    false, '{}'::jsonb, NOW() - INTERVAL '3 days',  NOW() - INTERVAL '1 day'),

-- Đơn 3: Bích mua Galaxy S24 + tai nghe Sony, đã thanh toán Stripe, đang xử lý
('order-003', 34980000, 'PROCESSING','user-buyer-002', 'store-002', 'addr-003', true,  'STRIPE', false, '{}'::jsonb, NOW() - INTERVAL '1 day',   NOW()),

-- Đơn 4: Bích đặt chuột MX Master, vừa đặt
('order-004',  2290000, 'ORDER_PLACED','user-buyer-002', 'store-002', 'addr-003', false, 'COD',    false, '{}'::jsonb, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),

-- Đơn 5: An đặt iPad rồi huỷ
('order-005', 22490000, 'CANCELLED', 'user-buyer-001', 'store-001', 'addr-001', false, 'COD',    false, '{}'::jsonb, NOW() - INTERVAL '7 days',  NOW() - INTERVAL '6 days');


-- ============================================================
-- 9) ORDER ITEMS
-- ============================================================
INSERT INTO order_item (order_id, product_id, quantity, price) VALUES
-- Đơn 1: MacBook (1) + AirPods (1)
('order-001', 'prod-001', 1, 28990000),
('order-001', 'prod-004', 1,  5290000),

-- Đơn 2: iPhone (1)
('order-002', 'prod-002', 1, 25990000),

-- Đơn 3: Galaxy + Sony
('order-003', 'prod-006', 1, 27990000),
('order-003', 'prod-007', 1,  6990000),

-- Đơn 4: chuột MX
('order-004', 'prod-009', 1,  2290000),

-- Đơn 5: iPad (cancelled)
('order-005', 'prod-003', 1, 22490000);


-- ============================================================
-- 10) ORDER STATUS HISTORY (log lịch sử trạng thái)
-- ============================================================
INSERT INTO order_status_history (id, order_id, status, previous_status, changed_by_user_id, note, created_at) VALUES
-- Đơn 1 (DELIVERED): qua đủ chu trình
('hist-001', 'order-001', 'ORDER_PLACED', NULL,            'user-buyer-001', 'Đơn hàng được tạo',          NOW() - INTERVAL '15 days'),
('hist-002', 'order-001', 'PROCESSING',   'ORDER_PLACED',  'user-seller-001', NULL,                         NOW() - INTERVAL '14 days'),
('hist-003', 'order-001', 'SHIPPED',      'PROCESSING',    'user-seller-001', NULL,                         NOW() - INTERVAL '12 days'),
('hist-004', 'order-001', 'DELIVERED',    'SHIPPED',       'user-seller-001', 'Giao thành công cho khách', NOW() - INTERVAL '10 days'),

-- Đơn 2 (SHIPPED): đang giao
('hist-005', 'order-002', 'ORDER_PLACED', NULL,            'user-buyer-001', 'Đơn hàng được tạo',          NOW() - INTERVAL '3 days'),
('hist-006', 'order-002', 'PROCESSING',   'ORDER_PLACED',  'user-seller-001', NULL,                         NOW() - INTERVAL '2 days'),
('hist-007', 'order-002', 'SHIPPED',      'PROCESSING',    'user-seller-001', NULL,                         NOW() - INTERVAL '1 day'),

-- Đơn 3 (PROCESSING)
('hist-008', 'order-003', 'ORDER_PLACED', NULL,            'user-buyer-002', 'Đơn hàng được tạo',          NOW() - INTERVAL '1 day'),
('hist-009', 'order-003', 'PROCESSING',   'ORDER_PLACED',  'user-seller-002', 'Đã xác nhận thanh toán Stripe', NOW()),

-- Đơn 4 (ORDER_PLACED)
('hist-010', 'order-004', 'ORDER_PLACED', NULL,            'user-buyer-002', 'Đơn hàng được tạo',          NOW() - INTERVAL '2 hours'),

-- Đơn 5 (CANCELLED)
('hist-011', 'order-005', 'ORDER_PLACED', NULL,            'user-buyer-001', 'Đơn hàng được tạo',          NOW() - INTERVAL '7 days'),
('hist-012', 'order-005', 'CANCELLED',    'ORDER_PLACED',  'user-buyer-001', 'Khách yêu cầu huỷ',          NOW() - INTERVAL '6 days');


-- ============================================================
-- 11) RATINGS (chỉ đơn DELIVERED mới có thể đánh giá)
-- ============================================================
INSERT INTO rating (id, rating, review, user_id, product_id, order_id, created_at, updated_at) VALUES
('rate-001', 5,
 'MacBook Air M3 đỉnh quá, pin trâu, máy mát rượi cả ngày dùng. Đóng gói cũng cẩn thận.',
 'user-buyer-001', 'prod-001', 'order-001',
 NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

('rate-002', 4,
 'AirPods Pro 2 chống ồn tốt, nhưng giá hơi cao. Vẫn worth it nếu xài hệ sinh thái Apple.',
 'user-buyer-001', 'prod-004', 'order-001',
 NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');


-- ============================================================
-- KIỂM TRA SAU KHI INSERT
-- ============================================================
SELECT 'Users'                AS tbl, COUNT(*) FROM "User"                  UNION ALL
SELECT 'Categories'           , COUNT(*) FROM category                       UNION ALL
SELECT 'Stores'               , COUNT(*) FROM store                          UNION ALL
SELECT 'Products'             , COUNT(*) FROM product                        UNION ALL
SELECT 'Product Images'       , COUNT(*) FROM product_images                 UNION ALL
SELECT 'Addresses'            , COUNT(*) FROM address                        UNION ALL
SELECT 'Coupons'              , COUNT(*) FROM coupon                         UNION ALL
SELECT 'Orders'               , COUNT(*) FROM "Order"                        UNION ALL
SELECT 'Order Items'          , COUNT(*) FROM order_item                     UNION ALL
SELECT 'Order Status History' , COUNT(*) FROM order_status_history           UNION ALL
SELECT 'Ratings'              , COUNT(*) FROM rating;
