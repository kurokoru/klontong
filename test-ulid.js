const { PrismaClient } = require('./packages/generated/prisma');

async function main() {
  console.log('Starting ULID test...');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('Checking existing products...');
    // First, let's see if we have existing test products
    const existingProducts = await prisma.product.findMany({
      where: {
        OR: [
          { sku: 'TEST-ULID-001' },
          { sku: 'TEST-ULID-002' }
        ]
      }
    });
    
    if (existingProducts.length > 0) {
      console.log('Deleting existing test products...');
      await Promise.all(
        existingProducts.map(product => 
          prisma.product.delete({
            where: { id: product.id }
          })
        )
      );
    }

    console.log('Creating first test product...');
    // Create a new product with ULID
    const newProduct = await prisma.product.create({
      data: {
        sku: 'TEST-ULID-001',
        slug: 'test-ulid-product',
        name: 'Test ULID Product',
        description: 'A test product to verify ULID generation',
        price: 19.99,
        stockQuantity: 10,
        minimumOrderQuantity: 1
      }
    });

    console.log('Created product with ULID:', newProduct.id);
    
    // Wait 1 second to ensure the ULIDs have different timestamps
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Creating second test product...');
    // Create another product to see a second ULID
    const anotherProduct = await prisma.product.create({
      data: {
        sku: 'TEST-ULID-002',
        slug: 'test-ulid-product-2',
        name: 'Test ULID Product 2',
        description: 'Another test product to verify ULID generation',
        price: 29.99,
        stockQuantity: 5,
        minimumOrderQuantity: 1
      }
    });

    console.log('Created second product with ULID:', anotherProduct.id);
    
    // Verify sorting capabilities of ULIDs
    console.log('ULID comparison (newer should be > older):', anotherProduct.id > newProduct.id);

    console.log('Fetching all products sorted by ID...');
    // Get all products
    const products = await prisma.product.findMany({
      orderBy: {
        id: 'asc'  // This should sort them chronologically due to ULID property
      }
    });

    console.log('All products sorted by creation time (oldest first):');
    products.forEach(product => {
      console.log(`- ${product.id}: ${product.name} (${product.sku})`);
    });

  } catch (error) {
    console.error('Error testing ULID:', error);
  } finally {
    console.log('Disconnecting from the database...');
    await prisma.$disconnect();
    console.log('Test completed.');
  }
}

// Execute main function
main().catch(e => {
  console.error('Unhandled error in main function:', e);
  process.exit(1);
});
