-- Thêm cột tồn kho cho Product (idempotent, chạy được trên DB đã có sẵn dữ liệu)
ALTER TABLE product ADD COLUMN IF NOT EXISTS stock_quantity INTEGER;
-- Sản phẩm cũ chưa có kho: mặc định 100 để không bị coi là hết hàng
UPDATE product SET stock_quantity = 100 WHERE stock_quantity IS NULL;
-- Insert sau này (seed / bỏ trống) cũng nhận default 100
ALTER TABLE product ALTER COLUMN stock_quantity SET DEFAULT 100;
ALTER TABLE product ALTER COLUMN stock_quantity SET NOT NULL;
