/*
  Warnings:

  - A unique constraint covering the columns `[base_schedule_id]` on the table `OrganizationMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "OrganizationMember" ADD COLUMN     "base_schedule_id" INTEGER;

-- CreateTable
CREATE TABLE "weekly_schedules" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weekly_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_slots" (
    "id" SERIAL NOT NULL,
    "schedule_id" INTEGER NOT NULL,
    "day" "DayOfWeek" NOT NULL,
    "start_min" INTEGER NOT NULL,
    "end_min" INTEGER NOT NULL,

    CONSTRAINT "schedule_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "weekly_schedules_member_id_idx" ON "weekly_schedules"("member_id");

-- CreateIndex
CREATE INDEX "schedule_slots_schedule_id_day_idx" ON "schedule_slots"("schedule_id", "day");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_base_schedule_id_key" ON "OrganizationMember"("base_schedule_id");

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_base_schedule_id_fkey" FOREIGN KEY ("base_schedule_id") REFERENCES "weekly_schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_schedules" ADD CONSTRAINT "weekly_schedules_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "OrganizationMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_slots" ADD CONSTRAINT "schedule_slots_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "weekly_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
