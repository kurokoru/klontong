import { initTRPC } from '@trpc/server';
import type { Context } from './context';
import { updateSchema, productFiltersSchema } from './schemas';
import { prisma } from "@repo/db";

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;
const router = t.router;
export const createCallerFactory = t.createCallerFactory;

export const appRouter = router({
  update: publicProcedure.input(updateSchema).mutation(() => {
  }),
  get: publicProcedure.query(() => {
    const product = prisma.product.findFirst();
    console.log(product, 'product');
    return product
  }),
  getProducts: publicProcedure
    .input(productFiltersSchema)
    .query(async ({ input }) => {
      const {
        search,
        category,
        minPrice,
        maxPrice,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page,
        limit
      } = input;

      // Build where clause for filtering
      const where: any = {};
      console.log('Input filters:', input);
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      
      // if (category) {
      //   where.categoryId = category;
      // }
      
      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
      }
      
      if (status) {
        where.status = status;
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      try {
        // Get total count for pagination
        const total = await prisma.product.count({ where });
        
        // Get products with filters
        const products = await prisma.product.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
          // include: {
          //   category: true, // Include category relation if needed
          // }
        });

        return {
          products,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          }
        };
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }),
});

export const createCaller = createCallerFactory(appRouter);
export type AppRouter = typeof appRouter;