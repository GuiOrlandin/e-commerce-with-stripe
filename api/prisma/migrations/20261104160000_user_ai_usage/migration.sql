-- CreateTable
CREATE TABLE "user_ai_usage" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "request_count" INTEGER NOT NULL DEFAULT 0,
    "token_estimate" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_ai_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_ai_usage_user_id_idx" ON "user_ai_usage"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_ai_usage_user_id_day_key" ON "user_ai_usage"("user_id", "day");

-- AddForeignKey
ALTER TABLE "user_ai_usage" ADD CONSTRAINT "user_ai_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
