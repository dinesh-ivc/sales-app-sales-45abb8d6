'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function EditWebsiteVisitPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [websiteVisit, setWebsiteVisit] = useState({
    visitorId: '',
    pageUrl: '',
    visitDuration: '',
    timestamp: '',
    userAgent: '',
    ipAddress: '',
    referrer: '',
    conversion: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchWebsiteVisit = async () => {
      try {
        const response = await axios.get(`/api/website-visits/${id}`);
        const visitData = response.data.data;
        setWebsiteVisit({
          ...visitData,
          timestamp: new Date(visitData.timestamp).toISOString().slice(0, 16) // Format for datetime-local input
        });
        setLoading(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to fetch website visit data',
          variant: 'destructive'
        });
        router.push('/website-visits');
      }
    };

    if (id) {
      fetchWebsiteVisit();
    }
  }, [id, router, toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setWebsiteVisit(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(`/api/website-visits/${id}`, websiteVisit);
      toast({
        title: 'Success',
        description: 'Website visit updated successfully'
      });
      router.push('/website-visits');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update website visit',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Website Visit</h1>
        <p>Loading website visit data...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Edit Website Visit</h1>

        <Card>
          <CardHeader>
            <CardTitle>Visit Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="visitorId">Visitor ID</Label>
                  <Input
                    id="visitorId"
                    name="visitorId"
                    value={websiteVisit.visitorId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="pageUrl">Page URL</Label>
                  <Input
                    id="pageUrl"
                    name="pageUrl"
                    type="url"
                    value={websiteVisit.pageUrl}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="visitDuration">Visit Duration (seconds)</Label>
                  <Input
                    id="visitDuration"
                    name="visitDuration"
                    type="number"
                    min="0"
                    value={websiteVisit.visitDuration}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="timestamp">Visit Time</Label>
                  <Input
                    id="timestamp"
                    name="timestamp"
                    type="datetime-local"
                    value={websiteVisit.timestamp}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="userAgent">User Agent</Label>
                  <Input
                    id="userAgent"
                    name="userAgent"
                    value={websiteVisit.userAgent}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="ipAddress">IP Address</Label>
                  <Input
                    id="ipAddress"
                    name="ipAddress"
                    value={websiteVisit.ipAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="referrer">Referrer</Label>
                <Input
                  id="referrer"
                  name="referrer"
                  value={websiteVisit.referrer}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  id="conversion"
                  name="conversion"
                  type="checkbox"
                  checked={websiteVisit.conversion}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <Label htmlFor="conversion">Conversion</Label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/website-visits')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}