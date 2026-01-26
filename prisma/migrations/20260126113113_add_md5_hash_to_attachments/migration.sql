-- AlterTable
ALTER TABLE "apartment_attachments" ADD COLUMN     "md5_hash" TEXT;

-- CreateIndex
CREATE INDEX "apartment_attachments_md5_hash_idx" ON "apartment_attachments"("md5_hash");
