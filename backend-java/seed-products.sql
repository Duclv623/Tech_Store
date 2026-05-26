-- ============================================================
-- Seed data: 1 Store + 8 Products + images cho Tech Store
-- Chạy bằng psql hoặc dán vào pgAdmin / DBeaver
-- ============================================================

-- 1. STORE
INSERT INTO store (
    id, user_id, name, username, description, address,
    status, is_active, logo, email, contact,
    created_at, updated_at
) VALUES (
    'store-001', NULL, 'TechHub Store', 'techhub',
    'Cửa hàng công nghệ chính hãng — laptop, điện thoại, phụ kiện',
    '123 Lý Thường Kiệt, Q.10, TP.HCM',
    'approved', true,
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200',
    'contact@techhub.vn', '0901234567',
    NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. PRODUCTS
INSERT INTO product (
    id, name, description, mrp, price, category, in_stock, store_id,
    created_at, updated_at
) VALUES
    ('prod-001', 'MacBook Air M3 13"',
     'Laptop Apple chip M3, 16GB RAM, SSD 512GB, màn Retina 13.6"',
     32990000, 28990000, 'Laptop', true, 'store-001', NOW(), NOW()),

    ('prod-002', 'iPhone 15 Pro 256GB',
     'Điện thoại Apple chip A17 Pro, titan, camera 48MP, USB-C',
     28990000, 25990000, 'Smartphone', true, 'store-001', NOW(), NOW()),

    ('prod-003', 'Sony WH-1000XM5',
     'Tai nghe chống ồn flagship Sony, pin 30h, kết nối đa thiết bị',
     8990000, 6990000, 'Audio', true, 'store-001', NOW(), NOW()),

    ('prod-004', 'iPad Pro 11" M4',
     'Máy tính bảng Apple chip M4, OLED, hỗ trợ Apple Pencil Pro',
     24990000, 22490000, 'Tablet', true, 'store-001', NOW(), NOW()),

    ('prod-005', 'Samsung Galaxy S24 Ultra',
     'Snapdragon 8 Gen 3, S Pen, camera 200MP, màn 6.8" QHD+',
     33990000, 27990000, 'Smartphone', true, 'store-001', NOW(), NOW()),

    ('prod-006', 'AirPods Pro 2 (USB-C)',
     'Tai nghe Apple chống ồn chủ động, Spatial Audio, sạc USB-C',
     6490000, 5290000, 'Audio', true, 'store-001', NOW(), NOW()),

    ('prod-007', 'Logitech MX Master 3S',
     'Chuột không dây cao cấp, cảm biến 8000 DPI, sạc USB-C',
     2990000, 2290000, 'Accessories', true, 'store-001', NOW(), NOW()),

    ('prod-008', 'Dell XPS 15 OLED',
     'Laptop i7-13700H, RTX 4060, 32GB RAM, màn OLED 3.5K cảm ứng',
     54990000, 47990000, 'Laptop', false, 'store-001', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. PRODUCT IMAGES (2 ảnh / sản phẩm)
INSERT INTO product_images (product_id, image) VALUES
    ('prod-001', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'),
    ('prod-001', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'),

    ('prod-002', 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=800'),
    ('prod-002', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'),

    ('prod-003', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'),
    ('prod-003', 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800'),

    ('prod-004', 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800'),
    ('prod-004', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'),

    ('prod-005', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800'),
    ('prod-005', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800'),

    ('prod-006', 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800'),
    ('prod-006', 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'),

    ('prod-007', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'),
    ('prod-007', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800'),

    ('prod-008', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'),
    ('prod-008', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800');

-- ============================================================
-- KIỂM TRA
-- ============================================================
SELECT id, name, price, category, in_stock FROM product ORDER BY created_at;
SELECT product_id, COUNT(*) AS img_count FROM product_images GROUP BY product_id;
