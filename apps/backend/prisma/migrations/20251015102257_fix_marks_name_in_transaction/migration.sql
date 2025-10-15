/*
  Warnings:

  - You are about to drop the column `mark` on the `Transaction` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
    "userId" TEXT NOT NULL,
    "marks" TEXT,
    "notes" TEXT,
    "portfolio" TEXT
);
INSERT INTO "new_Transaction" ("assetId", "id", "notes", "portfolio", "price", "quantity", "timestamp", "type", "userId") SELECT "assetId", "id", "notes", "portfolio", "price", "quantity", "timestamp", "type", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
