/*
  Warnings:

  - Added the required column `price` to the `Drops` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Drops` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Drops" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "fee" DECIMAL,
    "timestamp" DATETIME NOT NULL,
    "notes" TEXT,
    "marks" TEXT,
    "value" DECIMAL NOT NULL,
    "sold" DECIMAL,
    "price" DECIMAL NOT NULL,
    "transactions" TEXT
);
INSERT INTO "new_Drops" ("assetId", "fee", "id", "marks", "notes", "timestamp", "userId") SELECT "assetId", "fee", "id", "marks", "notes", "timestamp", "userId" FROM "Drops";
DROP TABLE "Drops";
ALTER TABLE "new_Drops" RENAME TO "Drops";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
