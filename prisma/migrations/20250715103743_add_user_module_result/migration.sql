-- CreateTable
CREATE TABLE "UserModuleResult" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "contents" JSONB NOT NULL,
    "evaluation" JSONB NOT NULL,
    "watched" BOOLEAN NOT NULL DEFAULT false,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "UserModuleResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModuleResult_userId_moduleId_key" ON "UserModuleResult"("userId", "moduleId");

-- AddForeignKey
ALTER TABLE "UserModuleResult" ADD CONSTRAINT "UserModuleResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserModuleResult" ADD CONSTRAINT "UserModuleResult_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
