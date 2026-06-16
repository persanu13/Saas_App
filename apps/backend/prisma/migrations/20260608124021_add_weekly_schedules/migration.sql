/*
  Warnings:

  - You are about to drop the column `base_schedule_id` on the `OrganizationMember` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrganizationMember" DROP CONSTRAINT "OrganizationMember_base_schedule_id_fkey";

-- DropIndex
DROP INDEX "OrganizationMember_base_schedule_id_key";

-- AlterTable
ALTER TABLE "OrganizationMember" DROP COLUMN "base_schedule_id";

-- AlterTable
ALTER TABLE "weekly_schedules" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
