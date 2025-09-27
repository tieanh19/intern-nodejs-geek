-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('VNPAY', 'CASH');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."DiscountType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT');

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAddress" (
    "id" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_phone" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StoreBranches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "StoreBranches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Categories" (
    "id" TEXT NOT NULL,
    "imageUri" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "coverImg" TEXT NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductVariants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "imageUri" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "discount_percentage" INTEGER NOT NULL,

    CONSTRAINT "ProductVariants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cart" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CartItems" (
    "id" TEXT NOT NULL,
    "product_variant_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cartId" TEXT NOT NULL,

    CONSTRAINT "CartItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Orders" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "payment_method" "public"."PaymentMethod" NOT NULL,
    "order_info_id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderDetails" (
    "id" TEXT NOT NULL,
    "product_variant_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderInfos" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "receiver_name" TEXT NOT NULL,
    "receiver_phone" TEXT NOT NULL,

    CONSTRAINT "OrderInfos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vouchers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount_type" "public"."DiscountType" NOT NULL,
    "discount_value" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "min_order_value" DOUBLE PRECISION NOT NULL,
    "max_discount" DOUBLE PRECISION NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "usage_limit" INTEGER NOT NULL,

    CONSTRAINT "Vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "public"."Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_user_id_key" ON "public"."Cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vouchers_code_key" ON "public"."Vouchers"("code");

-- AddForeignKey
ALTER TABLE "public"."UserAddress" ADD CONSTRAINT "UserAddress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Products" ADD CONSTRAINT "Products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductVariants" ADD CONSTRAINT "ProductVariants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartItems" ADD CONSTRAINT "CartItems_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartItems" ADD CONSTRAINT "CartItems_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "public"."ProductVariants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Orders" ADD CONSTRAINT "Orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Orders" ADD CONSTRAINT "Orders_order_info_id_fkey" FOREIGN KEY ("order_info_id") REFERENCES "public"."OrderInfos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderDetails" ADD CONSTRAINT "OrderDetails_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderDetails" ADD CONSTRAINT "OrderDetails_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "public"."ProductVariants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
