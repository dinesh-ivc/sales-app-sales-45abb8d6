'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Globe, 
  Calendar, 
  Clock, 
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import WebsiteVisitsTable from '@/components/WebsiteVisitsTable';
import { useRouter } from 'next/navigation';

export default function WebsiteVisitsPage() {
  const [visits, setVisits] = useState([]);
  const [stats, setStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    avgDuration: 0,
    conversionRate: 0
  });
  const router = useRouter();

  useEffect(() => {
    fetchVisits();
    fetchStats();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await fetch('/api/website-visits');
      const data = await response.json();
      setVisits(data);
    } catch (error) {
      console.error('Error fetching website visits:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/website-visits');
      const data = await response.json();

      const totalVisits = data.length;
      const uniqueVisitors = new Set(data.map(visit => visit.visitorId)).size;
      const totalDuration = data.reduce((sum, visit) => sum + (visit.duration || 0), 0);
      const avgDuration = totalVisits > 0 ? Math.round(totalDuration / totalVisits) : 0;
      const conversions = data.filter(visit => visit.converted).length;
      const conversionRate = totalVisits > 0 ? Math.round((conversions / totalVisits) * 100) : 0;

      setStats({
        totalVisits,
        uniqueVisitors,
        avgDuration,
        conversionRate
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this website visit record?')) {
      try {
        const response = await fetch(`/api/website-visits/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchVisits();
          fetchStats();
        } else {
          console.error('Failed to delete website visit');
        }
      } catch (error) {
        console.error('Error deleting website visit:', error);
      }
    }
  };

  const handleEdit = (id) => {
    router.push(`/website-visits/${id}/edit`);
  };

  const handleCreate = () => {
    router.push('/website-visits/create');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Visits</h1>
          <p className="text-gray-600 mt-2">Track and analyze customer website interactions</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Visit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueVisitors}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDuration}s</div>
            <p className="text-xs text-muted-foreground">+3s from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visit Records
            </CardTitle>
            <Badge variant="secondary">{visits.length} records</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <WebsiteVisitsTable 
            visits={visits} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </CardContent>
      </Card>
    </div>
  );
}