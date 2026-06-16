-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_active_organization_id" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_last_active_organization_id_fkey" FOREIGN KEY ("last_active_organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
