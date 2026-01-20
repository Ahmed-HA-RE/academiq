-- CreateTable
CREATE TABLE "InstructorEarnings" (
    "id" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "payoutDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstructorEarnings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InstructorEarnings" ADD CONSTRAINT "InstructorEarnings_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
