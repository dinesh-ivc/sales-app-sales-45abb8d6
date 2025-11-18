'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, Plus, Calendar, MapPin, User, TrendingUp } from 'lucide-react';
import axios from 'axios';

export default function StoreVisitsPage() {
  const [storeVisits, setStoreVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchStoreVisits();
  }, []);

  const fetchStoreVisits = async () => {
    try {
      const response = await axios.get('/api/store-visits');
      setStoreVisits(response.data);
    } catch (error) {
      console.error('Error fetching store visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Visits</h1>
          <p className="text-gray-600">Track and manage all in-store customer interactions</p>
        </div>
        <Button onClick={() => router.push('/store-visits/create')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Visit
        </Button>
      </div>

      {storeVisits.length === 0 ? (
        <Card className="text-center py-12">
          <Store className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No store visits recorded</h3>
          <p className="mt-1 text-gray-500">Get started by adding your first store visit.</p>
          <Button 
            onClick={() => router.push('/store-visits/create')}
            className="mt-4 flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create Store Visit
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {storeVisits.map((visit) => (
            <Card key={visit._id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/store-visits/${visit._id}/edit`)}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg truncate max-w-[70%]">{visit.storeName}</CardTitle>
                  <Badge className={getStatusColor(visit.status)}>{visit.status}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1 mt-2">
                  <MapPin className="w-4 h-4" />
                  {visit.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(visit.visitDate)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    {visit.visitorName}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {visit.potentialRevenue ? `$${visit.potentialRevenue.toLocaleString()}` : 'Not specified'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}