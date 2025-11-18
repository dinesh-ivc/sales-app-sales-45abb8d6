import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';
import WebsiteVisit from '@/models/WebsiteVisit';
import StoreVisit from '@/models/StoreVisit';
import Product from '@/models/Product';

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

    await connectToDatabase();

    // Generate sample website visits
    const websiteVisitsData = Array.from({ length: 50 }, (_, i) => ({
      userId: decoded.id,
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      url: `https://example.com/page${i + 1}`,
      referrer: i % 3 === 0 ? 'https://google.com' : i % 3 === 1 ? 'https://facebook.com' : '',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      duration: Math.floor(Math.random() * 300) + 30,
      sessionId: `session-${Math.floor(Math.random() * 10000)}`,
    }));

    const createdWebsiteVisits = await WebsiteVisit.insertMany(websiteVisitsData);

    // Generate sample store visits
    const storeVisitsData = Array.from({ length: 30 }, (_, i) => ({
      userId: decoded.id,
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      location: `${['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][i % 5]}, Store #${i + 1}`,
      customerId: `CUST-${Math.floor(Math.random() * 10000)}`,
      productsViewed: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => 
        `PROD-${Math.floor(Math.random() * 100)}`
      ),
      purchaseMade: i % 3 !== 0,
      amount: i % 3 !== 0 ? parseFloat((Math.random() * 500).toFixed(2)) : 0,
      notes: i % 4 === 0 ? 'Interested in premium products' : ''
    }));

    const createdStoreVisits = await StoreVisit.insertMany(storeVisitsData);

    // Generate sample products
    const productsData = Array.from({ length: 20 }, (_, i) => ({
      userId: decoded.id,
      name: `Product ${String.fromCharCode(65 + i)}`,
      category: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'][i % 5],
      price: parseFloat((Math.random() * 200 + 10).toFixed(2)),
      stock: Math.floor(Math.random() * 100),
      sku: `SKU-${Math.floor(Math.random() * 10000)}`,
      description: `High-quality product ${String.fromCharCode(65 + i)} for everyday use`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
    }));

    const createdProducts = await Product.insertMany(productsData);

    return Response.json({
      message: 'Sample data generated successfully',
      data: {
        websiteVisits: createdWebsiteVisits.length,
        storeVisits: createdStoreVisits.length,
        products: createdProducts.length
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error generating sample data:', error);
    return Response.json({ error: 'Failed to generate sample data' }, { status: 500 });
  }
}