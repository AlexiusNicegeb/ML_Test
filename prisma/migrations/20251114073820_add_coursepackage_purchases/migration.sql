-- CreateTable
CREATE TABLE "course_package_purchases" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "packageId" INTEGER NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_package_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_package_purchases_userId_packageId_key" ON "course_package_purchases"("userId", "packageId");

-- AddForeignKey
ALTER TABLE "course_package_purchases" ADD CONSTRAINT "course_package_purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
