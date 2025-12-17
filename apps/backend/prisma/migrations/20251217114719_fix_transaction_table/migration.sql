/*
  Warnings:

  - You are about to alter the column `quantity` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" DECIMAL NOT NULL,
    "price" DECIMAL NOT NULL,
    "userId" TEXT NOT NULL,
    "marks" TEXT,
    "notes" TEXT,
    "portfolio" TEXT,
    "fee" DECIMAL,
    "source" TEXT NOT NULL
);
INSERT INTO "new_Transaction" ("assetId", "fee", "id", "marks", "notes", "portfolio", "price", "quantity", "source", "timestamp", "type", "userId") SELECT "assetId", "fee", "id", "marks", "notes", "portfolio", "price", "quantity", "source", "timestamp", "type", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
