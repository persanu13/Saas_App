/*
  Warnings:

  - Added the required column `role` to the `organization_invites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organization_invites" ADD COLUMN     "role" "OrgRole" NOT NULL;

-- CreateTable
CREATE TABLE "organization_clients" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "organization_clients_organization_id_idx" ON "organization_clients"("organization_id");

-- CreateIndex
CREATE INDEX "organization_clients_user_id_idx" ON "organization_clients"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_clients_user_id_organization_id_key" ON "organization_clients"("user_id", "organization_id");

-- AddForeignKey
ALTER TABLE "organization_clients" ADD CONSTRAINT "organization_clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_clients" ADD CONSTRAINT "organization_clients_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_invites" ADD CONSTRAINT "organization_invites_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
