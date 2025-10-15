/*
  Warnings:

  - You are about to drop the column `marks` on the `Transaction` table. All the data in the column will be lost.

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
    "marks" TEXT,
    "notes" TEXT
);
INSERT INTO "new_Asset" ("id", "marketId", "marks", "name", "notes", "price", "symbol", "timestamp", "userId") SELECT "id", "marketId", "marks", "name", "notes", "price", "symbol", "timestamp", "userId" FROM "Asset";
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
    "mark" TEXT,
    "notes" TEXT,
    "portfolio" TEXT
);
INSERT INTO "new_Transaction" ("assetId", "id", "notes", "portfolio", "price", "quantity", "timestamp", "type", "userId") SELECT "assetId", "id", "notes", "portfolio", "price", "quantity", "timestamp", "type", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
