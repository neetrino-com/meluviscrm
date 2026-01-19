-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SALES');

-- CreateEnum
CREATE TYPE "ApartmentStatus" AS ENUM ('UPCOMING', 'AVAILABLE', 'RESERVED', 'SOLD');

-- CreateEnum
CREATE TYPE "SalesType" AS ENUM ('UNSOLD', 'MORTGAGE', 'CASH', 'TIMEBASED');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('AGREEMENT', 'FLOORPLAN', 'IMAGE', 'PROGRESS_IMAGE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'SALES',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" SERIAL NOT NULL,
    "district_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apartments" (
    "id" SERIAL NOT NULL,
    "building_id" INTEGER NOT NULL,
    "apartment_no" TEXT NOT NULL,
    "apartment_type" INTEGER,
    "status" "ApartmentStatus" NOT NULL DEFAULT 'UPCOMING',
    "deal_date" DATE,
    "ownership_name" TEXT,
    "email" TEXT,
    "passport_tax_no" TEXT,
    "phone" TEXT,
    "sqm" DECIMAL(10,2),
    "price_sqm" DECIMAL(12,2),
    "total_price" DECIMAL(12,2),
    "sales_type" "SalesType" NOT NULL DEFAULT 'UNSOLD',
    "total_paid" DECIMAL(12,2) DEFAULT 0,
    "deal_description" TEXT,
    "matter_link" TEXT,
    "floorplan_distribution" TEXT,
    "exterior_link" TEXT,
    "exterior_link2" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apartments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apartment_attachments" (
    "id" SERIAL NOT NULL,
    "apartment_id" INTEGER NOT NULL,
    "file_type" "FileType" NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT,
    "file_size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apartment_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "districts_slug_key" ON "districts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "buildings_district_id_slug_key" ON "buildings"("district_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "apartments_building_id_apartment_no_key" ON "apartments"("building_id", "apartment_no");

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apartments" ADD CONSTRAINT "apartments_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apartment_attachments" ADD CONSTRAINT "apartment_attachments_apartment_id_fkey" FOREIGN KEY ("apartment_id") REFERENCES "apartments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
