/*
  Warnings:

  - Added the required column `buyTransactionId` to the `Swaps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellTransactionId` to the `Swaps` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Swaps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "assetIdChange" TEXT NOT NULL,
    "assetIdReceive" TEXT NOT NULL,
    "fee" DECIMAL,
    "notes" TEXT,
    "marks" TEXT,
    "changeAmount" DECIMAL NOT NULL,
    "receiveAmount" DECIMAL NOT NULL,
    "priceChange" DECIMAL NOT NULL,
    "priceReceive" DECIMAL NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "sellTransactionId" TEXT NOT NULL,
    "buyTransactionId" TEXT NOT NULL
);
INSERT INTO "new_Swaps" ("assetIdChange", "assetIdReceive", "changeAmount", "fee", "id", "marks", "notes", "priceChange", "priceReceive", "receiveAmount", "timestamp", "userId") SELECT "assetIdChange", "assetIdReceive", "changeAmount", "fee", "id", "marks", "notes", "priceChange", "priceReceive", "receiveAmount", "timestamp", "userId" FROM "Swaps";
DROP TABLE "Swaps";
ALTER TABLE "new_Swaps" RENAME TO "Swaps";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
