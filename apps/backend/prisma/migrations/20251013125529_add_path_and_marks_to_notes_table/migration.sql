/*
  Warnings:

  - Added the required column `marks` to the `Notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Notes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "linkedTo" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "marks" TEXT NOT NULL
);
INSERT INTO "new_Notes" ("createdAt", "id", "isArchived", "linkedTo", "name", "updatedAt", "userId") SELECT "createdAt", "id", "isArchived", "linkedTo", "name", "updatedAt", "userId" FROM "Notes";
DROP TABLE "Notes";
ALTER TABLE "new_Notes" RENAME TO "Notes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
