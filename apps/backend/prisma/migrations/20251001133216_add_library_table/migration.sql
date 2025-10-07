-- CreateTable
CREATE TABLE "library" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "geckoId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "library_name_key" ON "library"("name");

-- CreateIndex
CREATE UNIQUE INDEX "library_symbol_key" ON "library"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "library_geckoId_key" ON "library"("geckoId");
