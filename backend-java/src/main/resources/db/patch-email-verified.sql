ALTER TABLE "user" ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT true;
UPDATE "user" SET email_verified = true WHERE email_verified IS NULL;
ALTER TABLE "user" ALTER COLUMN email_verified SET NOT NULL;
ALTER TABLE "user" ALTER COLUMN email_verified SET DEFAULT false;
