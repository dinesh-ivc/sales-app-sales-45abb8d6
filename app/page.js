'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Users, ShoppingCart, TrendingUp, Globe, Store, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate authentication check
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Centralized Analytics & Workflow Platform
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Track performance, understand customer behavior, and optimize sales outcomes with our comprehensive platform.
            </p>
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Sales Insights</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transform your sales data into actionable insights with our integrated analytics platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <BarChart className="w-10 h-10 text-blue-600 mb-4" />
              <CardTitle className="text-xl font-semibold">Performance Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Monitor key metrics and KPIs in real-time to measure sales team effectiveness and identify growth opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <Users className="w-10 h-10 text-green-600 mb-4" />
              <CardTitle className="text-xl font-semibold">Customer Behavior Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Understand customer journeys across digital and physical touchpoints to optimize engagement strategies.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-purple-600 mb-4" />
              <CardTitle className="text-xl font-semibold">Sales Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Leverage predictive analytics to forecast trends and make data-driven decisions that boost revenue.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Workflows Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Integrated Workflows</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Streamline your sales operations with our connected modules
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center p-6 h-auto rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-colors"
              onClick={() => router.push('/website-visits')}
            >
              <Globe className="w-8 h-8 text-blue-600 mb-3" />
              <span className="font-medium text-gray-900">Website Visits</span>
            </Button>

            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center p-6 h-auto rounded-xl hover:bg-green-50 hover:border-green-300 transition-colors"
              onClick={() => router.push('/store-visits')}
            >
              <Store className="w-8 h-8 text-green-600 mb-3" />
              <span className="font-medium text-gray-900">Store Visits</span>
            </Button>

            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center p-6 h-auto rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-colors"
              onClick={() => router.push('/products')}
            >
              <Package className="w-8 h-8 text-purple-600 mb-3" />
              <span className="font-medium text-gray-900">Products</span>
            </Button>

            <Button 
              variant="outline" 
              className="flex flex-col items-center justify-center p-6 h-auto rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-colors"
              onClick={() => router.push('/dashboard')}
            >
              <ShoppingCart className="w-8 h-8 text-orange-600 mb-3" />
              <span className="font-medium text-gray-900">Sales Dashboard</span>
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Sales?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
            Join thousands of businesses using our platform to drive growth and improve customer engagement.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold py-3 px-8 rounded-lg transition-all duration-300"
          >
            Start Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
}