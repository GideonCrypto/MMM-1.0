/*
  Warnings:

  - Added the required column `source` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Swaps" (
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
    "timestamp" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Drops" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "fee" DECIMAL,
    "timestamp" DATETIME NOT NULL,
    "notes" TEXT,
    "marks" TEXT
);

-- CreateTable
CREATE TABLE "Staking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "value" DECIMAL NOT NULL,
    "reward" DECIMAL NOT NULL,
    "rewardSold" DECIMAL NOT NULL,
    "coinToReceive" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "notes" TEXT,
    "marks" TEXT
);

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
    "portfolio" TEXT,
    "fee" DECIMAL,
    "source" TEXT NOT NULL
);
INSERT INTO "new_Transaction" ("assetId", "id", "marks", "notes", "portfolio", "price", "quantity", "timestamp", "type", "userId") SELECT "assetId", "id", "marks", "notes", "portfolio", "price", "quantity", "timestamp", "type", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
