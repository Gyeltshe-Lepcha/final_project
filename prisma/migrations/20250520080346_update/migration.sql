/*
  Warnings:

  - You are about to drop the column `date` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Reservation` table. All the data in the column will be lost.
  - Added the required column `contact` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateTime` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menuItemId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "contact" TEXT NOT NULL,
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "menuItemId" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
