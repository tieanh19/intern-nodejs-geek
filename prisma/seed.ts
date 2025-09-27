import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Users - 10 realistic users
  const users = [];
  const userNames = [
    { username: 'nguyenvana', name: 'Nguyễn Văn A', password: '123456', email: 'nguyenvana@example.com' },
    { username: 'tranthib', name: 'Trần Thị B', password: '123456', email: 'tranthib@example.com' },
    { username: 'lequanghuy', name: 'Lê Quang Huy', password: '123456', email: 'lequanghuy@example.com' },
    { username: 'phamminh', name: 'Phạm Minh', password: '123456', email: 'phamminh@example.com' },
    { username: 'hoanglan', name: 'Hoàng Lan', password: '123456', email: 'hoanglan@example.com' },
    { username: 'vuducthang', name: 'Vũ Đức Thắng', password: '123456', email: 'vuducthang@example.com' },
    { username: 'dolinh', name: 'Đỗ Linh', password: '123456', email: 'dolinh@example.com' },
    { username: 'buivannam', name: 'Bùi Văn Nam', password: '123456', email: 'buivannam@example.com' },
    { username: 'ngothihoa', name: 'Ngô Thị Hoa', password: '123456', email: 'ngothihoa@example.com' },
    { username: 'dinhquocbao', name: 'Đinh Quốc Bảo', password: '123456', email: 'dinhquocbao@example.com' }
  ];

  for (let i = 0; i < userNames.length; i++) {
    users.push(await prisma.users.create({
      data: {
        username: userNames[i].username,
        password: await bcrypt.hash(userNames[i].password, 10),
        name: userNames[i].name,
        email: userNames[i].email
      },
    }));
  }

  // UserAddress - 10 realistic addresses
  const addresses = [
    { province: 'TP.HCM', district: 'Quận 1', ward: 'Phường Bến Nghé', receiver: 'Nguyễn Văn A', phone: '0901234567' },
    { province: 'Hà Nội', district: 'Ba Đình', ward: 'Phường Cống Vị', receiver: 'Trần Thị B', phone: '0912345678' },
    { province: 'Đà Nẵng', district: 'Hải Châu', ward: 'Phường Thạch Thang', receiver: 'Lê Quang Huy', phone: '0923456789' },
    { province: 'TP.HCM', district: 'Quận 3', ward: 'Phường Võ Thị Sáu', receiver: 'Phạm Minh', phone: '0934567890' },
    { province: 'Hà Nội', district: 'Hoàn Kiếm', ward: 'Phường Hàng Bông', receiver: 'Hoàng Lan', phone: '0945678901' },
    { province: 'TP.HCM', district: 'Tân Bình', ward: 'Phường 12', receiver: 'Vũ Đức Thắng', phone: '0956789012' },
    { province: 'Hải Phòng', district: 'Ngô Quyền', ward: 'Phường Lạc Viên', receiver: 'Đỗ Linh', phone: '0967890123' },
    { province: 'Cần Thơ', district: 'Ninh Kiều', ward: 'Phường Cái Khế', receiver: 'Bùi Văn Nam', phone: '0978901234' },
    { province: 'TP.HCM', district: 'Quận 7', ward: 'Phường Tân Thuận Đông', receiver: 'Ngô Thị Hoa', phone: '0989012345' },
    { province: 'Hà Nội', district: 'Cầu Giấy', ward: 'Phường Dịch Vọng', receiver: 'Đinh Quốc Bảo', phone: '0990123456' }
  ];

  for (let i = 0; i < addresses.length; i++) {
    await prisma.userAddress.create({
      data: {
        province: addresses[i].province,
        district: addresses[i].district,
        ward: addresses[i].ward,
        user_name: addresses[i].receiver,
        user_phone: addresses[i].phone,
        user_id: users[i].id,
        is_default: i === 0,
      },
    });
  }

  // StoreBranches - 10 realistic store branches
  const branches = [
    { name: 'Chi nhánh Quận 1', phone: '0283891234', address: '123 Nguyễn Huệ, Quận 1, TP.HCM' },
    { name: 'Chi nhánh Hàng Bạc', phone: '0243891234', address: '456 Hàng Bạc, Hoàn Kiếm, Hà Nội' },
    { name: 'Chi nhánh Đà Nẵng', phone: '0238391234', address: '789 Trần Phú, Hải Châu, Đà Nẵng' },
    { name: 'Chi nhánh Tân Bình', phone: '0283892345', address: '321 Cộng Hòa, Tân Bình, TP.HCM' },
    { name: 'Chi nhánh Cầu Giấy', phone: '0243892345', address: '654 Cầu Giấy, Cầu Giấy, Hà Nội' },
    { name: 'Chi nhánh Quận 7', phone: '0283893456', address: '987 Nguyễn Thị Thập, Quận 7, TP.HCM' },
    { name: 'Chi nhánh Hải Phòng', phone: '0253893456', address: '159 Lạch Tray, Ngô Quyền, Hải Phòng' },
    { name: 'Chi nhánh Cần Thơ', phone: '0293893456', address: '753 Trần Hưng Đạo, Ninh Kiều, Cần Thơ' },
    { name: 'Chi nhánh Thủ Đức', phone: '0283894567', address: '852 Võ Văn Ngân, Thủ Đức, TP.HCM' },
    { name: 'Chi nhánh Long Biên', phone: '0243894567', address: '741 Nguyễn Văn Cừ, Long Biên, Hà Nội' }
  ];

  for (const branch of branches) {
    await prisma.storeBranches.create({
      data: branch,
    });
  }

  // Categories - 10 fashion categories
  const categories = [];
  const categoryData = [
    { name: 'Áo Thun Nam', description: 'Bộ sưu tập áo thun nam thời trang, chất liệu cotton cao cấp' },
    { name: 'Áo Sơ Mi Nữ', description: 'Áo sơ mi nữ công sở và dạo phố, kiểu dáng hiện đại' },
    { name: 'Quần Jeans', description: 'Quần jeans nam nữ, chất liệu denim bền đẹp, form chuẩn' },
    { name: 'Váy Đầm', description: 'Váy đầm nữ các loại, từ công sở đến dự tiệc' },
    { name: 'Áo Khoác', description: 'Áo khoác nam nữ, phù hợp mọi thời tiết và phong cách' },
    { name: 'Giày Sneaker', description: 'Giày sneaker thể thao, thời trang cho mọi lứa tuổi' },
    { name: 'Túi Xách', description: 'Túi xách nữ cao cấp, đa dạng mẫu mã và kích thước' },
    { name: 'Phụ Kiện', description: 'Phụ kiện thời trang: đồng hồ, kính mát, trang sức' },
    { name: 'Đồ Thể Thao', description: 'Trang phục thể thao nam nữ, chất liệu thoáng mát' },
    { name: 'Đồ Lót', description: 'Đồ lót nam nữ cao cấp, thoải mái và an toàn' }
  ];

  for (let i = 0; i < categoryData.length; i++) {
    categories.push(await prisma.categories.create({
      data: {
        imageUri: `https://picsum.photos/300/300?category=${i + 1}`,
        name: categoryData[i].name,
        description: categoryData[i].description,
      },
    }));
  }

  // Products - 10 realistic products
  const products = [];
  const productData = [
    { name: 'Áo Thun Basic Trắng', description: 'Áo thun nam basic màu trắng, chất liệu cotton 100%, form regular fit' },
    { name: 'Sơ Mi Oxford Xanh', description: 'Áo sơ mi nữ Oxford màu xanh nhạt, phong cách công sở thanh lịch' },
    { name: 'Quần Jeans Slim Fit', description: 'Quần jeans nam slim fit, màu xanh đen cổ điển, co giãn tốt' },
    { name: 'Váy Midi Hoa Nhí', description: 'Váy midi nữ họa tiết hoa nhí, phong cách vintage trang nhã' },
    { name: 'Áo Khoác Bomber', description: 'Áo khoác bomber unisex, màu đen basic, phong cách street style' },
    { name: 'Giày Sneaker Canvas', description: 'Giày sneaker canvas trắng, thiết kế tối giản, phù hợp mọi outfit' },
    { name: 'Túi Tote Vải Canvas', description: 'Túi tote canvas màu be, thiết kế đơn giản, tiện dụng hàng ngày' },
    { name: 'Đồng Hồ Thép Không Gỉ', description: 'Đồng hồ nam thép không gỉ, mặt số đen, chống nước 50m' },
    { name: 'Bộ Đồ Tập Yoga', description: 'Bộ đồ tập yoga nữ, chất liệu thun lạnh co giãn 4 chiều' },
    { name: 'Set Đồ Lót Cotton', description: 'Set đồ lót nam cotton cao cấp, thoáng mát, kháng khuẩn' }
  ];

  for (let i = 0; i < productData.length; i++) {
    products.push(await prisma.products.create({
      data: {
        name: productData[i].name,
        description: productData[i].description,
        category_id: categories[i].id,
        coverImg: `https://picsum.photos/400/400?product=${i + 1}`,
      },
    }));
  }

  // ProductVariants - 10 variants with realistic details
  const variants = [];
  const variantData = [
    { size: 'M', color: 'Trắng', price: 199000, quantity: 50, discount: 0 },
    { size: 'L', color: 'Xanh Nhạt', price: 299000, quantity: 30, discount: 10 },
    { size: '32', color: 'Xanh Đen', price: 599000, quantity: 25, discount: 15 },
    { size: 'Free Size', color: 'Hoa Nhí', price: 399000, quantity: 20, discount: 0 },
    { size: 'XL', color: 'Đen', price: 799000, quantity: 40, discount: 20 },
    { size: '42', color: 'Trắng', price: 1299000, quantity: 15, discount: 0 },
    { size: 'One Size', color: 'Be', price: 249000, quantity: 35, discount: 5 },
    { size: '40mm', color: 'Đen Bạc', price: 2999000, quantity: 10, discount: 25 },
    { size: 'S', color: 'Hồng Pastel', price: 459000, quantity: 45, discount: 10 },
    { size: 'L', color: 'Xám Đen', price: 199000, quantity: 60, discount: 0 }
  ];

  for (let i = 0; i < variantData.length; i++) {
    variants.push(await prisma.productVariants.create({
      data: {
        productId: products[i].id,
        size: variantData[i].size,
        color: variantData[i].color,
        imageUri: `https://picsum.photos/200/200?variant=${i + 1}`,
        price: variantData[i].price,
        quantity: variantData[i].quantity,
        discount_percentage: variantData[i].discount,
      },
    }));
  }

  // Cart - 10 shopping carts
  const carts = [];
  for (let i = 0; i < users.length; i++) {
    carts.push(await prisma.cart.create({
      data: {
        user_id: users[i].id,
      },
    }));
  }

  // CartItems - 10 cart items with realistic quantities
  const cartQuantities = [2, 1, 3, 1, 2, 1, 4, 1, 2, 3];
  for (let i = 0; i < carts.length; i++) {
    await prisma.cartItems.create({
      data: {
        product_variant_id: variants[i].id,
        quantity: cartQuantities[i],
        cartId: carts[i].id,
      },
    });
  }

  // Vouchers - 10 realistic promotional vouchers
  const voucherData = [
    { code: 'WELCOME10', type: 'PERCENTAGE' as const, value: 10, desc: 'Giảm 10% cho khách hàng mới', min: 200000, max: 50000 },
    { code: 'SUMMER50K', type: 'FIXED_AMOUNT' as const, value: 50000, desc: 'Giảm 50K cho đơn hàng mùa hè', min: 500000, max: 50000 },
    { code: 'STUDENT15', type: 'PERCENTAGE' as const, value: 15, desc: 'Ưu đãi 15% cho học sinh sinh viên', min: 300000, max: 100000 },
    { code: 'FREESHIP', type: 'FIXED_AMOUNT' as const, value: 30000, desc: 'Miễn phí vận chuyển toàn quốc', min: 150000, max: 30000 },
    { code: 'WEEKEND20', type: 'PERCENTAGE' as const, value: 20, desc: 'Giảm 20% cuối tuần', min: 400000, max: 150000 },
    { code: 'VIP100K', type: 'FIXED_AMOUNT' as const, value: 100000, desc: 'Voucher VIP giảm 100K', min: 1000000, max: 100000 },
    { code: 'FLASH25', type: 'PERCENTAGE' as const, value: 25, desc: 'Flash sale giảm 25%', min: 600000, max: 200000 },
    { code: 'NEWBIE5', type: 'PERCENTAGE' as const, value: 5, desc: 'Ưu đãi 5% đơn hàng đầu tiên', min: 100000, max: 25000 },
    { code: 'LOYAL30', type: 'PERCENTAGE' as const, value: 30, desc: 'Khách hàng thân thiết giảm 30%', min: 800000, max: 300000 },
    { code: 'HOLIDAY75K', type: 'FIXED_AMOUNT' as const, value: 75000, desc: 'Giảm 75K dịp lễ', min: 700000, max: 75000 }
  ];

  for (const voucher of voucherData) {
    await prisma.vouchers.create({
      data: {
        code: voucher.code,
        discount_type: voucher.type,
        discount_value: voucher.value,
        description: voucher.desc,
        min_order_value: voucher.min,
        max_discount: voucher.max,
        start_date: new Date(),
        end_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
        usage_limit: 100,
      },
    });
  }

  console.log('✅ Database seeded successfully with realistic data!');
  console.log(`📊 Created:
    - ${users.length} users
    - ${addresses.length} user addresses  
    - ${branches.length} store branches
    - ${categories.length} product categories
    - ${products.length} products
    - ${variants.length} product variants
    - ${carts.length} shopping carts
    - ${carts.length} cart items
    - ${voucherData.length} vouchers
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
