'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Users, ShoppingCart, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Optimize Your Sales Performance
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            A centralized analytics and workflow platform designed to help businesses track performance, 
            understand customer behavior, and optimize sales outcomes.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-300 flex items-center mx-auto"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Powerful Analytics & Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <BarChart className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle className="text-xl font-semibold">Website Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Monitor visitor behavior, traffic sources, and conversion funnels to optimize your digital presence.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Users className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle className="text-xl font-semibold">Customer Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Understand customer demographics, preferences, and purchasing patterns for targeted strategies.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <ShoppingCart className="h-10 w-10 text-purple-600 mb-4" />
                <CardTitle className="text-xl font-semibold">Sales Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track product performance, seasonal trends, and sales pipelines to maximize revenue opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-red-600 mb-4" />
                <CardTitle className="text-xl font-semibold">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Real-time KPI dashboards with customizable reports to drive data-informed business decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Sales Strategy?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Join hundreds of businesses leveraging our platform to gain actionable insights and boost their sales performance.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            variant="secondary"
            className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition duration-300"
          >
            Start Free Trial
          </Button>
        </div>
      </section>
    </div>
  );
}