-- CreateTable
CREATE TABLE "OctopusAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "number" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "OctopusAccount_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "octo_account_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "wan_coverage" TEXT NOT NULL,
    CONSTRAINT "Property_octo_account_id_fkey" FOREIGN KEY ("octo_account_id") REFERENCES "OctopusAccount" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ElectricityMeterPoints" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mpan" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    CONSTRAINT "ElectricityMeterPoints_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GasMeterPoints" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mprn" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    CONSTRAINT "GasMeterPoints_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "OctopusAccount_user_id_key" ON "OctopusAccount"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ElectricityMeterPoints_mpan_key" ON "ElectricityMeterPoints"("mpan");

-- CreateIndex
CREATE UNIQUE INDEX "GasMeterPoints_mprn_key" ON "GasMeterPoints"("mprn");
