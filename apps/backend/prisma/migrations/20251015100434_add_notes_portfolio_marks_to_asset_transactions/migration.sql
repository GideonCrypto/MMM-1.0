/*
  Warnings:

  - Added the required column `marks` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marks` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portfolio` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "marketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "price" DECIMAL NOT NULL,
    "marks" TEXT NOT NULL,
    "notes" TEXT NOT NULL
);
INSERT INTO "new_Asset" ("id", "marketId", "name", "price", "symbol", "timestamp", "userId") SELECT "id", "marketId", "name", "price", "symbol", "timestamp", "userId" FROM "Asset";
DROP TABLE "Asset";
ALTER TABLE "new_Asset" RENAME TO "Asset";
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
    "userId" TEXT NOT NULL,
    "marks" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "portfolio" TEXT NOT NULL
);
INSERT INTO "new_Transaction" ("assetId", "id", "price", "quantity", "timestamp", "type", "userId") SELECT "assetId", "id", "price", "quantity", "timestamp", "type", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
