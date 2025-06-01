import { prisma } from './client';
import { nanoid } from 'nanoid';
console.log(`✅ Generated products.`);

// Product categories for better organization
const categories = [
  'Electronics',
  'Fashion & Apparel',
  'Home & Garden',
  'Sports & Outdoors',
  'Health & Beauty',
  'Automotive',
  'Books & Media',
  'Toys & Games',
  'Food & Beverages',
  'Office Supplies'
];



prisma.category.createMany({
  data: categories,
});

// Sample product names by category
const productsByCategory = {
  'Electronics': [
    'Wireless Bluetooth Headphones',
    'Smartphone Case',
    'USB-C Charging Cable',
    'Portable Power Bank',
    'Wireless Mouse',
    'Bluetooth Speaker',
    'Phone Stand',
    'Screen Protector',
    'Tablet Holder',
    'Wireless Charger'
  ],
  'Fashion & Apparel': [
    'Cotton T-Shirt',
    'Denim Jeans',
    'Summer Dress',
    'Leather Jacket',
    'Sneakers',
    'Baseball Cap',
    'Wrist Watch',
    'Sunglasses',
    'Canvas Backpack',
    'Winter Scarf'
  ],
  'Home & Garden': [
    'Ceramic Coffee Mug',
    'Indoor Plant Pot',
    'LED Desk Lamp',
    'Throw Pillow',
    'Kitchen Utensil Set',
    'Storage Basket',
    'Picture Frame',
    'Candle Holder',
    'Garden Watering Can',
    'Decorative Vase'
  ],
  'Sports & Outdoors': [
    'Yoga Mat',
    'Water Bottle',
    'Resistance Bands',
    'Tennis Racket',
    'Hiking Backpack',
    'Camping Tent',
    'Bicycle Helmet',
    'Running Shoes',
    'Fishing Rod',
    'Basketball'
  ],
  'Health & Beauty': [
    'Face Moisturizer',
    'Shampoo Bottle',
    'Makeup Brush Set',
    'Essential Oil',
    'Body Lotion',
    'Lip Balm',
    'Hair Straightener',
    'Nail Polish',
    'Perfume',
    'Vitamin Supplements'
  ],
  'Automotive': [
    'Car Phone Mount',
    'Tire Pressure Gauge',
    'Car Air Freshener',
    'Jumper Cables',
    'Car Cleaning Kit',
    'Dashboard Camera',
    'Car Charger',
    'Seat Covers',
    'Floor Mats',
    'Emergency Kit'
  ],
  'Books & Media': [
    'Programming Guide',
    'Cook Book',
    'Mystery Novel',
    'History Book',
    'Art Magazine',
    'Children Story Book',
    'Music CD',
    'Educational DVD',
    'Travel Guide',
    'Biography'
  ],
  'Toys & Games': [
    'Building Blocks',
    'Puzzle Game',
    'Action Figure',
    'Board Game',
    'Stuffed Animal',
    'Remote Control Car',
    'Art Supplies Kit',
    'Educational Toy',
    'Card Game',
    'Musical Instrument'
  ],
  'Food & Beverages': [
    'Organic Coffee Beans',
    'Green Tea',
    'Chocolate Bar',
    'Honey Jar',
    'Olive Oil',
    'Spice Mix',
    'Energy Drink',
    'Protein Bar',
    'Fruit Juice',
    'Cookies Pack'
  ],
  'Office Supplies': [
    'Notebook',
    'Ballpoint Pen',
    'Sticky Notes',
    'File Folder',
    'Desk Organizer',
    'Calculator',
    'Stapler',
    'Paper Clips',
    'Highlighter',
    'Rubber Eraser'
  ]
};

// Helper function to generate random price
function randomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate random stock quantity
function randomStock(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate SKU
function generateSKU(categoryIndex: number, productIndex: number): string {
  const categoryCode = categories[categoryIndex].substring(0, 3).toUpperCase();
  const productCode = String(productIndex).padStart(3, '0');
  return `${categoryCode}-${productCode}`;
}

// Helper function to generate slug with nanoid
function generateSlug(name: string): string {
  const cleanName = name.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
  
  // Generate a short nanoid (6 characters) and combine with name
  const id = nanoid(6);
  return `${cleanName}-${id}`;
}

// Helper function to generate description
function generateDescription(name: string, category: string): string {
  const descriptions = [
    `High-quality ${name.toLowerCase()} perfect for everyday use. Made with premium materials and designed for durability.`,
    `Professional grade ${name.toLowerCase()} suitable for both personal and commercial use. Excellent value for money.`,
    `Premium ${name.toLowerCase()} with modern design and superior functionality. Ideal for ${category.toLowerCase()} enthusiasts.`,
    `Versatile ${name.toLowerCase()} that combines style and performance. Perfect addition to your ${category.toLowerCase()} collection.`,
    `Innovative ${name.toLowerCase()} featuring the latest technology and ergonomic design. Great for daily use.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Helper function to generate image URL
function generateImageUrl(category: string, productName: string): string {
  // Using a placeholder image service
  const cleanName = productName.replace(/\s+/g, '+');
  return `https://images.unsplash.com/400x400/?${cleanName}`;
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing products
  console.log('🧹 Clearing existing products...');
  await prisma.product.deleteMany({});

  const products = [];
  let productCounter = 1;

  // Generate 10 products (1 from each category)
  for (let categoryIndex = 0; categoryIndex < Math.min(10, categories.length); categoryIndex++) {
    const category = categories[categoryIndex];
    const productNames = productsByCategory[category];

    // Take only the first product from each category
    const productName = productNames[0];
    const sku = generateSKU(categoryIndex, productCounter);
    const slug = generateSlug(productName);
    
    const product = {
      sku,
      slug,
      name: productName,
      description: generateDescription(productName, category),
      price: randomPrice(10, 500), // Random price between $10 and $500
      imageUrl: generateImageUrl(category, productName),
      stockQuantity: randomStock(0, 100), // Random stock between 0 and 100
      minimumOrderQuantity: Math.floor(Math.random() * 3) + 1, // 1-3 minimum order
      categoryId: 1,
      status: 'active', // Default status
    };

    products.push(product);
    productCounter++;
  }
  console.log(`✅ Generated ${products.length} products.`);
  // Insert products in batches for better performance
  console.log('📦 Inserting products...');
  const batchSize = 20;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    await prisma.product.createMany({
      data: batch,
    });
    console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}`);
  }

  // Get final count
  const totalProducts = await prisma.product.count();
  console.log(`🎉 Successfully seeded ${totalProducts} products!`);

  // Show some sample data
  console.log('\n📊 Sample products:');
  const sampleProducts = await prisma.product.findMany({
    take: 5,
    select: {
      sku: true,
      name: true,
      price: true,
      stockQuantity: true,
    },
  });

  sampleProducts.forEach((product) => {
    console.log(`  - ${product.name} (${product.sku}) - $${product.price} - Stock: ${product.stockQuantity}`);
  });

  console.log('\n✨ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
