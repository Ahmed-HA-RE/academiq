-- CreateTable
CREATE TABLE "Certifacte" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certifacte_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Certifacte_courseId_key" ON "Certifacte"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Certifacte_userId_courseId_key" ON "Certifacte"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "Certifacte" ADD CONSTRAINT "Certifacte_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certifacte" ADD CONSTRAINT "Certifacte_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
