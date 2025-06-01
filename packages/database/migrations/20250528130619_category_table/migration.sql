/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
