/*
  Warnings:

  - You are about to drop the column `adults` on the `booking_rooms` table. All the data in the column will be lost.
  - You are about to drop the column `children` on the `booking_rooms` table. All the data in the column will be lost.
  - You are about to alter the column `booking_id` on the `booking_rooms` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - You are about to alter the column `room_id` on the `booking_rooms` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - You are about to drop the column `cancel_reason` on the `bookings` table. All the data in the column will be lost.
  - You are about to alter the column `user_id` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - You are about to alter the column `hotel_id` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - The `status` column on the `bookings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `cover_url` on the `hotels` table. All the data in the column will be lost.
  - You are about to drop the column `logo_url` on the `hotels` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `payments` table. All the data in the column will be lost.
  - You are about to alter the column `booking_id` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - The `status` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `transaction_ref` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `room_type_id` on the `pricing_rules` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - You are about to drop the column `responded_at` on the `reviews` table. All the data in the column will be lost.
  - You are about to alter the column `user_id` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - You are about to alter the column `booking_id` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - You are about to alter the column `room_type_id` on the `reviews` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - You are about to alter the column `room_id` on the `room_availability` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - The `status` column on the `room_availability` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `booking_id` on the `room_availability` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - The primary key for the `room_type_amenities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `room_type_id` on the `room_type_amenities` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - You are about to alter the column `amenity_id` on the `room_type_amenities` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(25)`.
  - The `bed_type` column on the `room_types` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `rooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `booking_coupons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `coupons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hotel_staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_amenities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tax_rates` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[room_type_id,amenity_id]` on the table `room_type_amenities` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `method` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `pricing_rules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `hotel_id` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `room_type_amenities` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "availability_status" AS ENUM ('AVAILABLE', 'BOOKED', 'BLOCKED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "bed_type" AS ENUM ('SINGLE', 'DOUBLE', 'TWIN', 'QUEEN', 'KING');

-- CreateEnum
CREATE TYPE "booking_status" AS ENUM ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW', 'REFUNDED');

-- CreateEnum
CREATE TYPE "payment_method" AS ENUM ('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'MOMO', 'VNPAY', 'ZALOPAY');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');

-- CreateEnum
CREATE TYPE "pricing_type" AS ENUM ('BASE', 'WEEKEND', 'SEASONAL', 'HOLIDAY', 'PROMOTION', 'LAST_MINUTE');

-- CreateEnum
CREATE TYPE "room_status" AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OUT_OF_ORDER');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('SUPER_ADMIN', 'HOTEL_ADMIN', 'STAFF', 'GUEST');

-- DropForeignKey
ALTER TABLE "booking_coupons" DROP CONSTRAINT "booking_coupons_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_coupons" DROP CONSTRAINT "booking_coupons_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_rooms" DROP CONSTRAINT "booking_rooms_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_rooms" DROP CONSTRAINT "booking_rooms_room_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "hotel_staff" DROP CONSTRAINT "hotel_staff_hotel_id_fkey";

-- DropForeignKey
ALTER TABLE "hotel_staff" DROP CONSTRAINT "hotel_staff_user_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "pricing_rules" DROP CONSTRAINT "pricing_rules_room_type_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_room_type_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "room_availability" DROP CONSTRAINT "room_availability_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "room_availability" DROP CONSTRAINT "room_availability_room_id_fkey";

-- DropForeignKey
ALTER TABLE "room_images" DROP CONSTRAINT "room_images_room_type_id_fkey";

-- DropForeignKey
ALTER TABLE "room_type_amenities" DROP CONSTRAINT "room_type_amenities_amenity_id_fkey";

-- DropForeignKey
ALTER TABLE "room_type_amenities" DROP CONSTRAINT "room_type_amenities_room_type_id_fkey";

-- DropForeignKey
ALTER TABLE "tax_rates" DROP CONSTRAINT "tax_rates_hotel_id_fkey";

-- DropIndex
DROP INDEX "booking_rooms_booking_id_room_id_key";

-- DropIndex
DROP INDEX "bookings_created_at_idx";

-- DropIndex
DROP INDEX "payments_transaction_ref_idx";

-- DropIndex
DROP INDEX "pricing_rules_priority_idx";

-- DropIndex
DROP INDEX "pricing_rules_room_type_id_type_idx";

-- DropIndex
DROP INDEX "reviews_room_type_id_rating_idx";

-- DropIndex
DROP INDEX "room_availability_booking_id_idx";

-- DropIndex
DROP INDEX "room_types_base_price_idx";

-- DropIndex
DROP INDEX "users_phone_idx";

-- AlterTable
ALTER TABLE "booking_rooms" DROP COLUMN "adults",
DROP COLUMN "children",
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "booking_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "room_id" SET DATA TYPE VARCHAR(25);

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "cancel_reason",
ADD COLUMN     "cancellation_reason" TEXT,
ADD COLUMN     "source" VARCHAR(50) DEFAULT 'WEBSITE',
ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "hotel_id" SET DATA TYPE VARCHAR(25),
DROP COLUMN "status",
ADD COLUMN     "status" "booking_status" DEFAULT 'PENDING',
ALTER COLUMN "adults" DROP NOT NULL,
ALTER COLUMN "children" DROP NOT NULL,
ALTER COLUMN "infants" DROP NOT NULL,
ALTER COLUMN "subtotal" DROP NOT NULL,
ALTER COLUMN "subtotal" SET DEFAULT 0,
ALTER COLUMN "tax_rate" DROP NOT NULL,
ALTER COLUMN "tax_amount" DROP NOT NULL,
ALTER COLUMN "tax_amount" SET DEFAULT 0,
ALTER COLUMN "discount_amount" DROP NOT NULL,
ALTER COLUMN "total_amount" DROP NOT NULL,
ALTER COLUMN "total_amount" SET DEFAULT 0,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "hotels" DROP COLUMN "cover_url",
DROP COLUMN "logo_url",
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "province" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "star_rating" DROP NOT NULL,
ALTER COLUMN "check_in_time" DROP NOT NULL,
ALTER COLUMN "check_out_time" DROP NOT NULL,
ALTER COLUMN "is_active" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "metadata",
ADD COLUMN     "gateway_response" JSONB,
ALTER COLUMN "booking_id" SET DATA TYPE VARCHAR(25),
DROP COLUMN "method",
ADD COLUMN     "method" "payment_method" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "payment_status" DEFAULT 'PENDING',
ALTER COLUMN "transaction_ref" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "pricing_rules" ADD COLUMN     "percentage_adjustment" DECIMAL(5,2),
ADD COLUMN     "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "room_type_id" SET DATA TYPE VARCHAR(25),
DROP COLUMN "type",
ADD COLUMN     "type" "pricing_type" NOT NULL,
ALTER COLUMN "days_of_week" SET DEFAULT ARRAY[]::INTEGER[],
ALTER COLUMN "priority" DROP NOT NULL,
ALTER COLUMN "is_active" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "responded_at",
ADD COLUMN     "cons" TEXT,
ADD COLUMN     "hotel_id" VARCHAR(25) NOT NULL,
ADD COLUMN     "is_verified" BOOLEAN DEFAULT false,
ADD COLUMN     "pros" TEXT,
ADD COLUMN     "response_at" TIMESTAMP(3),
ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "booking_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "room_type_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "is_visible" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "room_availability" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "room_id" SET DATA TYPE VARCHAR(25),
DROP COLUMN "status",
ADD COLUMN     "status" "availability_status" DEFAULT 'AVAILABLE',
ALTER COLUMN "booking_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "notes" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "room_type_amenities" DROP CONSTRAINT "room_type_amenities_pkey",
ADD COLUMN     "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "room_type_id" SET DATA TYPE VARCHAR(25),
ALTER COLUMN "amenity_id" SET DATA TYPE VARCHAR(25),
ADD CONSTRAINT "room_type_amenities_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "room_types" ALTER COLUMN "max_adults" DROP NOT NULL,
ALTER COLUMN "max_children" DROP NOT NULL,
ALTER COLUMN "max_infants" DROP NOT NULL,
DROP COLUMN "bed_type",
ADD COLUMN     "bed_type" "bed_type" DEFAULT 'DOUBLE',
ALTER COLUMN "bed_count" DROP NOT NULL,
ALTER COLUMN "is_active" DROP NOT NULL,
ALTER COLUMN "sort_order" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "rooms" ALTER COLUMN "floor" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "room_status" DEFAULT 'AVAILABLE',
ALTER COLUMN "is_active" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "user_role" DEFAULT 'GUEST',
ALTER COLUMN "is_active" DROP NOT NULL,
ALTER COLUMN "email_verified" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "booking_coupons";

-- DropTable
DROP TABLE "coupons";

-- DropTable
DROP TABLE "hotel_staff";

-- DropTable
DROP TABLE "room_amenities";

-- DropTable
DROP TABLE "room_images";

-- DropTable
DROP TABLE "tax_rates";

-- DropEnum
DROP TYPE "CouponType";

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" VARCHAR(25),
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(100),
    "entity_id" VARCHAR(25),
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotel_images" (
    "id" TEXT NOT NULL,
    "hotel_id" VARCHAR(25) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "alt_text" VARCHAR(255),
    "sort_order" INTEGER DEFAULT 0,
    "is_primary" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hotel_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "user_id" VARCHAR(25) NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_type_images" (
    "id" TEXT NOT NULL,
    "room_type_id" VARCHAR(25) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "alt_text" VARCHAR(255),
    "sort_order" INTEGER DEFAULT 0,
    "is_primary" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_type_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amenities" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_audit_logs_created" ON "audit_logs"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_audit_logs_entity" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_audit_logs_user" ON "audit_logs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "idx_refresh_tokens_expires" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "idx_refresh_tokens_user" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "amenities_name_key" ON "amenities"("name");

-- CreateIndex
CREATE INDEX "idx_bookings_status" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "idx_payments_status" ON "payments"("status");

-- CreateIndex
CREATE INDEX "idx_room_availability_date_status" ON "room_availability"("date", "status");

-- CreateIndex
CREATE UNIQUE INDEX "room_type_amenities_room_type_id_amenity_id_key" ON "room_type_amenities"("room_type_id", "amenity_id");

-- CreateIndex
CREATE INDEX "idx_rooms_status" ON "rooms"("status");

-- CreateIndex
CREATE INDEX "idx_users_role" ON "users"("role");

-- AddForeignKey
ALTER TABLE "pricing_rules" ADD CONSTRAINT "pricing_rules_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_rooms" ADD CONSTRAINT "booking_rooms_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_rooms" ADD CONSTRAINT "booking_rooms_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_type_images" ADD CONSTRAINT "room_type_images_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_type_amenities" ADD CONSTRAINT "room_type_amenities_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_type_amenities" ADD CONSTRAINT "room_type_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "booking_rooms_booking_id_idx" RENAME TO "idx_booking_rooms_booking";

-- RenameIndex
ALTER INDEX "booking_rooms_room_id_idx" RENAME TO "idx_booking_rooms_room";

-- RenameIndex
ALTER INDEX "bookings_booking_code_idx" RENAME TO "idx_bookings_code";

-- RenameIndex
ALTER INDEX "bookings_check_in_check_out_idx" RENAME TO "idx_bookings_dates";

-- RenameIndex
ALTER INDEX "bookings_hotel_id_idx" RENAME TO "idx_bookings_hotel";

-- RenameIndex
ALTER INDEX "bookings_status_idx" RENAME TO "idx_bookings_status";

-- RenameIndex
ALTER INDEX "bookings_user_id_idx" RENAME TO "idx_bookings_user";

-- RenameIndex
ALTER INDEX "payments_booking_id_idx" RENAME TO "idx_payments_booking";

-- RenameIndex
ALTER INDEX "payments_status_idx" RENAME TO "idx_payments_status";

-- RenameIndex
ALTER INDEX "pricing_rules_start_date_end_date_idx" RENAME TO "idx_pricing_rules_dates";

-- RenameIndex
ALTER INDEX "reviews_user_id_idx" RENAME TO "idx_reviews_user";

-- RenameIndex
ALTER INDEX "room_availability_date_status_idx" RENAME TO "idx_room_availability_date_status";

-- RenameIndex
ALTER INDEX "room_availability_room_id_date_idx" RENAME TO "idx_room_availability_room_date";

-- RenameIndex
ALTER INDEX "room_types_hotel_id_idx" RENAME TO "idx_room_types_hotel";

-- RenameIndex
ALTER INDEX "rooms_room_type_id_idx" RENAME TO "idx_rooms_type";

-- RenameIndex
ALTER INDEX "rooms_status_idx" RENAME TO "idx_rooms_status";

-- RenameIndex
ALTER INDEX "users_email_idx" RENAME TO "idx_users_email";

-- RenameIndex
ALTER INDEX "users_role_idx" RENAME TO "idx_users_role";
