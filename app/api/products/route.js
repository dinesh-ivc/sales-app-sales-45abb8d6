import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/jwt';
import { productSchema } from '@/lib/validation';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 });

    return Response.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    await connectToDatabase();
    const newProduct = new Product({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedProduct = await newProduct.save();

    return Response.json(savedProduct, { status: 201 });
  } catch (error) {
    if (error.name === 'ZodError') {
      return Response.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }

    if (error.code === 11000) {
      return Response.json({ error: 'Product with this name already exists' }, { status: 409 });
    }

    console.error('Error creating product:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}