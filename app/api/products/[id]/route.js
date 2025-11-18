import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { authenticateToken } from '@/lib/jwt';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { message: 'Access token required' },
        { status: 401 }
      );
    }

    const userId = authenticateToken(token);
    if (!userId) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const data = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: data.name,
        price: data.price,
        category: data.category,
        stock: data.stock,
        description: data.description
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: updatedProduct._id,
      name: updatedProduct.name,
      price: updatedProduct.price,
      category: updatedProduct.category,
      stock: updatedProduct.stock,
      description: updatedProduct.description,
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt
    });
  } catch (error) {
    console.error('Error updating product:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { message: 'Validation error', errors: Object.values(error.errors).map(err => err.message) },
        { status: 400 }
      );
    }

    if (error.name === 'CastError') {
      return NextResponse.json(
        { message: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { message: 'Access token required' },
        { status: 401 }
      );
    }

    const userId = authenticateToken(token);
    if (!userId) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);

    if (error.name === 'CastError') {
      return NextResponse.json(
        { message: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}