-- AlterTable
ALTER TABLE "products" ADD COLUMN     "image_embedding" vector(512),
ADD COLUMN     "text_embedding" vector(768);
