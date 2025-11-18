'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, User, Hash, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

export default function CreateWebsiteVisitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    visitorName: '',
    visitDate: format(new Date(), 'yyyy-MM-dd'),
    visitTime: '',
    location: '',
    purpose: '',
    visitorCount: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/website-visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/website-visits');
        router.refresh();
      } else {
        const errorData = await response.json();
        console.error('Failed to create website visit:', errorData.error);
        // In a real app, you'd show this error to the user
      }
    } catch (error) {
      console.error('Error creating website visit:', error);
      // In a real app, you'd show this error to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            Create Website Visit Record
          </CardTitle>
          <CardDescription>
            Add a new website visit record to track customer engagement and behavior
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="visitorName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Visitor Name
              </Label>
              <Input
                id="visitorName"
                name="visitorName"
                value={formData.visitorName}
                onChange={handleInputChange}
                placeholder="Enter visitor name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="visitDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Visit Date
                </Label>
                <Input
                  id="visitDate"
                  name="visitDate"
                  type="date"
                  value={formData.visitDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visitTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Visit Time
                </Label>
                <Input
                  id="visitTime"
                  name="visitTime"
                  type="time"
                  value={formData.visitTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Purpose of Visit
              </Label>
              <Select name="purpose" value={formData.purpose} onValueChange={(value) => handleSelectChange('purpose', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="comparison">Comparison</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitorCount" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Number of Visitors
              </Label>
              <Input
                id="visitorCount"
                name="visitorCount"
                type="number"
                min="1"
                value={formData.visitorCount}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/website-visits')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Visit Record'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}